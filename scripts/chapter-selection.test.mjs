// Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test scripts/chapter-selection.test.mjs
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  chapterIndexForValue,
  chapterOptions,
  clampChapterIndex,
} from "../lib/chapter-selection.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = (relative) => readFileSync(path.join(root, relative), "utf8");

// Two distinct published rows share the title "Interlude" but have different bodies.
const rows = [
  { _id: "ch_one", title: "Chapter One", body: "ONE" },
  { _id: "ch_interlude_a", title: "Interlude", body: "FIRST INTERLUDE" },
  { _id: "ch_interlude_b", title: "Interlude", body: "SECOND INTERLUDE" },
];

test("duplicate-title chapters get distinct option values and keys", () => {
  const options = chapterOptions(rows);
  assert.deepEqual(options.map((o) => o.value), ["ch_one", "ch_interlude_a", "ch_interlude_b"]);
  assert.deepEqual(options.map((o) => o.label), ["Chapter One", "Interlude", "Interlude"]);
  assert.equal(new Set(options.map((o) => o.value)).size, rows.length, "keys must be unique");
});

test("selecting the second duplicate-title chapter selects its own record", () => {
  const index = chapterIndexForValue(rows, "ch_interlude_b");
  assert.equal(index, 2);
  assert.equal(rows[index].body, "SECOND INTERLUDE");
  assert.equal(`${index + 1} of ${rows.length}`, "3 of 3", "chapter number shown");
  const first = chapterIndexForValue(rows, "ch_interlude_a");
  assert.equal(first, 1);
  assert.equal(rows[first].body, "FIRST INTERLUDE");
});

test("exactly one option is pressed for a selection, even with duplicate labels", () => {
  const selectedValue = rows[chapterIndexForValue(rows, "ch_interlude_b")]._id;
  const pressed = chapterOptions(rows).filter((o) => o.value === selectedValue);
  assert.equal(pressed.length, 1);
});

test("unknown ids and out-of-range indexes fall back safely", () => {
  assert.equal(chapterIndexForValue(rows, "missing"), 0);
  assert.equal(clampChapterIndex(rows, 9), 2);
  assert.equal(clampChapterIndex(rows, -1), 0);
  assert.equal(clampChapterIndex([], 3), 0);
});

test("serial picker and Event1Filters select by identity, never by title", () => {
  const serial = source("components/pages/serial-page.tsx");
  assert.ok(serial.includes("chapterOptions(rows)"), "picker options come from chapter identity");
  assert.ok(serial.includes("value={current._id}"), "pressed state compares chapter _id");
  assert.ok(serial.includes("chapterIndexForValue(rows, chapterId)"), "selection resolves by _id");
  assert.ok(!/indexOf\(\s*title\s*\)/.test(serial), "no first-title-match selection");
  assert.ok(serial.includes("current.hasAccess"), "chapter access gate preserved");

  const filters = source("components/relume/event1.tsx");
  assert.ok(filters.includes("key={option.value}"), "React key is the unique value");
  assert.ok(filters.includes("option.value === value"), "pressed state compares values");
  assert.ok(filters.includes("onChange(option.value)"), "selection emits the value");
});

test("redesign UI has no inline style objects or Motion runtime styles", () => {
  const files = (dir) =>
    readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
      const child = path.join(dir, entry.name);
      return entry.isDirectory() ? files(child) : /\.tsx?$/.test(entry.name) ? [child] : [];
    });
  for (const file of [...files("components"), ...files("app")]) {
    const text = source(file);
    assert.ok(!text.includes("style={{"), `inline style in ${file}`);
    assert.ok(!text.includes("motion/react"), `Motion import in ${file}`);
  }
});
