"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "relume-icons";
import { CatalogCounts, PublishedContent, PublishedShelf } from "@/components/published-content";
import { Header1 } from "@/components/relume/header1";
import { Blog60 } from "@/components/relume/blog60";
import { Layout399 } from "@/components/relume/layout399";
import { Product1 } from "@/components/relume/product1";
import { Layout659 } from "@/components/relume/layout659";
import { Cta8 } from "@/components/relume/cta8";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { alertText } from "@/lib/typography";
export default function HomePage() {
    const [homeEmail, setHomeEmail] = useState("");
    const [homeSubscribed, setHomeSubscribed] = useState(false);
    const [homeSubscribeError, setHomeSubscribeError] = useState("");
    const [homeSubscribePending, setHomeSubscribePending] = useState(false);
    const subscribe = async (event: React.FormEvent) => {
        event.preventDefault();
        setHomeSubscribePending(true);
        setHomeSubscribeError("");
        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: homeEmail, source: "homepage" }),
            });
            if (!response.ok) {
                const result = (await response.json()) as {
                    error?: string;
                };
                setHomeSubscribeError(result.error ?? "We couldn’t add you to the list.");
                return;
            }
            setHomeSubscribed(true);
        }
        catch {
            setHomeSubscribeError("We couldn’t reach the newsletter service.");
        }
        finally {
            setHomeSubscribePending(false);
        }
    };
    return (<main>
      <Header1
        tagline="Novels · Serials · Essays"
        heading="Nia Forrester"
        headingClassName="font-ui text-[clamp(2.5rem,1.6rem+4.2vw,5rem)] leading-[1.02] font-semibold tracking-[0.16em] uppercase"
        description={<>
            <p className="mb-4 max-w-[46ch]">
              The serials, the backlist, the essays, the community, the events — and
              the writing studio. No more link-in-bio maze. Just Nia, and the people
              who read her.
            </p>
            <CatalogCounts/>
          </>}
        actions={<>
            <Link href="/serial" className={buttonVariants()}>
              Read the Serial
            </Link>
            <Link href="/read#backlist" className={buttonVariants({ variant: "secondary" })}>
              Explore the Backlist
            </Link>
          </>}
        media={<div className="relative aspect-[4/5] w-full overflow-hidden rounded-image ring-1 ring-hairline">
            <Image src="/images/nia-full-body-pensive.jpeg" alt="Nia Forrester seated on a porch swing" fill loading="eager" fetchPriority="high" sizes="(max-width: 1024px) 90vw, 560px" className="object-cover object-[65%_45%]"/>
          </div>}
      />

      <Blog60
        tagline="#TheSerial"
        heading="Serials"
        headingId="home-serials-heading"
        description="New fiction, chapter by chapter. The first chapters are free to read online."
        action={<Link href="/serial" className={buttonVariants({ variant: "secondary" })}>
            All Serials
          </Link>}
        className="border-t border-hairline"
      >
        <PublishedContent kind="serial"/>
      </Blog60>

      <Layout399
        tagline="Four Ways In"
        heading="Find Your Way Into the Work"
        description="Read the books, gather with other readers, catch Nia live, or work with her on your own pages."
        cards={[
            {
                tagline: "Read",
                heading: "Books, Serials & Essays",
                description: "The whole backlist, the serials, and the essays — published writing in one library.",
                url: "/read",
                linkLabel: "Browse the library",
                image: { src: "/images/the-best-bad-idea.png", alt: "Cover of The Best Bad Idea", position: "object-top" },
            },
            {
                tagline: "Connect",
                heading: "The Reader Circle",
                description: "Discussions, book clubs, character debates — a private home for Black women’s fiction.",
                url: "/community",
                linkLabel: "Step inside",
                image: { src: "/images/reader-circle.png", alt: "An imagined book-club gathering of four women sharing a novel" },
            },
            {
                tagline: "Gather",
                heading: "Events & Readings",
                description: "Festival appearances, live readings, workshops and retreats.",
                url: "/events",
                linkLabel: "See what’s coming",
                image: { src: "/images/nia-pink-smile.jpeg", alt: "Nia Forrester smiling in front of a pink mural", position: "object-[50%_25%]" },
            },
            {
                tagline: "Learn",
                heading: "The Writing Studio",
                description: "Critique, editing, coaching — and courses on the way.",
                url: "/academy",
                linkLabel: "Work with Nia",
                image: { src: "/images/nia-outside.jpeg", alt: "Nia Forrester seated outdoors", position: "object-[50%_20%]" },
            },
        ]}
      />

      <Product1
        tagline="From the Catalog"
        heading="Where to Start"
        headingId="home-shelf-heading"
        description="A few doors into the backlist."
        viewAll={<Link href="/read" className={buttonVariants({ variant: "secondary" })}>
            Browse the Library
          </Link>}
        className="border-t border-hairline"
      >
        <PublishedShelf/>
      </Product1>

      <Layout659
        tagline="Meet the Author"
        heading="Nia Forrester"
        media={<Image src="/images/nia-closeup-pensive.jpeg" alt="Close-up portrait of Nia Forrester" fill sizes="(max-width: 768px) 90vw, 560px" className="object-cover object-center"/>}
        description={<>
            <p>
              By day, a public-policy attorney in Philadelphia. By night, she writes
              woman-centered fiction about love, race, and the interior lives of
              Black women, with published work available in the library.
            </p>
            <blockquote className="mt-6 border-l border-champagne pl-5 font-display text-h5 leading-snug font-medium text-cream">
              &ldquo;I write the women I know — difficult, tender, and fully grown.&rdquo;
            </blockquote>
          </>}
        actions={<>
            <Link href="/read" className={buttonVariants()}>
              Read Her Work
            </Link>
            <Link href="/community" className={buttonVariants({ variant: "secondary" })}>
              Join the Conversation
            </Link>
          </>}
      />

      <Cta8
        id="newsletter"
        tagline="The Newsletter"
        heading="She Who Writes Herself, in Your Inbox"
        description={<p>
            New chapters, essays on craft and culture, and book news — updates from
            Nia. No noise, no spam, unsubscribe any time.
          </p>}
      >
        {!homeSubscribed ? (<>
            <form onSubmit={subscribe} className="mb-4 grid grid-cols-1 gap-y-3 sm:grid-cols-[1fr_max-content] sm:items-end sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="home-newsletter-email">Email Address</Label>
                <Input id="home-newsletter-email" type="email" name="email" autoComplete="email" required placeholder="you@example.com" value={homeEmail} onChange={(e) => setHomeEmail(e.target.value)}/>
              </div>
              <Button type="submit" variant="alternate" disabled={homeSubscribePending}>
                {homeSubscribePending ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
            {homeSubscribeError && (<p role="alert" className={alertText}>
                {homeSubscribeError}
              </p>)}
            <p className="mt-3 font-ui text-tiny tracking-[0.12em] text-taupe uppercase">
              Free, always · unsubscribe any time
            </p>
          </>) : (<div role="status" className="flex items-center gap-4 rounded-card border border-scheme-border bg-wine-card p-5">
            <span className="flex size-10 flex-none items-center justify-center rounded-full bg-champagne text-wine-sunken">
              <Check aria-hidden="true" className="size-5"/>
            </span>
            <div>
              <p className="font-display text-h6 font-semibold text-cream">You&apos;re on the list.</p>
              <p className="text-small text-body">Your subscription has been saved.</p>
            </div>
          </div>)}
      </Cta8>
    </main>);
}
