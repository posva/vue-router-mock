import { defineConfig } from 'tsdown'

export default defineConfig({
  external: ['vue', 'vue-router', '@vue/test-utils'],
  sourcemap: true,
})
