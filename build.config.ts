import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  // cjsBridge: false,
  // emitCJS: false,
  declaration: true,
  externals: ['vue', 'vue-router', '@vue/test-utils'],
})
