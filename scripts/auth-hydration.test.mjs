import React, { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";

const session = vi.hoisted(() => ({ data: null, isPending: true }));
vi.mock("@/lib/auth-client", () => ({
  authIsConfigured: true,
  authClient: { useSession: () => session, signOut: vi.fn() },
}));
import { AuthProvider, useAuth } from "../components/auth-context";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const reader = { id: "hydration-test", name: "Reader", email: "reader@example.invalid" };
let root;
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  root = undefined;
  document.body.replaceChildren();
  session.data = null;
  session.isPending = true;
});

function AuthActions() {
  const { authed, ready, user } = useAuth();
  return React.createElement("header", { "data-ready": String(ready), "data-user": user?.id ?? "" },
    authed
      ? React.createElement("button", { type: "button" }, "Sign Out")
      : React.createElement("a", { href: "/signin" }, "Sign In"));
}
const tree = () => React.createElement(AuthProvider, null, React.createElement(AuthActions));

test("cached client session hydrates signed-out server HTML without recovery", async () => {
  const container = document.createElement("div");
  container.innerHTML = renderToString(tree());
  expect(container.querySelector("a")?.textContent).toBe("Sign In");
  document.body.append(container);
  session.data = { user: reader };
  session.isPending = false;
  const recoveries = [];
  await act(async () => {
    root = hydrateRoot(container, tree(), { onRecoverableError: error => recoveries.push(error.message) });
  });
  expect(recoveries).toEqual([]);
  expect(container.querySelector("button")?.textContent).toBe("Sign Out");
  expect(container.querySelector("header")?.dataset.ready).toBe("true");
  expect(container.querySelector("header")?.dataset.user).toBe(reader.id);
  session.data = null;
  await act(async () => root.render(tree()));
  expect(container.querySelector("a")?.textContent).toBe("Sign In");
});

test("server snapshot never exposes a session cached in the auth hook", () => {
  session.data = { user: reader };
  session.isPending = false;
  const html = renderToString(tree());
  expect(html).toContain('data-ready="false"');
  expect(html).toContain('data-user=""');
  expect(html).toContain('href="/signin"');
});

test("pending anonymous session remains unready after hydration", async () => {
  const container = document.createElement("div");
  container.innerHTML = renderToString(tree());
  document.body.append(container);
  const recoveries = [];
  await act(async () => {
    root = hydrateRoot(container, tree(), { onRecoverableError: error => recoveries.push(error.message) });
  });
  expect(recoveries).toEqual([]);
  expect(container.querySelector("header")?.dataset.ready).toBe("false");
  session.isPending = false;
  await act(async () => root.render(tree()));
  expect(container.querySelector("header")?.dataset.ready).toBe("true");
  expect(container.querySelector("a")?.textContent).toBe("Sign In");
});
