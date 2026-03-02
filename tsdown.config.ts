import { defineConfig } from 'tsdown'

export default defineConfig({
  deps: {
    onlyAllowBundle: [],
    neverBundle: [
      'vue',
      'vue-router',
      '@vue/test-utils',
      '@vue/reactivity',
      '@vue/shared',
    ],
  },
  sourcemap: true,
  exports: true,
})
