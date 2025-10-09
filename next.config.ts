
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'workwellfut.com',
      },
      {
        protocol: 'http',
        hostname: 'workwellfut.com',
      },
      {
        protocol: 'https',
        hostname: 'workwellfut.hl1450.dinaserver.com',
      },
      {
        protocol: 'http',
        hostname: 'workwellfut.hl1450.dinaserver.com',
      }
    ],
  },
};

export default nextConfig;
