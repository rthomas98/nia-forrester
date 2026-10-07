"use client";
import { useState } from "react";
import { EditorialDiscovery } from "@/components/editorial/editorial-discovery";
import { CatalogLibrary } from "@/components/catalog/catalog-library";
import { PublishedContent } from "@/components/published-content";
import { Header46 } from "@/components/relume/header46";
import { Event1Filters } from "@/components/relume/event1";
import { Blog60 } from "@/components/relume/blog60";
import { Product1 } from "@/components/relume/product1";

const chips = [
    { key: "all", label: "All" },
    { key: "serials", label: "Serials" },
    { key: "books", label: "Books" },
    { key: "audio", label: "Audio" },
    { key: "essays", label: "Essays" },
] as const;

type ReadFilter = (typeof chips)[number]["key"];

const sectionNote = "font-ui text-tiny font-semibold tracking-[0.14em] text-taupe uppercase";
const block = "border-t border-hairline px-[5%] py-14 md:py-20";

export default function ReadPage() {
    const [readFilter, setReadFilter] = useState<ReadFilter>("all");
    const shows = (key: ReadFilter) => readFilter === "all" || readFilter === key;

    return (<main>
      <Header46
        tagline="The Library"
        heading="Read"
        description="The serials, the essays, and the whole backlist. Everything that used to live only on Substack now starts here."
      >
        <Event1Filters<ReadFilter>
          label="Filter the library"
          options={chips.map((chip) => ({ value: chip.key, label: chip.label }))}
          value={readFilter}
          onChange={setReadFilter}
        />
      </Header46>

      {shows("serials") && (<div className={block}>
          <Blog60 bare tagline="#TheSerial" heading="Serials" headingId="serials-heading">
            <PublishedContent kind="serial"/>
          </Blog60>
        </div>)}

      {shows("books") && (<div id="backlist" className={`${block} scroll-mt-24`}>
          <Product1
            bare
            tagline="Novels & Series"
            heading="The Backlist"
            headingId="backlist-heading"
          >
            <CatalogLibrary view="books"/>
          </Product1>
        </div>)}

      {shows("audio") && (<div className={block}>
          <Product1
            bare
            tagline="Listen"
            heading="Audiobooks"
            headingId="audio-heading"
            viewAll={<span className={sectionNote}>Titles with an audiobook edition</span>}
          >
            <CatalogLibrary view="audio"/>
          </Product1>
        </div>)}

      {shows("essays") && (<div className={block}>
          <Blog60 bare tagline="She Who Writes Herself" heading="Essays & Commentary" headingId="essays-heading">
            <PublishedContent kind="essay"/>
          </Blog60>
        </div>)}
      <EditorialDiscovery heading="Blog, Quick Bites, Short Reads & Outtakes" />
    </main>);
}
