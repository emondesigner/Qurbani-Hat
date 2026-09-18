/**
 * Single source of truth for every browser-facing URL in QurbaniHat.
 *
 * Why this file exists
 * --------------------
 * The Next.js server must be free to bind to `0.0.0.0` (all interfaces) so
 * containers, LAN devices and preview tunnels can reach it. A browser, however,
 * can never navigate to `0.0.0.0` — Chrome reports `ERR_ADDRESS_INVALID (-108)`.
 *
 * Every URL that ends up in the browser (metadata, OAuth redirects, the Better
 * Auth client base URL, trusted origins) is therefore passed through
 * `normalizeBrowsableUrl()`, which rewrites socket-only hosts such as
 * `0.0.0.0`, `::` and `127.0.0.1` to `localhost` while preserving the port.
 *
 * Production is unaffected: on Vercel the real values come from
 * BETTER_AUTH_URL / NEXT_PUBLIC_APP_URL / VERCEL_PROJECT_PRODUCTION_URL, none of
 * which contain a wildcard host.
 */

/** Local development fallback (the port used by `npm run dev`). */
export const DEFAULT_DEV_URL = "http://localhost:3000";

/** Hosts that are valid for socket binding/loopback but never for navigation. */
const NON_BROWSABLE_HOSTNAMES = new Set(["0.0.0.0", "::", "[::]", "127.0.0.1"]);

let hasWarned = false;

function warnOnce(message: string) {
  if (hasWarned) return;
  hasWarned = true;
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[QurbaniHat] ${message}`);
  }
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/**
 * Returns a URL that is safe to open in a browser, or `undefined` when the
 * input is missing/invalid. `http://0.0.0.0:3000` becomes
 * `http://localhost:3000`.
 */
export function normalizeBrowsableUrl(raw?: string | null): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    warnOnce(`Ignoring invalid URL "${value}" — expected something like http://localhost:3000.`);
    return undefined;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    warnOnce(`Ignoring unsupported URL protocol in "${value}" — use http or https.`);
    return undefined;
  }

  if (NON_BROWSABLE_HOSTNAMES.has(parsed.hostname)) {
    const original = parsed.hostname;
    parsed.hostname = "localhost";
    warnOnce(
      `Rewrote "${value}" to "${parsed.toString()}" — "${original}" is a bind-only address ` +
        `and browsers cannot open it. Use http://localhost:${parsed.port || "3000"} in the browser.`,
    );
  }

  return stripTrailingSlash(parsed.toString());
}

/** Vercel injects the deployment hostname without a protocol. */
function vercelOrigin(): string | undefined {
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  const preview = process.env.VERCEL_URL?.trim();
  if (preview) return `https://${preview.replace(/^https?:\/\//, "")}`;
  return undefined;
}

/**
 * Base URL for server-side auth decisions (OAuth callback URLs).
 * Returns `undefined` when nothing is configured, in which case Better Auth
 * falls back to the origin of the incoming request — the safest behaviour for
 * preview deployments.
 */
export function resolveServerBaseUrl(): string | undefined {
  const candidates: (string | undefined)[] = [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    vercelOrigin(),
  ];

  for (const candidate of candidates) {
    const normalized = normalizeBrowsableUrl(candidate);
    if (normalized) return normalized;
  }

  return undefined;
}

/** Base URL used for metadata, canonical links and Open Graph tags. */
export function resolvePublicBaseUrl(): string {
  return resolveServerBaseUrl() ?? DEFAULT_DEV_URL;
}

/**
 * Base URL for the browser-side Better Auth client.
 * Returning `undefined` lets the client infer `window.location.origin`, so a
 * deployment can never be pointed at the wrong host by a stale env value.
 */
export function resolveBrowserBaseUrl(): string | undefined {
  return normalizeBrowsableUrl(process.env.NEXT_PUBLIC_APP_URL);
}

/**
 * Origins allowed to call `/api/auth/*` (CSRF protection).
 * Always includes the resolved public origin plus the canonical local pairs, so
 * `localhost` and `127.0.0.1` both work during development.
 *
 * Vercel preview deployments live on a random subdomain (`<hash>.vercel.app`),
 * so the per-deployment VERCEL_URL and the project production domain are
 * always trusted as well — otherwise OAuth callbacks would fail the origin
 * check on every preview URL.
 */
export function buildTrustedOrigins(): string[] {
  const resolved = resolveServerBaseUrl();
  const origins = new Set<string>();

  if (resolved) {
    origins.add(resolved);
    try {
      const parsed = new URL(resolved);
      if (parsed.hostname === "localhost") {
        origins.add(`${parsed.protocol}//127.0.0.1${parsed.port ? `:${parsed.port}` : ""}`);
      }
    } catch {
      /* resolved is already validated, ignore */
    }
  }

  origins.add("http://localhost:3000");
  origins.add("http://127.0.0.1:3000");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    origins.add(`https://${production.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`);
  }
  const preview = process.env.VERCEL_URL?.trim();
  if (preview) {
    origins.add(`https://${preview.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`);
  }

  return Array.from(origins);
}