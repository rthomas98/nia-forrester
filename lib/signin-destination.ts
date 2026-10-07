// Only route back into this app. Never forward an untrusted URL to router.push.
export function signInDestination(search: string): string {
  const value = new URLSearchParams(search).get("next");
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/dashboard";
  try {
    const base = "https://nia.invalid";
    const target = new URL(value, base);
    return target.origin === base ? `${target.pathname}${target.search}${target.hash}` : "/dashboard";
  } catch { return "/dashboard"; }
}
