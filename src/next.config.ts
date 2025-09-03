
import type {NextConfig} from 'next';

const isDev = process.env.NODE_ENV !== 'production';

// IMPORTANTE: Después de cambiar este archivo, DEBES reiniciar el servidor de desarrollo de Next.js
// para que los cambios en la configuración de imágenes (remotePatterns) se apliquen.
// Pulsa Ctrl+C en tu terminal y vuelve a ejecutar `npm run dev`.

const baseNextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'workwellfut.com',
        port: '',
        pathname: '/**',
      },
      {
        // Esta es la configuración clave para permitir las imágenes del blog.
        protocol: 'http',
        hostname: 'workwellfut.hl1450.dinaserver.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

const finalConfig = baseNextConfig;

export default finalConfig;
