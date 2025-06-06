
import type {NextConfig} from 'next';
// Temporarily comment out PWA related imports
// import withPWAInit from 'next-pwa';

const isDev = process.env.NODE_ENV !== 'production';

// Temporarily comment out PWA initialization
// const withPWA = withPWAInit({
//   dest: 'public',
//   disable: isDev, 
//   register: true,
//   skipWaiting: true, 
// });

const baseNextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// Temporarily disable PWA by not wrapping the config
// const finalConfig = isDev ? baseNextConfig : withPWA(baseNextConfig);
const finalConfig = baseNextConfig; // PWA functionality is completely disabled for now

export default finalConfig;
