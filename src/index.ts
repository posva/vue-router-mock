export { injectRouterMock, createProvide } from './injections'
export {
  RouterMock,
  createRouterMock,
  EmptyView,
  RouterMockOptions,
} from './router'
export { plugin as VueRouterMock, getRouter } from './plugin'

import { RouterMock } from './router'
import { ComponentPublicInstance } from 'vue'

declare module '@vue/test-utils' {
  export class VueWrapper<T extends ComponentPublicInstance> {
    router: RouterMock
  }
}

// TODO: find how to do
// import { RouterMock } from './router'
// declare module '@vue/runtime-core' {
//   export interface ComponentCustomProperties {
//     /**
//      * Router Mock instance used by the application.
//      */
//     $router: RouterMock
//   }
// }
