/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow ESLint to run during builds, respecting the .eslintrc or eslint.config.mjs rules
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;