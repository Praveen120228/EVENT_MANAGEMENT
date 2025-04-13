/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'path', etc. on the client
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        os: false,
        child_process: false,
        dns: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  serverExternalPackages: ['nodemailer', 'puppeteer', 'puppeteer-core', 'razorpay']
}

export default nextConfig; 