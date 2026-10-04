"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutToHome } from "@/lib/sign-out";
import { useAuth } from "@/components/auth-context";
import { navItems } from "@/lib/data";
import { UserAvatar } from "@/components/avatar";
import { BrandMark } from "@/components/brand-mark";
import { Navbar1 } from "@/components/relume/navbar1";
import { Button, buttonVariants } from "@/components/ui/button";

export default function SiteHeader() {
  const pathname = usePathname();
  const { authed, signOut, user } = useAuth();
  const visibleNavItems = navItems.filter((item) => {
    if (
      item.key === "community" &&
      process.env.NEXT_PUBLIC_COMMUNITY_ENABLED === "false"
    ) {
      return false;
    }
    if (
      item.key === "membership" &&
      process.env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "false"
    ) {
      return false;
    }
    return true;
  });

  // One full navigation after sign-out; see lib/sign-out.ts for the push+refresh race.
  const handleSignOut = () => signOutToHome(signOut);

  return (
    <Navbar1
      logo={{ url: "/", label: "Nia Forrester home", content: <BrandMark /> }}
      navLinks={visibleNavItems.map((item) => ({
        key: item.key,
        url: item.href,
        title: item.label,
        active: item.match.some((match) => pathname.startsWith(match)),
      }))}
      actions={(closeMenu) =>
        !authed ? (
          <Link
            href="/signin"
            onClick={closeMenu}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            Sign In
          </Link>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                closeMenu();
                void handleSignOut();
              }}
            >
              Sign Out
            </Button>
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className={`${buttonVariants({ variant: "secondary", size: "sm" })} gap-2.5 pl-1.5`}
            >
              <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-cabernet font-ui text-[0.8125rem] font-bold text-cream">
                <UserAvatar name={user?.name || "Reader"} />
              </span>
              My Library
            </Link>
          </>
        )
      }
    />
  );
}
