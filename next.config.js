/** @type {import('next').NextConfig} */
const nextConfig = {
  // Retirer 'output: export' pour utiliser ISR au lieu d'export statique complet
  // Cela permet de générer les pages à la demande et éviter les erreurs 429
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.thesportsdb.com',
      },
    ],
  },
};

module.exports = nextConfig;
