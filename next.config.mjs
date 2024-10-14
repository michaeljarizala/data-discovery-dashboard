/** @type {import('next').NextConfig} */

import path from "path"
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: false,
  webpack: (config, options) => {
    config.resolve.alias['components'] = path.join(__dirname, 'components')
    return config
  },
};

export default nextConfig;
