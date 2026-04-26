/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workspace packages are TS source — Next must transpile them.
  transpilePackages: ['@truthtap/theme', '@truthtap/types'],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
