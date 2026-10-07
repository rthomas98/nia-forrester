"use client";

import { useId } from "react";
import { Add, ArrowDownward, ArrowUpward, Delete } from "relume-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { alertText, fieldLabel, label, nativeSelect } from "@/lib/typography";
import { MediaUpload } from "./editorial-media-upload";
import { emptyBlock, type EditorialBlock, type EditorialBlockType, type EditorialIssues } from "./editorial-model";

/** A block plus a client-only key so React keeps focus when blocks move. */
export type KeyedBlock = { key: string; block: EditorialBlock };

let nextKey = 0;
export const keyBlock = (block: EditorialBlock): KeyedBlock => ({ key: `b${nextKey++}`, block });

const blockNames: Record<EditorialBlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  quote: "Quote",
  image: "Image",
  video: "Video",
  link: "Link",
};
const addable: EditorialBlockType[] = ["paragraph", "heading", "quote", "image", "video", "link"];

function BlockFields({ block, onChange, invalid }: {
  block: EditorialBlock;
  onChange: (block: EditorialBlock) => void;
  invalid: boolean;
}) {
  const id = useId();
  switch (block.type) {
    case "paragraph":
    case "quote":
      return (
        <label htmlFor={id} className={fieldLabel}>
          {block.type === "quote" ? "Quote text" : "Text"}
          <Textarea id={id} rows={block.type === "quote" ? 3 : 6} value={block.text} onChange={event => onChange({ ...block, text: event.target.value })} />
        </label>
      );
    case "heading":
      return (
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
          <label htmlFor={id} className={fieldLabel}>
            Heading text
            <Input id={id} value={block.text} onChange={event => onChange({ ...block, text: event.target.value })} />
          </label>
          <label htmlFor={`${id}-level`} className={fieldLabel}>
            Level
            <select id={`${id}-level`} className={`${nativeSelect} mt-0`} value={block.level} onChange={event => onChange({ ...block, level: event.target.value === "3" ? 3 : 2 })}>
              <option value={2}>Section (H2)</option>
              <option value={3}>Subsection (H3)</option>
            </select>
          </label>
        </div>
      );
    case "image":
      return (
        <div className="grid gap-4">
          <label htmlFor={id} className={fieldLabel}>
            Image URL
            <Input id={id} type="url" inputMode="url" aria-invalid={invalid || undefined} value={block.url} placeholder="https://" onChange={event => onChange({ ...block, url: event.target.value.trim() })} />
          </label>
          <MediaUpload label="Upload Image" onUploaded={url => onChange({ ...block, url })} />
          <label htmlFor={`${id}-alt`} className={fieldLabel}>
            Alternative text
            <Input id={`${id}-alt`} aria-invalid={(invalid && !block.alt.trim()) || undefined} value={block.alt} onChange={event => onChange({ ...block, alt: event.target.value })} />
          </label>
          <label htmlFor={`${id}-caption`} className={fieldLabel}>
            Caption (optional)
            <Input id={`${id}-caption`} value={block.caption ?? ""} onChange={event => onChange({ ...block, caption: event.target.value || undefined })} />
          </label>
        </div>
      );
    case "video":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor={id} className={fieldLabel}>
            Video URL (YouTube or Vimeo embed; others link out)
            <Input id={id} type="url" inputMode="url" aria-invalid={invalid || undefined} value={block.url} placeholder="https://" onChange={event => onChange({ ...block, url: event.target.value.trim() })} />
          </label>
          <label htmlFor={`${id}-title`} className={fieldLabel}>
            Video title
            <Input id={`${id}-title`} value={block.title} onChange={event => onChange({ ...block, title: event.target.value })} />
          </label>
        </div>
      );
    case "link":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor={id} className={fieldLabel}>
            Link URL
            <Input id={id} type="url" inputMode="url" aria-invalid={invalid || undefined} value={block.url} placeholder="https://" onChange={event => onChange({ ...block, url: event.target.value.trim() })} />
          </label>
          <label htmlFor={`${id}-text`} className={fieldLabel}>
            Link text
            <Input id={`${id}-text`} value={block.text} onChange={event => onChange({ ...block, text: event.target.value })} />
          </label>
        </div>
      );
  }
}

export function BlockEditor({ blocks, onChange, issues }: {
  blocks: KeyedBlock[];
  onChange: (blocks: KeyedBlock[]) => void;
  issues: EditorialIssues;
}) {
  const update = (index: number, block: EditorialBlock) =>
    onChange(blocks.map((item, i) => (i === index ? { ...item, block } : item)));
  const move = (index: number, by: -1 | 1) => {
    const next = [...blocks];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    onChange(next);
  };

  return (
    <fieldset className="grid gap-4">
      <legend className="mb-4 font-display text-h5 font-semibold text-cream">Content</legend>
      {issues.blocks ? <p role="alert" className={alertText}>{issues.blocks}</p> : null}
      {blocks.length === 0 ? <p className="text-small text-taupe">No content yet. Add a block below.</p> : null}
      <ol className="grid gap-4">
        {blocks.map((item, index) => {
          const issue = issues[`block-${index}`];
          const name = `${blockNames[item.block.type]} ${index + 1}`;
          return (
            <li key={item.key}>
              <Card variant="sunken" className="grid gap-4 p-4 sm:p-5" aria-label={name}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={label}>{name}</span>
                  <div className="flex gap-1">
                    <Button type="button" size="icon" variant="ghost" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${name} up`}><ArrowUpward aria-hidden="true" className="size-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" disabled={index === blocks.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${name} down`}><ArrowDownward aria-hidden="true" className="size-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" onClick={() => onChange(blocks.filter((_, i) => i !== index))} aria-label={`Remove ${name}`}><Delete aria-hidden="true" className="size-4" /></Button>
                  </div>
                </div>
                <BlockFields block={item.block} invalid={Boolean(issue)} onChange={block => update(index, block)} />
                {issue ? <p role="alert" className={alertText}>{issue}</p> : null}
              </Card>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Add a content block">
        {addable.map(type => (
          <Button key={type} type="button" size="sm" variant="secondary" iconLeft={<Add aria-hidden="true" className="size-4" />} onClick={() => onChange([...blocks, keyBlock(emptyBlock(type))])}>
            {blockNames[type]}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
