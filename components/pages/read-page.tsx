"use client";
import { useState } from "react";
import { CatalogLibrary } from "@/components/catalog/catalog-library";
import { PublishedContent } from "@/components/published-content";
import { focusRing } from "@/lib/catalog-styles";

const chips = [
    { key: "all", label: "All" },
    { key: "serials", label: "Serials" },
    { key: "books", label: "Books" },
    { key: "audio", label: "Audio" },
    { key: "essays", label: "Essays" },
] as const;

type ReadFilter = (typeof chips)[number]["key"];

const eyebrow = "font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-hot-magenta)]";
const sectionHeading = "mb-0 mt-2 text-balance font-sans text-[clamp(1.75rem,4.5vw,2.125rem)] font-bold tracking-[-0.025em] text-[var(--color-deep-plum)]";
const sectionNote = "font-sans text-[13px] text-[var(--color-plum-muted)]";

export default function ReadPage() {
    const [readFilter, setReadFilter] = useState<ReadFilter>("all");
    const shows = (key: ReadFilter) => readFilter === "all" || readFilter === key;

    return (<main className="mx-auto max-w-[1240px] px-5 py-9 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      <div className={eyebrow}>The Library</div>
      <h1 className="mb-3 mt-3.5 text-balance font-sans text-[clamp(2.25rem,8vw,3.5rem)] font-bold tracking-[-0.03em] text-[var(--color-deep-plum)]">
        Read
      </h1>
      <p className="mb-7 mt-0 max-w-[600px] text-pretty text-lg text-[var(--color-plum-copy)]">
        The serials, the essays, and the whole backlist. Everything that used
        to live only on Substack now starts here.
      </p>
      <div role="group" aria-label="Filter the library" className="mb-10 flex flex-wrap gap-2.5">
        {chips.map((chip) => {
            const active = readFilter === chip.key;
            return (<button type="button" key={chip.key} aria-pressed={active} onClick={() => setReadFilter(chip.key)} className={`min-h-[46px] rounded-full px-4 py-[9px] font-sans text-[13px] font-semibold transition-colors duration-200 ${focusRing} ${active ? "bg-[var(--color-deep-plum)] text-[var(--color-brand-surface)]" : "bg-[var(--color-brand-surface)] text-[var(--color-deep-plum)] hover:bg-white"}`}>
              {chip.label}
            </button>);
        })}
      </div>

      {shows("serials") && <section className="mb-14"><h2 className={sectionHeading}>Serials</h2><PublishedContent kind="serial"/></section>}
      {shows("books") && (<section aria-labelledby="backlist-heading" className="mb-14">
          <div id="backlist" className="mb-6 flex scroll-mt-24 flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <div className={eyebrow}>Novels &amp; series</div>
              <h2 id="backlist-heading" className={sectionHeading}>
                The Backlist
              </h2>
            </div>
            <span className={sectionNote}>
              By series · read order kept intact
            </span>
          </div>
          <CatalogLibrary view="books"/>
        </section>)}

      {shows("audio") && (<section aria-labelledby="audio-heading" className="mb-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <div className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-deep-plum)]">
                Listen
              </div>
              <h2 id="audio-heading" className={sectionHeading}>
                Audiobooks
              </h2>
            </div>
            <span className={sectionNote}>
              Titles with an audiobook edition
            </span>
          </div>
          <CatalogLibrary view="audio"/>
        </section>)}

      {shows("essays") && (<section aria-labelledby="essays-heading" className="mb-14">
          <div className="mb-6">
            <div className={eyebrow}>She Who Writes Herself</div>
            <h2 id="essays-heading" className={sectionHeading}>
              Essays &amp; Commentary
            </h2>
          </div>
          <PublishedContent kind="essay"/>
        </section>)}
    </main>);
}
