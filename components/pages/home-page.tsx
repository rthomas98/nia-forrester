"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { popular, reactions } from "@/lib/data";
import { ImageSlot } from "@/components/ui";
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
    return (<main className="relative overflow-hidden">
      <section className="relative mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] items-stretch gap-4 px-10 pb-8 pt-7 max-[900px]:grid-cols-1 max-[640px]:gap-3.5 max-[640px]:px-5 max-[640px]:pt-5">
        <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-2 size-72 rounded-full bg-[var(--color-cool-teal)]/20 blur-3xl" />
        <div className="grid min-w-0 grid-rows-[1fr_auto] gap-4 max-[640px]:gap-3.5">
          <div className="relative isolate flex min-w-0 flex-col justify-between gap-10 overflow-hidden rounded-[34px] border border-white/20 bg-[linear-gradient(145deg,var(--color-hot-magenta)_0%,var(--color-deep-plum)_145%)] px-11 pb-[38px] pt-11 shadow-[0_36px_70px_-38px_rgba(53,5,73,0.68)] max-[640px]:px-6 max-[640px]:py-[30px]">
            <div aria-hidden="true" className="absolute -right-14 -top-16 size-52 rounded-full border border-white/20" />
            <div aria-hidden="true" className="absolute -bottom-24 -left-16 size-64 rounded-full bg-[var(--color-cool-teal)]/25 blur-3xl" />
            <h1 className="relative z-10 m-0 max-w-full font-sans text-[clamp(48px,4.5vw,72px)] font-semibold uppercase leading-[0.98] tracking-[0.1em] text-[var(--color-brand-surface)] text-balance max-[640px]:whitespace-nowrap max-[640px]:text-[clamp(34px,10.8vw,48px)] max-[640px]:tracking-[0.055em] max-[380px]:text-[clamp(29px,10vw,36px)] max-[380px]:tracking-[0.04em]">
              NIA
              <br />
              FORRESTER
            </h1>
            <div className="relative z-10">
              <p className="[font-size:15px] [line-height:1.6] [color:rgba(255,255,255,0.86)] [max-width:44ch] [margin:0_0_16px] text-pretty">
                The serials, the backlist, the essays, the community, the events — and the writing
                studio. No more link-in-bio maze. Just Nia, and the people who read her.
              </p>
              <div className="flex flex-wrap items-center gap-3 font-sans text-[13px] font-semibold text-[rgba(255,255,255,0.78)]">
                <span>46 books</span>
                <span className="[width:3px] [height:3px] [border-radius:999px] [background:rgba(255,255,255,0.5)]"></span>
                <span>11 series</span>
                <span className="[width:3px] [height:3px] [border-radius:999px] [background:rgba(255,255,255,0.5)]"></span>
                <span>New chapters weekly</span>
              </div>
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-4 max-[640px]:grid-cols-1 max-[640px]:gap-3.5">
            <Link href="/serial" className="group relative flex h-[216px] min-w-0 cursor-pointer flex-col justify-between overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(160deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_100%)] px-6 py-[22px] shadow-[0_24px_48px_-28px_rgba(53,5,73,0.8)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_54px_-26px_rgba(53,5,73,0.9)] motion-reduce:transform-none motion-reduce:transition-none max-[640px]:h-[190px] max-[640px]:p-5">
              <div aria-hidden="true" className="absolute -right-10 -top-10 size-32 rounded-full border border-white/15 transition duration-500 group-hover:scale-110 motion-reduce:transition-none" />
              <div className="relative z-10 max-w-[8ch] font-serif text-[30px] font-medium leading-[1.05] text-[var(--color-soft-lavender)]">
                Forty-Nothing
              </div>
              <div className="relative z-10 flex min-w-0 flex-nowrap items-center justify-between gap-2">
                <span className="min-w-0 font-sans text-[clamp(15px,1.25vw,18px)] font-bold uppercase tracking-[0.02em] text-[var(--color-soft-lavender)]">
                  #TheSerial
                </span>
                <span className="flex-none whitespace-nowrap font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-[rgba(255,255,255,0.76)]">
                  Ch. 11 live
                </span>
              </div>
            </Link>
            <Link href="/read" className="group relative flex h-[216px] min-w-0 cursor-pointer flex-col justify-between overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(155deg,var(--color-deep-plum)_0%,var(--color-cool-teal)_180%)] px-6 py-[22px] shadow-[0_24px_48px_-28px_rgba(53,5,73,0.8)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_54px_-26px_rgba(53,5,73,0.9)] motion-reduce:transform-none motion-reduce:transition-none max-[640px]:h-[190px] max-[640px]:p-5">
              <div aria-hidden="true" className="absolute -bottom-12 -right-8 size-36 rounded-full bg-[var(--color-cool-teal)]/20 blur-2xl transition duration-500 group-hover:scale-125 motion-reduce:transition-none" />
              <div className="relative z-10 font-serif [font-weight:500] [font-size:30px] [line-height:1.05] [color:var(--color-soft-lavender)] [max-width:9ch]">
                46 books deep
              </div>
              <div className="relative z-10 flex min-w-0 flex-nowrap items-center justify-between gap-2">
                <span className="min-w-0 font-sans text-[clamp(15px,1.25vw,18px)] font-bold uppercase tracking-[0.02em] text-[var(--color-soft-lavender)]">
                  #TheBacklist
                </span>
                <span className="flex-none whitespace-nowrap font-sans text-[10px] font-semibold uppercase tracking-[0.06em] text-[rgba(255,255,255,0.76)]">
                  11 series
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="group relative min-h-[560px] overflow-hidden rounded-[34px] border border-white/40 shadow-[0_42px_80px_-42px_rgba(53,5,73,0.7)] max-[900px]:min-h-[clamp(400px,72vw,560px)] max-[640px]:min-h-[min(112vw,460px)]">
          <ImageSlot label="Portrait of Nia" className="absolute [inset:0px] w-full h-full"/>
          <Image src="/images/nia-hero.jpg" alt="Nia Forrester" fill loading="eager" sizes="(max-width: 800px) 100vw, 50vw" className="object-cover object-[50%_22%] transition duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"/>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-deep-plum)]/20 to-transparent" />
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:32px_40px]">
        <div className="relative isolate grid items-center gap-12 overflow-hidden rounded-[36px] border border-white/30 bg-[linear-gradient(125deg,var(--color-cool-teal)_0%,var(--color-soft-lavender)_165%)] px-[52px] py-11 shadow-[0_34px_70px_-38px_rgba(53,5,73,0.62)] [grid-template-columns:1.25fr_0.75fr] max-[900px]:grid-cols-1 max-[640px]:px-6 max-[640px]:py-9">
          <div aria-hidden="true" className="absolute -right-16 -top-24 size-80 rounded-full border border-[var(--color-deep-plum)]/15" />
          <div aria-hidden="true" className="absolute bottom-0 right-[22%] h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="relative z-10">
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-deep-plum)]">
              Now serializing · She Who Writes Herself
            </div>
            <h2 className="font-serif [font-weight:500] [font-size:48px] [line-height:1.02] [color:var(--color-deep-plum)] [margin:14px_0_14px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Forty-Nothing
            </h2>
            <p className="[font-size:16px] [line-height:1.6] [color:rgba(53,5,73,0.78)] [margin:0_0_24px] [max-width:460px] text-pretty">
              Six years of silence. One doorbell. And all that carefully constructed composure about
              to come undone. Chapter 11 is live — and the comments have become part of the book.
            </p>
            <div className="flex [gap:12px] items-center flex-wrap">
              <Link href="/serial" className="rounded-full bg-[var(--color-deep-plum)] px-[22px] py-[13px] font-sans text-sm font-semibold text-[var(--color-brand-surface)] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-hot-magenta)] motion-reduce:transform-none motion-reduce:transition-none">
                Start reading ↗
              </Link>
              <span className="font-sans [font-size:13px] [color:rgba(53,5,73,0.7)]">
                11 chapters · ~6 min each · updated weekly
              </span>
            </div>
          </div>
          <div className="relative z-10 flex justify-center">
            <Link href="/serial" className="transition duration-200 ease-out hover:-translate-y-1 hover:-rotate-1 cursor-pointer [width:236px] [height:344px] [border-radius:2px] [box-shadow:0_32px_44px_-22px_rgba(53,5,73,0.38),0_14px_22px_-10px_rgba(53,5,73,0.20)] [background:linear-gradient(160deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_100%)] [padding:24px_20px] flex flex-col justify-between [transform:rotate(-3deg)]">
              <div className="font-sans [font-size:11px] [letter-spacing:0.14em] uppercase [color:rgba(196,185,203,0.78)] [font-weight:700]">
                Nia Forrester
              </div>
              <div>
                <div className="font-serif [font-weight:500] [font-size:34px] [color:var(--color-soft-lavender)] [line-height:1.04]">
                  Forty-
                  <br />
                  Nothing
                </div>
                <div className="[margin-top:10px] font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:rgba(255,255,255,0.76)] [font-weight:700]">
                  Chapter 11
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:56px_40px_24px]">
        <div className="flex items-baseline [gap:20px] [margin:0_0_28px]">
          <h2 className="font-sans [font-weight:700] [font-size:28px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:0px] whitespace-nowrap text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            Four Ways In
          </h2>
          <span className="[flex:1] [height:1px] [background:rgba(53,5,73,0.08)] [transform:translateY(-7px)]"></span>
        </div>
        <div className="grid grid-cols-12 gap-5 max-[900px]:grid-cols-1">
          <Link href="/read" className="group relative col-span-5 flex min-h-[250px] flex-col overflow-hidden rounded-[30px] border border-white/60 bg-[rgba(252,251,252,0.72)] p-8 text-left shadow-[0_24px_55px_-36px_rgba(53,5,73,0.62)] backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_32px_60px_-32px_rgba(53,5,73,0.7)] motion-reduce:transform-none motion-reduce:transition-none max-[900px]:col-span-1">
            <span aria-hidden="true" className="absolute -right-1 -top-6 font-serif text-[112px] leading-none text-[var(--color-deep-plum)]/5">01</span>
            <div className="relative z-10 font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-hot-magenta)] [font-weight:700]">
              Read
            </div>
            <h3 className="relative z-10 font-sans [font-weight:700] [font-size:26px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:12px_0_8px]">
              Books, Serials &amp; Essays
            </h3>
            <p className="relative z-10 [font-size:14px] [line-height:1.55] [color:var(--color-plum-copy)] [margin:0px] [flex:1] text-pretty">
              46 books across 11 series, the live serial, and the column.
            </p>
            <span className="relative z-10 font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)] [margin-top:16px] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
              Browse the library ↗
            </span>
          </Link>
          <Link href="/community" className="group relative col-span-7 flex min-h-[250px] flex-col overflow-hidden rounded-[30px] border border-white/15 bg-[linear-gradient(145deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_190%)] p-8 text-left shadow-[0_28px_58px_-34px_rgba(53,5,73,0.82)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_34px_65px_-32px_rgba(53,5,73,0.9)] motion-reduce:transform-none motion-reduce:transition-none max-[900px]:col-span-1">
            <span aria-hidden="true" className="absolute -right-2 -top-7 font-serif text-[118px] leading-none text-white/5">02</span>
            <div aria-hidden="true" className="absolute -bottom-20 -left-12 size-52 rounded-full bg-[var(--color-cool-teal)]/15 blur-3xl" />
            <div className="relative z-10 font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-cool-teal)] [font-weight:700]">
              Connect
            </div>
            <h3 className="relative z-10 font-sans [font-weight:700] [font-size:26px] [letter-spacing:-0.02em] [color:var(--color-soft-lavender)] [margin:12px_0_8px]">
              The Reader Circle
            </h3>
            <p className="relative z-10 max-w-[52ch] [font-size:14px] [line-height:1.55] [color:rgba(196,185,203,0.78)] [margin:0px] [flex:1] text-pretty">
              Discussions, book clubs, character debates — a private home for Black women&apos;s
              fiction.
            </p>
            <span className="relative z-10 font-sans [font-weight:600] [font-size:13px] [color:var(--color-soft-lavender)] [margin-top:16px] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
              Step inside ↗
            </span>
          </Link>
          <Link href="/events" className="group relative col-span-7 flex min-h-[250px] flex-col overflow-hidden rounded-[30px] border border-white/30 bg-[linear-gradient(135deg,var(--color-cool-teal)_0%,var(--color-soft-lavender)_170%)] p-8 text-left shadow-[0_24px_55px_-34px_rgba(53,5,73,0.64)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_32px_60px_-32px_rgba(53,5,73,0.72)] motion-reduce:transform-none motion-reduce:transition-none max-[900px]:col-span-1">
            <span aria-hidden="true" className="absolute -right-2 -top-7 font-serif text-[118px] leading-none text-[var(--color-deep-plum)]/5">03</span>
            <div className="relative z-10 font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-hot-magenta)] [font-weight:700]">
              Gather
            </div>
            <h3 className="relative z-10 font-sans [font-weight:700] [font-size:26px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:12px_0_8px]">
              Events &amp; Readings
            </h3>
            <p className="relative z-10 max-w-[52ch] [font-size:14px] [line-height:1.55] [color:var(--color-plum-copy)] [margin:0px] [flex:1] text-pretty">
              Festival appearances, live readings, workshops and retreats.
            </p>
            <span className="relative z-10 font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)] [margin-top:16px] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
              See what&apos;s coming ↗
            </span>
          </Link>
          <Link href="/academy" className="group relative col-span-5 flex min-h-[250px] flex-col overflow-hidden rounded-[30px] border border-white/60 bg-[rgba(252,251,252,0.72)] p-8 text-left shadow-[0_24px_55px_-36px_rgba(53,5,73,0.62)] backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_32px_60px_-32px_rgba(53,5,73,0.7)] motion-reduce:transform-none motion-reduce:transition-none max-[900px]:col-span-1">
            <span aria-hidden="true" className="absolute -right-1 -top-6 font-serif text-[112px] leading-none text-[var(--color-deep-plum)]/5">04</span>
            <div className="relative z-10 font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-cool-teal)] [font-weight:700]">
              Learn
            </div>
            <h3 className="relative z-10 font-sans [font-weight:700] [font-size:26px] [letter-spacing:-0.02em] [color:var(--color-deep-plum)] [margin:12px_0_8px]">
              The Writing Studio
            </h3>
            <p className="relative z-10 [font-size:14px] [line-height:1.55] [color:var(--color-plum-copy)] [margin:0px] [flex:1] text-pretty">
              Critique, editing, coaching — and courses on the way.
            </p>
            <span className="relative z-10 font-sans [font-weight:600] [font-size:13px] [color:var(--color-deep-plum)] [margin-top:16px] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
              Work with Nia ↗
            </span>
          </Link>
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:48px_40px_8px]">
        <div className="flex items-end justify-between [gap:24px] flex-wrap [margin-bottom:26px]">
          <div>
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)]">
              Reader favorites
            </div>
            <h2 className="font-sans [font-weight:700] [font-size:40px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:10px_0_0] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Where to Start
            </h2>
          </div>
          <Link href="/read" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:14px] [color:var(--color-plum-copy)]">
            Browse the library
          </Link>
        </div>
        <div className="snap-x snap-proximity overscroll-x-contain touch-pan-x [&>*]:snap-start flex [gap:24px] overflow-x-auto [padding-bottom:14px]">
          {popular.map((b) => (<div key={b.title} className="w-[152px] flex-none">
              <Link href="/read" className={`flex h-56 w-[152px] cursor-pointer flex-col justify-between rounded-[2px] px-[13px] py-4 shadow-[0_32px_44px_-22px_rgba(53,5,73,0.38),0_14px_22px_-10px_rgba(53,5,73,0.20)] transition duration-200 ease-out hover:-translate-y-1 hover:-rotate-1 ${b.gradient}`}>
                <div className="font-sans [font-size:9px] [letter-spacing:0.14em] uppercase [color:rgba(196,185,203,0.8)] [font-weight:600]">
                  Nia Forrester
                </div>
                <div className="font-serif [font-weight:500] [font-size:19px] [line-height:1.05] [color:var(--color-soft-lavender)]">
                  {b.title}
                </div>
              </Link>
              <div className="[margin-top:12px] [font-size:13px] [font-weight:600] [color:var(--color-deep-plum)] [line-height:1.25]">
                {b.title}
              </div>
              <div className="[font-size:12px] [color:var(--color-plum-muted)] [margin-top:2px]">{b.meta}</div>
            </div>))}
        </div>
      </section>

      <div className="mt-12 border-y border-white/60 bg-[rgba(252,251,252,0.62)] backdrop-blur-xl">
        <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:64px_40px]">
          <div className="flex items-end justify-between [gap:24px] flex-wrap [margin-bottom:28px]">
            <h2 className="font-sans [font-weight:700] [font-size:40px] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0px] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              What&apos;s New This Week
            </h2>
            <Link href="/read" className="transition-colors duration-150 hover:text-[var(--color-hot-magenta)] font-sans [font-weight:600] [font-size:14px] [color:var(--color-plum-copy)]">
              All updates
            </Link>
          </div>
          <div className="grid [grid-template-columns:repeat(3,1fr)] [gap:20px] max-[900px]:grid-cols-1">
            <Link href="/serial" className="group relative block cursor-pointer overflow-hidden rounded-[26px] border border-white/70 bg-[rgba(252,251,252,0.78)] p-[26px] shadow-[0_22px_46px_-34px_rgba(53,5,73,0.62)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_52px_-30px_rgba(53,5,73,0.68)] motion-reduce:transform-none motion-reduce:transition-none">
              <span aria-hidden="true" className="absolute right-5 top-4 text-3xl text-[var(--color-hot-magenta)]/20 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">↗</span>
              <div className="font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-hot-magenta)] [font-weight:700]">
                New chapter
              </div>
              <h3 className="font-serif [font-weight:500] [font-size:24px] [color:var(--color-deep-plum)] [margin:12px_0_8px]">
                Forty-Nothing, Ch. 11 — &quot;Undone&quot;
              </h3>
              <p className="[font-size:14px] [line-height:1.55] [color:var(--color-plum-copy)] [margin:0px] text-pretty">
                Norah thought she was ready. She was not.
              </p>
            </Link>
            <Link href="/read" className="group relative block cursor-pointer overflow-hidden rounded-[26px] border border-white/70 bg-[rgba(252,251,252,0.78)] p-[26px] shadow-[0_22px_46px_-34px_rgba(53,5,73,0.62)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_52px_-30px_rgba(53,5,73,0.68)] motion-reduce:transform-none motion-reduce:transition-none">
              <span aria-hidden="true" className="absolute right-5 top-4 text-3xl text-[var(--color-hot-magenta)]/20 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">↗</span>
              <div className="font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-hot-magenta)] [font-weight:700]">
                Essay
              </div>
              <h3 className="font-sans [font-weight:700] [font-size:22px] [letter-spacing:-0.01em] [color:var(--color-deep-plum)] [margin:12px_0_8px]">
                Is the &quot;Magic Negro&quot; hiding in your favorite IR romance?
              </h3>
              <p className="[font-size:14px] [line-height:1.55] [color:var(--color-plum-copy)] [margin:0px] text-pretty">
                The trope nobody wants to name.
              </p>
            </Link>
            <Link href="/events" className="group relative block cursor-pointer overflow-hidden rounded-[26px] border border-white/15 bg-[linear-gradient(145deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_190%)] p-[26px] shadow-[0_24px_48px_-30px_rgba(53,5,73,0.84)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_54px_-28px_rgba(53,5,73,0.9)] motion-reduce:transform-none motion-reduce:transition-none">
              <span aria-hidden="true" className="absolute right-5 top-4 text-3xl text-white/20 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">↗</span>
              <div className="font-sans [font-size:11px] [letter-spacing:0.12em] uppercase [color:var(--color-cool-teal)] [font-weight:700]">
                Upcoming
              </div>
              <h3 className="font-sans [font-weight:700] [font-size:22px] [letter-spacing:-0.01em] [color:var(--color-soft-lavender)] [margin:12px_0_8px]">
                Forty-Nothing, read live
              </h3>
              <p className="[font-size:14px] [line-height:1.55] [color:rgba(196,185,203,0.78)] [margin:0px] text-pretty">
                March 2 · Online · Reader Circle
              </p>
            </Link>
          </div>
        </section>
      </div>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:56px_40px]">
        <div className="group grid items-stretch overflow-hidden rounded-[38px] border border-white/65 bg-[rgba(252,251,252,0.76)] shadow-[0_34px_70px_-38px_rgba(53,5,73,0.64)] backdrop-blur-xl [grid-template-columns:0.85fr_1.15fr] max-[900px]:grid-cols-1">
          <div className="overflow-hidden">
            <Image src="/images/nia-hero.jpg" alt="Nia Forrester seated on a porch swing" width={1500} height={2000} loading="eager" sizes="(max-width: 800px) 100vw, 42vw" className="h-full min-h-[440px] w-full bg-[var(--color-cool-teal)] object-cover object-[62%_20%] transition duration-700 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"/>
          </div>
          <div className="relative flex flex-col justify-center px-14 py-[52px] max-[640px]:px-7 max-[640px]:py-9">
            <div aria-hidden="true" className="absolute -right-10 -top-14 size-44 rounded-full border border-[var(--color-hot-magenta)]/10" />
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
              Meet the author
            </div>
            <h2 className="font-sans [font-weight:700] [font-size:clamp(36px,4vw,52px)] [letter-spacing:-0.03em] [color:var(--color-deep-plum)] [margin:0_0_18px] [line-height:1] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              Nia Forrester
            </h2>
            <p className="[font-size:17px] [line-height:1.65] [color:var(--color-plum-copy)] [margin:0_0_16px] [max-width:52ch] text-pretty">
              By day, a public-policy attorney in Philadelphia. By night, she writes woman-centered
              fiction about love, race, and the interior lives of Black women — forty-six books,
              eleven series, and a serial that updates every week.
            </p>
            <p className="font-serif [font-style:italic] [font-weight:500] [font-size:20px] [line-height:1.45] [color:var(--color-deep-plum)] [margin:0_0_28px] [max-width:44ch] text-pretty">
              &ldquo;I write the women I know — difficult, tender, and fully grown.&rdquo;
            </p>
            <div className="flex [gap:12px] items-center flex-wrap">
              <Link href="/read" className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:13px_24px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
                Read her work ↗
              </Link>
              <Link href="/community" className="transition duration-150 hover:border-[var(--color-plum-copy)] hover:bg-black/5 [background:transparent] [color:var(--color-deep-plum)] [border:1px_solid_rgba(53,5,73,0.16)] [padding:12px_22px] [border-radius:999px] font-sans [font-weight:600] [font-size:14px]">
                Join the conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:48px_40px_8px]">
        <div className="relative isolate grid items-center gap-0 overflow-hidden rounded-[36px] border border-white/15 bg-[linear-gradient(135deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_190%)] px-14 py-[52px] shadow-[0_32px_70px_-36px_rgba(53,5,73,0.82)] [grid-template-columns:1.4fr_1fr_1fr] max-[900px]:grid-cols-1 max-[640px]:px-7 max-[640px]:py-9">
          <div aria-hidden="true" className="absolute -bottom-28 -left-14 size-72 rounded-full bg-[var(--color-cool-teal)]/15 blur-3xl" />
          <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full border border-white/10" />
          <h3 className="relative z-10 font-sans [font-weight:700] [font-size:32px] [line-height:1.1] [letter-spacing:-0.025em] [color:var(--color-soft-lavender)] [margin:0px] [padding-right:48px] max-[900px]:pb-8 max-[900px]:pr-0">
            A backlist deep enough to dive in.
          </h3>
          <div className="relative z-10 border-l border-white/15 pl-9 max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pb-7 max-[900px]:pl-0 max-[900px]:pt-7">
            <div className="font-serif [font-style:italic] [font-weight:500] [font-size:54px] [color:var(--color-soft-lavender)] [line-height:1]">
              46
            </div>
            <div className="font-sans [font-size:11px] [letter-spacing:0.18em] uppercase [color:rgba(196,185,203,0.6)] [margin-top:10px] [font-weight:600]">
              Books
            </div>
          </div>
          <div className="relative z-10 border-l border-white/15 pl-9 max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pl-0 max-[900px]:pt-7">
            <div className="font-serif [font-style:italic] [font-weight:500] [font-size:54px] [color:var(--color-soft-lavender)] [line-height:1]">
              11
            </div>
            <div className="font-sans [font-size:11px] [letter-spacing:0.18em] uppercase [color:rgba(196,185,203,0.6)] [margin-top:10px] [font-weight:600]">
              Series
            </div>
          </div>
        </div>
      </section>

      <section className="max-[640px]:px-5 [max-width:1240px] [margin:0_auto] [padding:56px_40px_24px]">
        <div className="text-center [max-width:600px] [margin:0_auto_36px]">
          <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:14px]">
            Loved by readers
          </div>
          <h2 className="font-sans [font-weight:700] [font-size:clamp(30px,3.4vw,40px)] [letter-spacing:-0.025em] [color:var(--color-deep-plum)] [margin:0px] [line-height:1.06] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
            The Margins Are Half the Fun
          </h2>
        </div>
        <div className="grid [grid-template-columns:repeat(3,1fr)] [gap:20px] max-[900px]:grid-cols-1">
          {reactions.map((r) => (<article key={r.name} className="relative flex flex-col gap-5 overflow-hidden rounded-[28px] border border-white/60 bg-[rgba(252,251,252,0.68)] p-7 shadow-[0_22px_50px_-36px_rgba(53,5,73,0.6)] backdrop-blur-xl">
              <span aria-hidden="true" className="absolute -right-1 -top-7 font-serif text-[112px] leading-none text-[var(--color-hot-magenta)]/8">&ldquo;</span>
              <p className="relative z-10 font-serif [font-style:italic] [font-weight:500] [font-size:19px] [line-height:1.55] [color:var(--color-deep-plum)] [margin:0px] [flex:1] text-pretty">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="flex items-center [gap:12px]">
                <div className={`flex size-[42px] flex-none items-center justify-center rounded-full font-sans text-sm font-bold text-[var(--color-soft-lavender)] ${r.color}`}>
                  {r.initials}
                </div>
                <div className="font-sans [font-weight:600] [font-size:15px] [color:var(--color-deep-plum)]">
                  {r.name}
                </div>
              </div>
            </article>))}
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-[1240px] px-10 pb-16 pt-10 max-[640px]:px-5">
        <div className="relative isolate grid items-center gap-12 overflow-hidden rounded-[38px] border border-white/15 bg-[linear-gradient(135deg,var(--color-deep-plum)_0%,var(--color-hot-magenta)_210%)] p-[clamp(40px,5vw,60px)] shadow-[0_36px_76px_-38px_rgba(53,5,73,0.88)] [grid-template-columns:1.05fr_0.95fr] max-[900px]:grid-cols-1">
          <div aria-hidden="true" className="absolute -left-24 -top-32 size-80 rounded-full bg-[var(--color-cool-teal)]/20 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-36 right-0 size-80 rounded-full bg-[var(--color-hot-magenta)]/25 blur-3xl" />
          <div className="relative z-10">
            <div className="font-sans [font-weight:700] [font-size:11px] [letter-spacing:0.18em] uppercase [color:var(--color-hot-magenta)] [margin-bottom:16px]">
              The weekly letter
            </div>
            <h2 className="font-sans [font-weight:700] [font-size:clamp(30px,3.6vw,44px)] [letter-spacing:-0.03em] [color:var(--color-soft-lavender)] [margin:0_0_14px] [line-height:1.04] [max-width:16ch] text-balance max-sm:text-[clamp(1.875rem,9vw,2.625rem)]">
              She Who Writes Herself, in Your Inbox
            </h2>
            <p className="[font-size:17px] [line-height:1.6] [color:rgba(196,185,203,0.8)] [margin:0px] [max-width:48ch] text-pretty">
              New chapters, essays on craft and culture, and book news — one considered email a week.
              No noise, no spam, unsubscribe any time.
            </p>
          </div>
          <div className="relative z-10">
            {!homeSubscribed ? (<>
                <label htmlFor="home-newsletter-email" className="block font-sans [font-weight:600] [font-size:13px] [color:var(--color-soft-lavender)] [margin-bottom:9px]">
                  Email address
                </label>
                <form onSubmit={subscribe} className="flex [gap:12px] flex-wrap">
                  <input id="home-newsletter-email" className="placeholder:text-[var(--color-soft-lavender)]/50 [flex:1] [min-width:200px] [border:1px_solid_rgba(196,185,203,0.16)] [background:rgba(103,160,175,0.1)] [border-radius:999px] [padding:14px_22px] font-sans [font-size:15px] [color:var(--color-soft-lavender)]" type="email" name="email" autoComplete="email" required placeholder="Email address" value={homeEmail} onChange={(e) => setHomeEmail(e.target.value)}/>
                  <button type="submit" disabled={homeSubscribePending} className="transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--color-deep-plum)] hover:shadow-xl active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 flex-none [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] [padding:15px_28px] [border-radius:999px] font-sans [font-weight:600] [font-size:15px]">
                    {homeSubscribePending ? "Subscribing…" : "Subscribe ↗"}
                  </button>
                </form>
                {homeSubscribeError && (<p role="alert" className="[color:var(--color-cool-teal)] [font-size:13px] [margin:12px_0_0] text-pretty">
                    {homeSubscribeError}
                  </p>)}
                <div className="font-sans [font-size:12px] [letter-spacing:0.04em] [color:rgba(196,185,203,0.55)] [margin-top:14px]">
                  Free, always · unsubscribe any time
                </div>
              </>) : (<div className="flex items-center [gap:14px] [background:rgba(103,160,175,0.1)] [border-radius:20px] [padding:22px_24px]">
                <span className="flex-none [width:40px] [height:40px] [border-radius:999px] [background:var(--color-hot-magenta)] [color:var(--color-brand-surface)] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </span>
                <div>
                  <div className="font-sans [font-weight:600] [font-size:16px] [color:var(--color-soft-lavender)]">
                    You&apos;re on the list.
                  </div>
                  <div className="[font-size:13px] [color:rgba(196,185,203,0.7)] [margin-top:2px]">
                    The next letter lands Sunday morning.
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
    </main>);
}
