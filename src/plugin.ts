// setup.js
import { config, VueWrapper } from '@vue/test-utils'

/**
 * Plugin to be passed to `config.plugins.VueWrapper.install()`. See
 * https://vue-test-utils.vuejs.org/v2/guide/plugins.html#using-a-plugin
 */
export const VueRouterMock = (wrapper: VueWrapper<any>) => {
  return {
    $el: wrapper.element, // simple aliases
  }
}

/**
 * Call this function in a `setup.js` file that you add at `setupFiles` or
 * `setupFilesAfterEnv` in `jest.config.js`. See
 * https://jestjs.io/docs/en/configuration.html#setupfiles-array.
 */
export function installRouterMock() {
  config.plugins.VueWrapper.install(VueRouterMock)
}
