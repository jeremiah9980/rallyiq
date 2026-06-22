/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this directory. Without this, Next infers the
  // root from the nearest lockfile and can mistakenly pick a parent folder
  // (e.g. the user's home directory) when a stray lockfile exists higher up
  // the tree — which makes it look for the app in the wrong place.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
}

module.exports = nextConfig
