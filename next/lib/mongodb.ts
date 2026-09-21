import { MongoClient, type Db } from "mongodb";

/**
 * MongoDB connection helper.
 *
 * Better Auth persists users, sessions and OAuth accounts in MongoDB through
 * `mongodbAdapter` (see lib/auth.ts). The client is cached on `globalThis` so
 * Next.js dev-mode hot reloads and serverless invocations do not open a new
 * connection pool on every request.
 *
 * MONGODB_URI is a server-only secret. Nothing in this module ever logs the
 * connection string itself — only the credential-free label produced by
 * `maskMongoTarget()` / `redactSecrets()`. That is what makes it safe to report
 * a MongoDB problem through `app/api/health/route.ts` and the server logs.
 *
 * Diagnosing an unreachable database
 * ----------------------------------
 * When MongoDB cannot be reached, Better Auth logs the driver error and answers
 * with a *bodyless* HTTP 500. The browser therefore receives no message at all
 * and every auth feature (Google OAuth *and* email/password) fails before the
 * request ever leaves the app — the Google consent screen is never opened.
 * `getDatabaseStatus()` turns that silent failure into an explicit, actionable
 * diagnosis (see lib/auth-guard.ts and app/api/health/route.ts).
 */

const FALLBACK_URI = "mongodb://127.0.0.1:27017";
const DEFAULT_DB = "qurbanihat";

/** Fail fast: a serverless request must never hang while Atlas is unreachable. */
const SERVER_SELECTION_TIMEOUT_MS = 5000;
const CONNECT_TIMEOUT_MS = 5000;
const MAX_POOL_SIZE = 10;
const MAX_IDLE_TIME_MS = 30_000;
const HEALTH_TIMEOUT_MS = 6000;
const HEALTH_CACHE_MS = 15_000;

declare global {
  var __qurbaniHatMongoClient__: MongoClient | undefined;
  var __qurbaniHatMongoWarned__: boolean | undefined;
}

function readUri(): string | undefined {
  const uri = process.env.MONGODB_URI?.trim();
  return uri && uri.length > 0 ? uri : undefined;
}

/**
 * True when a MongoDB connection string is present. Used for diagnosics only —
 * the value itself is never sent to a client.
 */
export function isDatabaseConfigured(): boolean {
  return readUri() !== undefined;
}

/** Database Better Auth stores its collections in. */
export function getDatabaseName(): string {
  return process.env.MONGODB_DB?.trim() || DEFAULT_DB;
}

/**
 * Credential-free label for logs, e.g. `cluster0.m2wttjg.mongodb.net/Qurbani-Hat`.
 * `new URL()` never exposes the user/password through `host` or `pathname`, so
 * this is always safe to print.
 */
export function maskMongoTarget(uri?: string | null): string {
  const value = (uri ?? readUri())?.trim();
  if (!value) return "unset";
  try {
    const parsed = new URL(value);
    const db = parsed.pathname.replace(/^\//, "");
    return db ? `${parsed.host}/${db}` : parsed.host;
  } catch {
    return "unparsable";
  }
}

/** Strips any credentials from free text so it can be logged safely. */
export function redactSecrets(text: string): string {
  return text
    .replace(/\/\/[^/\s@]+:[^/\s@]*@/g, "//<credentials>@")
    .replace(/(mongodb(?:\+srv)?:\/\/)[^\s"']+/gi, "$1<redacted>");
}

/**
 * Short, credential-free summary of an arbitrary error, safe for server logs.
 */
export function summarizeError(error: unknown): string {
  if (error instanceof Error) {
    return redactSecrets(`${error.name}: ${error.message}`).slice(0, 300);
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return redactSecrets(message).slice(0, 300);
  }
  if (typeof error === "string") return redactSecrets(error).slice(0, 300);
  return "unknown error";
}

export type DatabaseFailureKind =
  | "ok"
  | "not-configured"
  | "unreachable"
  | "dns"
  | "authentication"
  | "topology-closed"
  | "invalid-uri"
  | "timeout"
  | "unknown";

/** Maps a driver error onto a short, credential-free explanation. */
export function describeMongoFailure(error: unknown): {
  kind: DatabaseFailureKind;
  detail: string;
} {
  const text = summarizeError(error);

  if (/MongoTopologyClosedError|Topology is closed/i.test(text)) {
    return {
      kind: "topology-closed",
      detail:
        "the cached MongoDB connection pool was closed after a failed connection, so this server instance can no longer reach the database",
    };
  }
  if (/ECONNREFUSED/i.test(text)) {
    return {
      kind: "unreachable",
      detail:
        "the connection was refused — nothing is listening at that address (usually a missing MONGODB_URI, which falls back to a local address that does not exist on a serverless host)",
    };
  }
  if (/querySrv|ENOTFOUND|ESERVFAIL|EAI_AGAIN/i.test(text)) {
    return {
      kind: "dns",
      detail: "the MongoDB hostname could not be resolved (DNS / SRV lookup failed)",
    };
  }
  if (/Authentication failed|bad auth|SCRAM|not authorized/i.test(text)) {
    return {
      kind: "authentication",
      detail: "MongoDB rejected the credentials in MONGODB_URI (check the user, password and database access)",
    };
  }
  if (/MongoParseError|Invalid scheme|Invalid connection string/i.test(text)) {
    return {
      kind: "invalid-uri",
      detail: "MONGODB_URI is not a valid MongoDB connection string",
    };
  }
  if (/ETIMEDOUT|ESOCKETTIMEDOUT|timed out|MongoNetworkTimeoutError|timeout/i.test(text)) {
    return {
      kind: "timeout",
      detail:
        "the connection to MongoDB timed out — on a serverless host this usually means MongoDB Atlas Network Access does not allow the deployment's IP address",
    };
  }
  if (/MongoServerSelectionError|Server selection/i.test(text)) {
    return {
      kind: "unreachable",
      detail:
        "no MongoDB server could be selected — the host is unreachable, the client IP is blocked, or the credentials are wrong",
    };
  }
  return { kind: "unknown", detail: text };
}

export function getMongoClient(): MongoClient {
  if (!global.__qurbaniHatMongoClient__) {
    const uri = readUri();

    if (!uri && !global.__qurbaniHatMongoWarned__) {
      global.__qurbaniHatMongoWarned__ = true;
      console.error(
        "[QurbaniHat] MONGODB_URI is not set for this deployment. Authentication " +
          "and session lookups will fail until it is configured:\n" +
          "  local  -> add MONGODB_URI to next/.env.local\n" +
          "  Vercel -> Project -> Settings -> Environment Variables -> Production\n" +
          `Falling back to "${maskMongoTarget(FALLBACK_URI)}" until then, which does ` +
          "not exist on a serverless host.",
      );
    }

    global.__qurbaniHatMongoClient__ = new MongoClient(uri ?? FALLBACK_URI, {
      // Serverless-friendly pool: reuse connections for the life of the
      // instance without holding more open than necessary.
      maxPoolSize: MAX_POOL_SIZE,
      maxIdleTimeMS: MAX_IDLE_TIME_MS,
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
      connectTimeoutMS: CONNECT_TIMEOUT_MS,
    });
  }

  return global.__qurbaniHatMongoClient__;
}

export function getMongoDb(): Db {
  return getMongoClient().db(getDatabaseName());
}

export interface DatabaseStatus {
  configured: boolean;
  target: string;
  database: string;
  reachable: boolean;
  kind: DatabaseFailureKind;
  /** Credential-free explanation, safe for logs and for diagnostics endpoints. */
  detail: string;
}

let healthCache: { at: number; status: DatabaseStatus } | null = null;

/**
 * Pings MongoDB and returns a safe summary of the result.
 *
 * Results are cached briefly so the check can run on the auth hot path
 * (lib/auth-guard.ts) without adding a database round trip to every request.
 */
export async function getDatabaseStatus(force = false): Promise<DatabaseStatus> {
  const now = Date.now();
  if (!force && healthCache && now - healthCache.at < HEALTH_CACHE_MS) {
    return healthCache.status;
  }

  const base = {
    configured: isDatabaseConfigured(),
    target: maskMongoTarget(),
    database: getDatabaseName(),
  };

  if (!base.configured) {
    const status: DatabaseStatus = {
      ...base,
      reachable: false,
      kind: "not-configured",
      detail: "MONGODB_URI is not set for this deployment",
    };
    healthCache = { at: now, status };
    return status;
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  let status: DatabaseStatus;

  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error("MongoNetworkTimeoutError: health check timed out")),
        HEALTH_TIMEOUT_MS,
      );
    });

    const ping = getMongoClient()
      .db(base.database)
      .command({ ping: 1 });

    await Promise.race([ping, timeout]);
    status = { ...base, reachable: true, kind: "ok", detail: "ok" };
  } catch (error) {
    const { kind, detail } = describeMongoFailure(error);
    status = { ...base, reachable: false, kind, detail };
  } finally {
    if (timer) clearTimeout(timer);
  }

  healthCache = { at: Date.now(), status };
  return status;
}
