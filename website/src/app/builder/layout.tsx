import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "String Builder",
  description:
    "Build a custom ScreenShareTool .txt from 2500+ forensic strings — pick categories, download for System Informer or live shares.",
}

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return children
}
