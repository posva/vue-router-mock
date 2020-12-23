import {
  matchedRouteKey,
  routeLocationKey,
  RouteLocationNormalizedLoaded,
  routerKey,
  RouterLink,
  RouterView,
  routerViewLocationKey,
  // @ts-ignore: for api-extractor
  RouteLocationMatched,
} from 'vue-router'
import { config } from '@vue/test-utils'
import { createReactiveRouteLocation } from './routeLocation'
import { createRouterMock, RouterMock } from './router'
// @ts-ignore: for api-extractor
import { computed, Ref, ComputedRef } from 'vue'

/**
 * Inject global variables, overriding any previously inject router mock
 *
 * @param router - router mock to inject
 */
export function injectRouterMock(router?: RouterMock) {
  router = router || createRouterMock()

  const provides = createProvide(router)
  const route = provides[
    routeLocationKey as any
  ] as RouteLocationNormalizedLoaded

  Object.assign(config.global.provide, provides)

  config.global.mocks.$router = router
  config.global.mocks.$route = route

  // TODO: stub that provides the prop route or the current route with machedRouteKey
  config.global.components.RouterView = RouterView
  config.global.components.RouterLink = RouterLink

  config.global.stubs.RouterLink = true
  config.global.stubs.RouterView = true

  return { router, route }
}

/**
 * Creates an object of properties to be provided at your application level to
 * mock what is injected by vue-router
 *
 * @param router - router mock instance
 */
export function createProvide(router: RouterMock) {
  const route = createReactiveRouteLocation(router.currentRoute)

  const matchedRouteRef = computed(
    () => router.currentRoute.value.matched[router.depth.value]
  )

  return {
    [routerKey as any]: router,
    [routeLocationKey as any]: route,
    [routerViewLocationKey as any]: router.currentRoute,
    [matchedRouteKey as any]: matchedRouteRef,
  }
}
