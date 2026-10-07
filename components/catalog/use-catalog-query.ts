"use client";

import { useConvexConnectionState, useQuery } from "convex/react";
import type { OptionalRestArgsOrSkip } from "convex/react";
import type { FunctionReference, FunctionReturnType } from "convex/server";

/**
 * A reactive query result that keeps "still loading", "cannot reach the
 * backend", and "resolved" apart, so a transport failure is never rendered as
 * an empty catalog. Coded server errors are thrown to the nearest
 * QueryBoundary by `useQuery` itself.
 */
export type CatalogResource<T> =
  | { status: "loading" }
  | { status: "offline" }
  | { status: "ready"; data: T };

const OFFLINE_AFTER_RETRIES = 2;

export function useCatalogQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: Query["_args"] | "skip",
): CatalogResource<FunctionReturnType<Query>> {
  const data = useQuery(query, ...([args] as OptionalRestArgsOrSkip<Query>));
  const connection = useConvexConnectionState();

  if (data !== undefined) return { status: "ready", data };
  if (
    args !== "skip" &&
    !connection.isWebSocketConnected &&
    connection.connectionRetries >= OFFLINE_AFTER_RETRIES
  ) {
    return { status: "offline" };
  }
  return { status: "loading" };
}
