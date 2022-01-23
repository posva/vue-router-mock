import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  externals: ['vue', 'vue-router', '@vue/test-utils'],
})
