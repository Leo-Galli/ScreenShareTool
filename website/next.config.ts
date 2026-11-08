import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  // Keep Turbopack rooted on this package (avoids parent lockfile outside the repo)
  turbopack: {
    root: path.join(__dirname),
  },
}

export default nextConfig
