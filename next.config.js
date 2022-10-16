/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        version: process.env.npm_package_version,
    },
};

module.exports = nextConfig;
