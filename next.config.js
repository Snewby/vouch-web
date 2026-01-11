/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,  // Enable React Compiler for automatic memoization
  images: {
    domains: [],
  },
}

module.exports = nextConfig
