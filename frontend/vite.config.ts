import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'exclude-test-folder',
      enforce: 'pre',
      resolveId(source) {
        if (source.includes('/test/') || source.includes('\\test\\')) {
          return { id: source, external: true };
        }
        return null;
      },
    },
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'docs', '**/docs/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'docs/**',
        '**/docs/**',
        'node_modules/**',
        'src/**/*.d.ts',
        'src/**/__tests__/**',
        'eslint.config.js',
        'vite.config.ts',
      ],
    },
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api': {
        target: 'http://backend',
        changeOrigin: true,
      },
    },
  },
});

/*
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    //checker({ typescript: true }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
    },
  },
});
*/
