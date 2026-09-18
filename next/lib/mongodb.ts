import { MongoClient, type Db } from "mongodb";

/**
 * MongoDB connection helper.
 *
 * Better Auth persists users, sessions and OAuth accounts in MongoDB through
 * `mongodbAdapter` (see lib/auth.ts). The client is cached on `globalThis` so
 * Next.js dev-mode hot reloads and serverless invocations do not open a new
 * connection pool on every request.
 *
 * MONGODB_URI is a server-only secret: it is read exclusively from
 * `process.env` inside server modules and is never forwarded to the browser.
 */

const FALLBACK_URI = "mongodb://127.0.0.1:27017";
const DEFAULT_DB = "qurbanihat";
const SERVER_SELECTION_TIMEOUT_MS = 5000;

declare global {
  var __qurbaniHatMongoClient__: MongoClient | undefined;
  var __qurbaniHatMongoWarned__: boolean | undefined;
}

function readUri(): string | undefined {
  const uri = process.env.MONGODB_URI?.trim();
  return uri && uri.length > 0 ? uri : undefined;
}

/**
 * True when a MongoDB connection string is present. Used purely to render a
 * friendly "database not configured" notice — never to send the URI to a client.
 */
export function isDatabaseConfigured(): boolean {
  return readUri() !== undefined;
}

export function getMongoClient(): MongoClient {
  if (!global.__qurbaniHatMongoClient__) {
    const uri = readUri();

    if (!uri && !global.__qurbaniHatMongoWarned__) {
      global.__qurbaniHatMongoWarned__ = true;
      console.warn(
        "[QurbaniHat] MONGODB_URI is not set. Authentication and session lookups " +
          "will fail until you add a MongoDB connection string to .env.local " +
          "(see .env.example). The marketplace pages keep working without it.",
      );
    }

    global.__qurbaniHatMongoClient__ = new MongoClient(uri ?? FALLBACK_URI, {
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
    });
  }

  return global.__qurbaniHatMongoClient__;
}

export function getMongoDb(): Db {
  const dbName = process.env.MONGODB_DB?.trim() || DEFAULT_DB;
  return getMongoClient().db(dbName);
}