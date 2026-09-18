import { NextResponse } from "next/server";

import { getAllAnimals } from "@/lib/animals";

/**
 * Public livestock catalogue endpoint.
 *
 * The dataset is static JSON for Assignment 8, so this handler simply serialises
 * it. A short, deliberate delay keeps the client-side loading skeletons visible
 * (and proves they work) instead of resolving instantly from the same process.
 * Nothing here touches MongoDB, and no booking data is ever persisted.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIMULATED_LATENCY_MS = 450;

export async function GET() {
  try {
    const animals = getAllAnimals();

    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    return NextResponse.json(
      { animals, total: animals.length },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // Never leak internals — log server-side, return a friendly message.
    console.error("[QurbaniHat] Failed to load the animal catalogue.", error);
    return NextResponse.json(
      { message: "The livestock catalogue is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }
}