import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        'vite.config.ts',
        'vitest.config.ts',
        'src/vite-env.d.ts',
        'src/main.tsx'
      ],
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
      all: true,
      include: ['src/**/*.{ts,tsx}']
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});