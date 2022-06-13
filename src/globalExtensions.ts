import { RouterMock } from './router'

declare module '@vue/test-utils' {
  interface VueWrapper<T> {
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
