import net from "node:net";
import tls from "node:tls";
import { promises as dnsPromises } from "node:dns";

import { MongoClient } from "mongodb";

/**
 * Staged, credential-free MongoDB connectivity probe — diagnostics ONLY.
 *
 * When the credentialed driver ping fails we currently know only that *something*
 * between the Vercel runtime and Atlas refused. This probe repeats the journey
 * one stage at a time so the exact failing step becomes visible in /api/health
 * and in the Vercel logs:
 *
 *   1. srv  — can the runtime resolve Atlas `_mongodb._tcp` SRV records?
 *   2. tcp  — can it open a raw TCP socket to a shard endpoint?
 *   3. tls  — can it complete a TLS handshake on that socket?
 *   4. ping — does an *anonymous* driver ping get answered? (An
 *             "authentication required" reply still proves the network path.)
 *
 * Nothing here ever includes credentials in its output: error strings are
 * scrubbed through `scrub()`, and the anonymous ping uses a credential-stripped
 * copy of the URI that is never printed.
 */

const STAGE_TIMEOUT_MS = 4_000;
const PING_STAGE_TIMEOUT_MS = 6_000;

export interface ProbeStage {
  ok: boolean;
  detail: string;
  ms?: number;
  /** Endpoint used for tcp/tls, e.g. `cluster0-shard-00-00.x.mongodb.net:27017`. */
  endpoint?: string;
  /** Resolved SRV targets (public DNS data — safe to show, capped at 3). */
  srvTargets?: string[];
  skipped?: boolean;
}

export interface ConnectivityProbe {
  ran: boolean;
  srv?: ProbeStage;
  tcp?: ProbeStage;
  tls?: ProbeStage;
  ping?: ProbeStage;
  verdict: string;
}

/** Removes anything that looks like `user:password@` from a diagnostic string. */
function scrub(text: string): string {
  return text.replace(/[A-Za-z0-9+._-]+\s*:\s*[^@\s]+@/g, "[redacted]@");
}

function firstLine(text: string, max = 180): string {
  const line = scrub(String(text)).split("\n")[0].trim();
  return line.length > max ? `${line.slice(0, max)}…` : line;
}

interface ParsedTarget {
  isSrv: boolean;
  hostname: string;
  port: number;
  /** Same URI with the userinfo (username/password) removed — never logged. */
  anonymousUri: string;
  database: string;
}

function parseMongoTarget(): ParsedTarget | null {
  const raw = process.env.MONGODB_URI?.trim();
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    const isSrv = parsed.protocol.replace(":", "") === "mongodb+srv";
    const anonymous = new URL(raw);
    anonymous.username = "";
    anonymous.password = "";
    return {
      isSrv,
      hostname: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 27017,
      anonymousUri: anonymous.toString(),
      database: decodeURIComponent(parsed.pathname.replace(/^\//, "")) || "admin",
    };
  } catch {
    return null;
  }
}

async function withTimeout<T>(
    label: string,
    ms: number,
    run: () => Promise<T>,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      run(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Splits `host:port` (an SRV target or seed-list entry) into diallable parts. */
function splitEndpoint(endpoint: string, fallbackPort: number): { host: string; port: number } {
  const trimmed = endpoint.trim();
  const lastColon = trimmed.lastIndexOf(":");
  if (lastColon > -1) {
    const port = Number(trimmed.slice(lastColon + 1));
    if (Number.isFinite(port) && port > 0) {
      return { host: trimmed.slice(0, lastColon), port };
    }
  }
  return { host: trimmed, port: fallbackPort };
}

/** Raw TCP connect (no TLS) to `endpoint`. Resolves true/false, never throws. */
function tryTcp(host: string, port: number): Promise<{ ok: boolean; detail: string; ms: number }> {
  const started = Date.now();
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const finish = (ok: boolean, detail: string) => {
      socket.destroy();
      resolve({ ok, detail, ms: Date.now() - started });
    };
    socket.setTimeout(STAGE_TIMEOUT_MS, () => finish(false, `TCP connect timed out after ${STAGE_TIMEOUT_MS}ms`));
    socket.once("connect", () => finish(true, "TCP socket opened"));
    socket.once("error", (error: NodeJS.ErrnoException) =>
      finish(false, `TCP connect failed: ${error.code ?? error.name}: ${firstLine(error.message)}`),
    );
  });
}

/** TLS handshake on a fresh socket to `endpoint`. Resolves, never throws. */
function tryTls(host: string, port: number): Promise<{ ok: boolean; detail: string; ms: number }> {
  const started = Date.now();
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port, servername: host, rejectUnauthorized: true });
    const finish = (ok: boolean, detail: string) => {
      socket.destroy();
      resolve({ ok, detail, ms: Date.now() - started });
    };
    socket.setTimeout(STAGE_TIMEOUT_MS, () => finish(false, `TLS handshake timed out after ${STAGE_TIMEOUT_MS}ms`));
    socket.once("secureConnect", () =>
      finish(true, `TLS handshake ok (${socket.getProtocol() ?? "unknown protocol"})`),
    );
    socket.once("error", (error: NodeJS.ErrnoException) =>
      finish(false, `TLS handshake failed: ${error.code ?? error.name}: ${firstLine(error.message)}`),
    );
  });
}

/**
 * Anonymous driver ping. Any *authentication* response still proves the whole
 * network path (DNS → TCP → TLS → wire protocol) is working.
 */
async function tryAnonymousPing(
  anonymousUri: string,
  database: string,
): Promise<ProbeStage> {
  const client = new MongoClient(anonymousUri, {
    serverSelectionTimeoutMS: 5_000,
    connectTimeoutMS: 5_000,
    socketTimeoutMS: 5_000,
    appName: "qurbanihat-health-probe",
  });
  try {
    await withTimeout("anonymous ping", PING_STAGE_TIMEOUT_MS, () =>
      client.db(database).command({ ping: 1 }),
    );
    return { ok: true, detail: "anonymous ping succeeded (server is fully reachable)" };
  } catch (error) {
    const err = error as { name?: string; message?: string; code?: number; codeName?: string };
    const message = `${err.name ?? ""} ${err.codeName ?? ""} ${err.message ?? ""}`;
    if (/\b(Unauthorized|AuthenticationFailed)\b|auth/i.test(message)) {
      return {
        ok: true,
        detail:
          "server answered with an authentication requirement — DNS, TCP and TLS all work; " +
          "a failing credentialed ping therefore points at the database user/URI, not the network",
      };
    }
    return { ok: false, detail: `anonymous ping failed: ${firstLine(err.message ?? String(error))}` };
  } finally {
    client.close(true).catch(() => {});
  }
}

/**
 * Runs the staged probe. Always resolves — a probe failure is data, not an
 * exception — and is safe to expose: no secrets are ever included.
 */
export async function runConnectivityProbe(): Promise<ConnectivityProbe> {
  const target = parseMongoTarget();
  if (!target) {
    return { ran: true, verdict: "MONGODB_URI is missing or unparsable — nothing to probe." };
  }

  const probe: ConnectivityProbe = { ran: true, verdict: "" };
  let endpoint = `${target.hostname}:${target.port}`;

  // Stage 1 — SRV (only meaningful for mongodb+srv URIs).
  if (target.isSrv) {
    try {
      const records = await withTimeout("SRV lookup", STAGE_TIMEOUT_MS, () =>
        dnsPromises.resolveSrv(`_mongodb._tcp.${target.hostname}`),
      );
      probe.srv = {
        ok: records.length > 0,
        detail:
          records.length > 0
            ? `resolved ${records.length} SRV record(s) for _mongodb._tcp.${target.hostname}`
            : "SRV lookup returned no records",
        srvTargets: records.slice(0, 3).map((record) => `${record.name}:${record.port}`),
      };
      const first = records[0];
      if (first) endpoint = `${first.name}:${first.port}`;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      probe.srv = {
        ok: false,
        detail: `SRV lookup failed: ${err.code ?? err.name}: ${firstLine(err.message ?? String(error))}`,
      };
    }
  } else {
    probe.srv = { ok: true, skipped: true, detail: "URI is a standard seed-list (no SRV lookup needed)" };
  }

  // Stage 2 — raw TCP against the REAL shard endpoint, not the SRV parent name.
  // `cluster0.x.mongodb.net` is SRV-only (no A record by design), so dialling it
  // directly always fails with ENOTFOUND even when Atlas is perfectly healthy.
  const { host: tcpHost, port: tcpPort } = splitEndpoint(endpoint, target.port);
  const tcp = await tryTcp(tcpHost, tcpPort);
  probe.tcp = { ok: tcp.ok, detail: tcp.detail, ms: tcp.ms, endpoint };
  if (!tcp.ok) {
    probe.tls = { ok: false, skipped: true, detail: "skipped (TCP failed)" };
    probe.ping = { ok: false, skipped: true, detail: "skipped (TCP failed)" };
    probe.verdict =
      `The Vercel runtime cannot open even a raw TCP socket to Atlas (${endpoint}). ` +
      "This is a firewall/allowlist effect: confirm Atlas → Network Access really contains 0.0.0.0/0 " +
      "for THIS project's cluster (not another project), that the entry is not temporary/expired, " +
      "and that the cluster is not paused.";
    return probe;
  }

  // Stage 3 — TLS against the same shard endpoint.
  const tlsResult = await tryTls(tcpHost, tcpPort);
  probe.tls = { ok: tlsResult.ok, detail: tlsResult.detail, ms: tlsResult.ms, endpoint };
  if (!tlsResult.ok) {
    probe.ping = { ok: false, skipped: true, detail: "skipped (TLS failed)" };
    probe.verdict =
      "TCP works but the TLS handshake with Atlas fails — outbound TLS from the Vercel runtime is " +
      "being intercepted or dropped. Re-check Atlas cluster status, then redeploy and retest.";
    return probe;
  }

  // Stage 4 — anonymous ping.
  probe.ping = await tryAnonymousPing(target.anonymousUri, target.database);
  probe.verdict = probe.ping.ok
    ? "Network path to Atlas is fully working end-to-end from this runtime."
    : "TLS works but the server never answered the wire-protocol ping — unusual; inspect Atlas cluster status.";
  return probe;
}
