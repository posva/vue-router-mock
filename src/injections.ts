import {
  routeLocationKey,
  routerKey,
  RouterLink,
  RouterView,
  routerViewLocationKey,
} from 'vue-router'
import { config } from '@vue/test-utils'
import { createReactiveRouteLocation } from './routeLocation'
import { RouterMock } from './router'

/**
 * Inject global variables, overriding any previously inject router mock
 *
 * @param router router mock to inject
 */
export function injectRouterMock(router: RouterMock) {
  const route = createReactiveRouteLocation(router.currentRoute)

  config.global.provide[routerKey as any] = router
  config.global.provide[routeLocationKey as any] = route
  config.global.provide[routerViewLocationKey as any] = router.currentRoute

  // console.log({ route })

  config.global.mocks.$router = router
  config.global.mocks.$route = route

  config.global.components.RouterView = RouterView
  config.global.components.RouterLink = RouterLink

  config.global.stubs.RouterLink = true
  config.global.stubs.RouterView = true

  return { router, route }
}
