import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup'; // <-- Add this import

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdx(), // <-- Add the mdx plugin here
  ],
  resolve: {
    alias: {
      // Example aliases - uncomment and adjust if you need them
      // '@': path.resolve(__dirname, './src'),
      // 'components': path.resolve(__dirname, './src/components'),
      // 'pages': path.resolve(__dirname, './src/pages'),
      // 'utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000, // Or any port you prefer
  },
  test: { // Vitest configuration (if you're using it)
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
});