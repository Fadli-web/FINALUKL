import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Setiap kali frontend memanggil /api/..., otomatis diteruskan ke backend Railway
        source: '/api/:path*',
        destination: 'https://cafe-pos-backend-production.up.railway.app/:path*',
      },
    ];
  },
};

export default nextConfig;