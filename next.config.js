/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ENDPOINT: process.env.ENDPOINT,
    PAYPAL_SANDBOX_CLIENT_ID: process.env.PAYPAL_SANDBOX_CLIENT_ID,
    DEV_MODE: process.env.DEV_MODE,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
};

module.exports = nextConfig;
