import {
  createRouter,
  createWebHashHistory,
  isNavigationFailure,
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

  const pushMock = jest.fn((to) => {
    router.currentRoute.value = router.resolve(to)
    return consumeNavigationFailure()
  })

  const replaceMock = jest.fn((to) => {
    router.currentRoute.value = router.resolve(to)
    return consumeNavigationFailure()
  })

  router.push = pushMock
  router.replace = replaceMock

  beforeEach(() => {
    pushMock.mockClear()
    replaceMock.mockClear()
  })

  let nextFailure: Error | boolean | RouteLocationRaw | undefined = undefined

  function failNextNavigation(
    failure: Error | boolean | RouteLocationRaw | undefined
  ) {
    nextFailure = failure
  }

  function consumeNavigationFailure() {
    let p: Promise<any> = Promise.resolve()

    if (nextFailure) {
      if (isNavigationFailure(nextFailure)) {
        p = Promise.resolve(nextFailure)
      } else {
        p = Promise.reject(nextFailure)
      }
    }

    nextFailure = undefined

    return p
  }

  return {
    ...router,
    failNextNavigation,
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
