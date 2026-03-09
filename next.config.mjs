/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore legacy HTML files during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
