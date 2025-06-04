
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';

const isDev = process.env.NODE_ENV !== 'production';

const withPWA = withPWAInit({
  dest: 'public',
  disable: isDev, // This remains to further ensure PWA is off in dev within the PWA plugin logic itself
  register: true,
  skipWaiting: true, 
});

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

// Conditionally apply withPWA only for production builds
// In development (isDev = true), Turbopack will use baseNextConfig without PWA/Webpack modifications.
// In production (isDev = false), PWA features will be enabled.
const finalConfig = isDev ? baseNextConfig : withPWA(baseNextConfig);

export default finalConfig;
