"use client";

import { Component, type ReactNode } from "react";

interface QueryBoundaryProps {
  children: ReactNode;
  /** Renders the failure; `retry` remounts the children to re-subscribe. */
  fallback: (error: unknown, retry: () => void) => ReactNode;
}

interface QueryBoundaryState {
  error: unknown;
  failed: boolean;
}

/**
 * Contains errors thrown by reactive Convex queries to the section that
 * issued them, so one failed query cannot blank the rest of the page.
 */
export class QueryBoundary extends Component<
  QueryBoundaryProps,
  QueryBoundaryState
> {
  state: QueryBoundaryState = { error: null, failed: false };

  static getDerivedStateFromError(error: unknown): QueryBoundaryState {
    return { error, failed: true };
  }

  retry = () => {
    this.setState({ error: null, failed: false });
  };

  render() {
    if (this.state.failed) {
      return this.props.fallback(this.state.error, this.retry);
    }
    return this.props.children;
  }
}
