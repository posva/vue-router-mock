import { config } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { routerKey } from 'vue-router'
import type { RouterMock } from './router'
import './globalExtensions'

export function plugin(
  wrapper: VueWrapper<any>
  // options: Pick<
  //   RouterOptions,
  //   | 'end'
  //   | 'sensitive'
  //   | 'strict'
  //   | 'linkActiveClass'
  //   | 'linkExactActiveClass'
  //   | 'parseQuery'
  //   | 'stringifyQuery'
  // > &
  //   RouterMockOptions = {}
) {
  // if (!config.global.components.RouterView) {
  //   const router = createRouterMock(options)
  //   injectRouterMock(router)
  // }

  const router: RouterMock = getRouter()

  // set all instances when installing the plugin
  // TODO: WTF needs any at build
  router.currentRoute.value.matched.forEach((record: any) => {
    for (const name in record.components) {
      record.instances[name] = wrapper.vm
    }
  })

  wrapper.router = router

  return wrapper
}

export function getRouter() {
  return config.global.provide[routerKey as any] as RouterMock
}
