"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { chapterTitles, reactions } from "@/lib/data";

// localStorage is the source of truth for reading progress; a custom event
// notifies subscribers so useSyncExternalStore re-reads after each write.
const CHAPTER_KEY = "nf_chapter";
const CHAPTER_EVENT = "nf-chapter-change";

function subscribeChapter(onChange: () => void) {
  window.addEventListener(CHAPTER_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHAPTER_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readChapter(): number {
  try {
    const n = parseInt(window.localStorage.getItem(CHAPTER_KEY) ?? "", 10);
    if (!Number.isNaN(n) && n >= 1 && n <= 11) return n;
  } catch {}
  return 11;
}

function writeChapter(n: number) {
  try {
    window.localStorage.setItem(CHAPTER_KEY, String(n));
  } catch {}
  window.dispatchEvent(new Event(CHAPTER_EVENT));
}

export default function SerialPage() {
  const router = useRouter();
  const chapter = useSyncExternalStore(subscribeChapter, readChapter, () => 11);

  const currentChapterTitle = chapterTitles[chapter - 1];
  const prevChapter = () => writeChapter(Math.max(1, chapter - 1));
  const nextChapter = () => writeChapter(Math.min(11, chapter + 1));

  const chapters = chapterTitles.map((title, i) => {
    const n = i + 1;
    const isCur = n === chapter;
    const done = n < chapter;
    return {
      label: String(n).padStart(2, "0"),
      title,
      locked: false,
      rowBg: isCur ? "var(--bg-3)" : "transparent",
      color: isCur ? "var(--bg-inverse)" : done ? "var(--fg-3)" : "var(--fg-1)",
      numColor: isCur ? "var(--accent)" : "var(--fg-3)",
      weight: isCur ? 700 : 500,
    };
  });
  chapters.push({
    label: "✦",
    title: "Luke's POV (bonus)",
    locked: true,
    rowBg: "transparent",
    color: "var(--fg-3)",
    numColor: "var(--accent)",
    weight: 500,
  });

  const progressPct = Math.round((chapter / 12) * 100) + "%";

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 40px 64px" }}>
      <button
        onClick={() => router.push("/read")}
        className="nf-link"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 13,
          color: "var(--fg-2)",
          marginBottom: 24,
        }}
      >
        ← Back to Read
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 280px",
          gap: 40,
          alignItems: "start",
        }}
      >
        <aside style={{ position: "sticky", top: 90 }}>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 24,
              color: "var(--fg-strong)",
              marginBottom: 4,
            }}
          >
            Forty-Nothing
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              marginBottom: 18,
            }}
          >
            Nia Forrester
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "var(--bg-2)",
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: progressPct,
                height: "100%",
                background: "var(--accent)",
              }}
            ></div>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 12,
              color: "var(--fg-3)",
              marginBottom: 20,
            }}
          >
            {chapter} of 12 chapters read
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxHeight: "50vh",
              overflowY: "auto",
            }}
          >
            {chapters.map((c) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 10,
                  background: c.rowBg,
                }}
              >
                <span
                  style={{
                    width: 18,
                    textAlign: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: c.numColor,
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: c.weight,
                    color: c.color,
                    lineHeight: 1.3,
                  }}
                >
                  {c.title}
                </span>
                {c.locked && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flex: "none", color: "var(--fg-4)" }}
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </aside>

        <article>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 10,
            }}
          >
            Chapter {chapter}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 44,
              lineHeight: 1.08,
              color: "var(--fg-strong)",
              margin: "0 0 28px",
            }}
          >
            {currentChapterTitle}
          </h1>
          <div
            style={{
              fontSize: 19,
              lineHeight: 1.75,
              color: "var(--fg-1)",
              maxWidth: "62ch",
            }}
          >
            <p style={{ margin: "0 0 22px" }}>
              <span
                style={{
                  float: "left",
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 58,
                  lineHeight: 0.82,
                  padding: "6px 12px 0 0",
                  color: "var(--fg-strong)",
                }}
              >
                T
              </span>
              he doorbell rang at 9:14 on a Tuesday, and Norah knew — the way you
              know weather, the way you know your own name — exactly who it was
              before she crossed the room.
            </p>
            <p style={{ margin: "0 0 22px" }}>
              Six years. She had built a whole life in six years. A life with
              edges she had sanded smooth herself, a life that did not require
              explanation or apology, a life that fit. And now the bell, and
              behind it the shape of a man she had loved enough to ruin herself
              over, standing on her step like he had any right to the air on
              this side of the door.
            </p>
            <p style={{ margin: "0 0 22px" }}>
              &ldquo;Don&rsquo;t,&rdquo; she said, before he could speak. Not{" "}
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                go away.
              </em>{" "}
              Not{" "}
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                how dare you.
              </em>{" "}
              Just — don&rsquo;t. Don&rsquo;t undo the thing I spent six years
              constructing with my bare hands.
            </p>
            <p style={{ margin: "0 0 22px" }}>
              Luke had the grace, at least, to look like a man who understood he
              was asking for something he had not earned. He held nothing. No
              flowers, no speech, no ring returned in a velvet box. Only his
              hands, open at his sides, and the particular silence of someone
              who has rehearsed every word and decided, at the threshold, to
              abandon all of them.
            </p>
            <p style={{ margin: "0 0 22px" }}>
              &ldquo;Norah,&rdquo; he said. And that was the trouble with him.
              That had always been the trouble with him. He could put her whole
              name in his mouth like it was the only word he&rsquo;d ever
              learned, and her carefully constructed composure would crack right
              down the middle.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 44,
              paddingTop: 24,
              borderTop: "1px solid var(--border-1)",
            }}
          >
            <button
              onClick={prevChapter}
              style={{
                background: "var(--surface-card)",
                color: "var(--fg-strong)",
                padding: "12px 20px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              ← Previous
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "var(--fg-3)",
              }}
            >
              <span
                style={{ fontSize: 13, fontFamily: "var(--font-display)" }}
              >
                Reading time ~6 min
              </span>
            </div>
            <button
              onClick={nextChapter}
              className="nf-btn-primary"
              style={{
                background: "var(--accent)",
                color: "var(--fg-on-accent)",
                padding: "12px 20px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Next chapter →
            </button>
          </div>

          <div
            style={{
              marginTop: 32,
              background: "var(--bg-inverse)",
              borderRadius: 24,
              padding: "28px 32px",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--st-light-blush)",
                  marginBottom: 8,
                }}
              >
                Bonus chapter · Inner Circle
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: 22,
                  color: "var(--st-soft-cream)",
                  margin: "0 0 6px",
                }}
              >
                Luke&rsquo;s POV — the drive over
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(228,216,215,0.75)",
                  margin: 0,
                }}
              >
                What was going through his head on the six-hour drive. Members
                read it first.
              </p>
            </div>
            <button
              onClick={() => router.push("/membership")}
              className="nf-btn-primary"
              style={{
                flex: "none",
                background: "var(--accent)",
                color: "var(--fg-on-accent)",
                padding: "13px 22px",
                borderRadius: 999,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Unlock ↗
            </button>
          </div>
        </article>

        <aside
          style={{
            position: "sticky",
            top: 90,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              background: "var(--bg-3)",
              borderRadius: 20,
              padding: 22,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--bg-inverse)",
                marginBottom: 10,
              }}
            >
              From Nia
            </div>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 15,
                lineHeight: 1.55,
                color: "var(--bg-inverse)",
                margin: 0,
              }}
            >
              &ldquo;I rewrote this doorbell six times. The version where she
              doesn&rsquo;t open it is in a drawer. Maybe one day.&rdquo;
            </p>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 18,
                  color: "var(--fg-1)",
                  margin: 0,
                }}
              >
                In the margins
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  color: "var(--accent)",
                  fontWeight: 600,
                }}
              >
                48
              </span>
            </div>
            {reactions.map((r) => (
              <div
                key={r.initials}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border-1)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    flex: "none",
                    background: r.color,
                    color: "var(--st-soft-cream)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: 13,
                    border: "2px solid var(--st-light-blush)",
                  }}
                >
                  {r.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--fg-1)",
                      marginBottom: 2,
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "var(--fg-2)",
                    }}
                  >
                    &ldquo;{r.quote}&rdquo;
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => router.push("/community")}
              className="nf-link"
              style={{
                marginTop: 14,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--fg-2)",
              }}
            >
              Join the discussion
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
