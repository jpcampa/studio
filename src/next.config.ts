
import type {NextConfig} from 'next';

// IMPORTANTE: Después de cambiar este archivo, DEBES reiniciar el servidor de desarrollo de Next.js
// para que los cambios en la configuración de imágenes (remotePatterns) se apliquen.
// Pulsa Ctrl+C en tu terminal y vuelve a ejecutar `npm run dev`.

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
        hostname: 'workwellfut.hl1450.dinaserver.com',
      },
    ],
  },
};

export default nextConfig;
