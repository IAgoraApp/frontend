import process from 'node:process';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd());
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-router-dom',
        'lucide-react',
      ],
    },
    server: {
      strictPort: true,
      proxy: {
        '/api': {
          target: VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          configure(proxy) {
            proxy.on('proxyReq', request => request.removeHeader('origin'));
          },
          rewrite: caminho => caminho.replace(/^\/api(?=\/|$)/, ''),
        },
      },
    },
  };
});
