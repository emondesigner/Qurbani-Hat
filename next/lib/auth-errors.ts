/**
 * Maps Better Auth / network failures onto short, user-safe messages.
 *
 * The raw backend error is logged to the console for developers but never
 * rendered in the UI — no stack traces, no internal detail, no status codes.
 */

const CODE_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: "An account with this email already exists. Try logging in instead.",
  USER_NOT_FOUND: "No account matches those details. Please check and try again.",
  INVALID_EMAIL_OR_PASSWORD: "Incorrect email or password. Please try again.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PASSWORD: "Incorrect password. Please try again.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters long.",
  PASSWORD_TOO_LONG: "That password is too long. Please choose a shorter one.",
  EMAIL_NOT_VERIFIED: "Please verify your email address before signing in.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  PROVIDER_NOT_FOUND: "This sign-in provider is not configured for QurbaniHat.",
  FAILED_TO_CREATE_USER: "We could not create your account. Please try again.",
  FAILED_TO_CREATE_SESSION: "We could not start your session. Please try again.",
  ACCOUNT_NOT_LINKED:
    "This email is already registered with a password. Please log in with your email and password instead.",
};

const MESSAGE_HINTS: { match: RegExp; message: string }[] = [
  { match: /invalid email or password/i, message: CODE_MESSAGES.INVALID_EMAIL_OR_PASSWORD },
  { match: /user already exists|already registered/i, message: CODE_MESSAGES.USER_ALREADY_EXISTS },
  { match: /password.*(short|least 6)/i, message: CODE_MESSAGES.PASSWORD_TOO_SHORT },
  { match: /invalid email/i, message: CODE_MESSAGES.INVALID_EMAIL },
  { match: /failed to fetch|network|load failed/i, message: "Network problem. Check your connection and try again." },
  { match: /timeout|timed out/i, message: "The request took too long. Please try again." },
];

interface ErrorLike {
  message?: unknown;
  code?: unknown;
  status?: unknown;
}

function readError(error: unknown): ErrorLike {
  if (!error) return {};
  if (typeof error === "string") return { message: error };
  if (typeof error === "object") return error as ErrorLike;
  return {};
}

export function friendlyAuthError(error: unknown, fallback: string): string {
  const { message, code } = readError(error);

  // Developer-facing detail stays in the console only.
  if (process.env.NODE_ENV !== "production") {
    console.error("[QurbaniHat] Auth error:", error);
  } else {
    console.error("[QurbaniHat] Auth error:", code ?? message ?? "unknown");
  }

  if (typeof code === "string" && CODE_MESSAGES[code]) {
    return CODE_MESSAGES[code];
  }

  if (typeof message === "string") {
    const hint = MESSAGE_HINTS.find((entry) => entry.match.test(message));
    if (hint) return hint.message;

    // Better Auth messages are already end-user friendly and contain no
    // internal details (no hashes, no connection strings, no stack frames).
    if (message.length > 0 && message.length <= 120 && !message.includes("\n")) {
      return message;
    }
  }

  return fallback;
}

/** True when the deployment has Google OAuth credentials configured. */
// (Single source of truth for this flag lives in lib/auth-flags.ts.)

export const GOOGLE_NOT_CONFIGURED_MESSAGE =
  "Google sign-in is not configured on this deployment yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the environment variables and try again.";