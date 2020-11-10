import {
  createRouter,
  createWebHashHistory,
  routeLocationKey,
  RouteLocationNormalizedLoaded,
  RouteLocationRaw,
  Router,
  routerKey,
} from 'vue-router'
import { config, VueWrapper } from '@vue/test-utils'
import { computed, ComputedRef, reactive, Ref } from 'vue'

export function routerMockPlugin(
  wrapper: VueWrapper<any>,
  { router }: { router: Router }
) {
  return {}
}

export function addGlobalInjections(router: Router) {
  const route = createReactiveRouteLocation(router.currentRoute)

  config.global.provide[routerKey as any] = router
  config.global.provide[routeLocationKey as any] = route

  // console.log({ route })

  config.global.mocks.$router = router
  config.global.mocks.$route = route

  config.global.stubs.RouterLink = true
  config.global.stubs.RouterView = true

  return { router, route }
}

export function createMockedRouter() {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/:pathMatch(.*)*',
        component: { render: () => null },
      },
    ],
  })

  const { push } = router

  const pushMock = jest.fn((to) => {
    return consumeNextReturn(to)
  })

  const replaceMock = jest.fn((to) => {
    return consumeNextReturn({ ...to, replace: true })
  })

  router.push = pushMock
  router.replace = replaceMock

  beforeEach(() => {
    pushMock.mockClear()
    replaceMock.mockClear()
  })

  let nextReturn: Error | boolean | RouteLocationRaw | undefined = undefined

  function setNextGuardReturn(
    returnValue: Error | boolean | RouteLocationRaw | undefined
  ) {
    nextReturn = returnValue
  }

  function consumeNextReturn(to: RouteLocationRaw) {
    if (nextReturn != null) {
      const removeGuard = router.beforeEach(() => {
        const value = nextReturn
        removeGuard()
        nextReturn = undefined
        return value
      })
      pendingNavigation = push(to)
      pendingNavigation
        .catch(() => {})
        .finally(() => {
          pendingNavigation = undefined
        })
      return pendingNavigation
    }

    // NOTE: should we trigger a push to reset the internal pending navigation of the router?
    router.currentRoute.value = router.resolve(to)
    return Promise.resolve()
  }

  let pendingNavigation: ReturnType<typeof push> | undefined
  function getPendingNavigation() {
    return pendingNavigation || Promise.resolve()
  }

  return {
    ...router,
    setNextGuardReturn,
    getPendingNavigation,
  }
}

function createReactiveRouteLocation(
  route: Ref<RouteLocationNormalizedLoaded>
): RouteLocationNormalizedLoaded {
  return reactive(
    Object.keys(route.value).reduce(
      (newRoute, key) => {
        // @ts-ignore
        newRoute[key] = computed(() => route.value[key])
        return newRoute
      },
      {} as {
        [k in keyof RouteLocationNormalizedLoaded]: ComputedRef<
          RouteLocationNormalizedLoaded[k]
        >
      }
    )
  ) as RouteLocationNormalizedLoaded
}
