
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

// IMPORTANT: After changing this file, you MUST restart the Next.js development server
// for the changes to take effect.
const baseNextConfig: NextConfig = {
  /* config options here */
  images: {
    // Using the 'domains' property as a more direct alternative to remotePatterns
    // to ensure the configuration is picked up correctly.
    domains: [
      'placehold.co',
      'workwellfut.com',
      'workwellfut.hl1450.dinaserver.com',
    ],
  },
};

// Temporarily disable PWA by not wrapping the config
// const finalConfig = isDev ? baseNextConfig : withPWA(baseNextConfig);
const finalConfig = baseNextConfig; // PWA functionality is completely disabled for now

export default finalConfig;
