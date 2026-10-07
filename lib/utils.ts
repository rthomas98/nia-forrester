// Relume primitive (lib/utils.ts), vendored via the Relume Library MCP.
// Adaptation: tailwind-merge is told that Relume's type tokens (`text-h1`…`text-tiny`)
// are font sizes. Without this it classifies them as text colours and drops either the
// size or the colour when both appear in one `cn()` call.
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["h1", "h2", "h3", "h4", "h5", "h6", "large", "medium", "regular", "small", "tiny"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
