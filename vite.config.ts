import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'social',
      filename: 'remoteEntry.js',
      exposes: {
        './SocialApp': './src/App',
        './SocialStyles': './src/index.css',
      },
      shared: {
        react: { singleton: true, requiredVersion: '18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '18.2.0' },
        'react/jsx-runtime': { singleton: true },
        '@OmarZambranoDev/portfolio-ui': { singleton: true },
        zustand: { singleton: true, version: '4.5.2' },
      },
    }),
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
  },
  server: {
    port: 3004,
    cors: true,
  },
  preview: {
    port: 3004,
    cors: true,
  },
});
