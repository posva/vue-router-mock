import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./__tests__/setup.ts'],
    environment: 'happy-dom',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcovonly', 'html'],
      all: true,
      include: ['src'],
      exclude: ['src/index.ts', 'src/**/*.test-d.ts', 'src/testers'],
    },
  },
})
