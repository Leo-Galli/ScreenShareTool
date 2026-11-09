import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forensic Strings Dictionary",
  description:
    "8000+ real forensic strings across 70+ categories — registry keys, commands, paths, cheat clients, and artifacts. Searchable by OS, or export a custom .txt with the builder.",
};

export default function StringsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
