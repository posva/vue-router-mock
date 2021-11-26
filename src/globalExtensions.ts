import { RouterMock } from './router'
import { ComponentPublicInstance } from 'vue'

declare module '@vue/test-utils' {
  interface VueWrapper<T extends ComponentPublicInstance> {
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
