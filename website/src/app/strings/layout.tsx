import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forensic Strings Dictionary",
  description:
    "800+ real forensic strings across 34 categories — registry keys, commands, file paths, and artifacts used in Minecraft screen share investigations. Searchable and filterable by OS.",
};

export default function StringsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
