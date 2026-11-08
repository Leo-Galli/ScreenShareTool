import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forensic Strings Dictionary",
  description:
    "2500+ real forensic strings across 58 categories — registry keys, commands, paths, cheat clients, and artifacts. Searchable by OS, or export a custom .txt with the builder.",
};

export default function StringsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
