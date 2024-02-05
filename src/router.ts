import { defineComponent, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  LocationQueryRaw,
  RouteLocationRaw,
  RouteParamsRaw,
  Router,
  RouteRecordRaw,
  RouterOptions,
  START_LOCATION,
} from 'vue-router'
import { createSpy, RouterMockSpyOptions, _InferSpyType } from './autoSpy'

export const EmptyView = defineComponent({
  name: 'RouterMockEmptyView',
  render: () => null,
})

/**
 * Router Mock instance
 */
export interface RouterMock extends Router {
  /**
   * Current depth of the router view. This index is used to find the component
   * to display in the array `router.currentRoute.value.matched`.
   */
  depth: Ref<number>
  /**
   * Set a value to be returned on a navigation guard for the next navigation.
   *
   * @param returnValue - value that will be returned on a simulated navigation
   * guard
   */
  setNextGuardReturn(
    returnValue: Error | boolean | RouteLocationRaw | undefined
  ): void

  // NOTE: we could automatically wait for a tick inside getPendingNavigation(), that would require access to the wrapper, unless directly using nextTick from vue works. We could allow an optional parameter `eager: true` to not wait for a tick. Waiting one tick by default is likely to be more useful than not.

  /**
   * Returns a Promise of the pending navigation. Resolves right away if there
   * isn't any.
   */
  getPendingNavigation():
    | ReturnType<Router['push']>
    | ReturnType<Router['back']>

  /**
   * Sets the params of the current route without triggering a navigation. Can
   * be awaited to wait for Vue to render again.
   *
   * @param params - params to set in the current route
   */
  setParams(params: RouteParamsRaw): Promise<void>

  /**
   * Sets the query of the current route without triggering a navigation. Can
   * be awaited to wait for Vue to render again.
   *
   * @param query - query to set in the current route
   */
  setQuery(query: LocationQueryRaw): Promise<void>

  /**
   * Sets the hash of the current route without triggering a navigation. Can
   * be awaited to wait for Vue to render again.
   *
   * @param hash - hash to set in the current route
   */
  setHash(hash: string): Promise<void>

  /**
   * Clear all the mocks and reset the location of the router. This is useful to be called in a `beforeEach()` test hook
   * to reset the router state before each test.
   */
  reset(): void

  push: _InferSpyType<Router['push']>
  replace: _InferSpyType<Router['replace']>
  // FIXME: it doesn't seem to work for overloads
  // addRoute: _InferSpyType<Router['addRoute']>
  back: _InferSpyType<Router['back']>
}

/**
 * Options passed to `createRouterMock()`.
 */
export interface RouterMockOptions extends Partial<RouterOptions> {
  /**
   * Override the starting location before each test. Defaults to
   * START_LOCATION.
   */
  initialLocation?: RouteLocationRaw

  /**
   * Run in-component guards. Defaults to false. Setting this to `true` will also run global guards as if
   * `useRealNavigation` was set to `true`.
   */
  runInComponentGuards?: boolean

  /**
   * Runs all navigation through a `push()` or `replace()` to effectively run any global.
   */
  useRealNavigation?: boolean

  /**
   * Run per-route guards. Defaults to false.
   * @deprecated use `removePerRouteGuards` instead
   */
  runPerRouteGuards?: boolean
  /**
   * Removes `beforeEnter` guards to any route added. Defaults to `true`.
   */
  removePerRouteGuards?: boolean

  /**
   * By default the mock will allow you to push to locations without adding all
   * the necessary routes so you can still check if `router.push()` was called
   * in a specific scenario
   * (https://github.com/posva/vue-router-mock/issues/41). Set this to `true` to
   * disable that behavior and throw when `router.push()` fails.
   */
  noUndeclaredRoutes?: boolean

  /**
   * By default the mock will use sinon, jest, or vitest support to create and reset spies. This option allows to use
   * any testing library with its own spies, by providing a method to create spies, and one to reset them them. Check
   * the `RouterMockSpy` type to add your own type.
   *
   * @example
   *
   * For example, with vitest with `globals: false`:
   *
   * ```ts
   * const router = createRouterMock({
   *   spy: {
   *     create: fn => vi.fn(fn),
   *     reset: spy => spy.mockClear()
   *   }
   * });
   * ```
   */
  spy?: RouterMockSpyOptions
}

/**
 * Creates a router mock instance
 *
 * @param options - options to initialize the router
 */
export function createRouterMock(options: RouterMockOptions = {}): RouterMock {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/:pathMatch(.*)*',
        component: EmptyView,
      },
    ],
    ...options,
  })

  // add a default onError to avoid logging a warning
  router.onError(() => {})

  let {
    runPerRouteGuards,
    removePerRouteGuards,
    runInComponentGuards,
    useRealNavigation,
    noUndeclaredRoutes,
    spy,
  } = options
  const initialLocation = options.initialLocation || START_LOCATION

  const { push, addRoute, replace, back, beforeEach, beforeResolve } = router

  const [addRouteMock, addRouteMockClear] = createSpy(
    (
      parentRecordName: Required<RouteRecordRaw>['name'] | RouteRecordRaw,
      record?: RouteRecordRaw
    ) => {
      record = record || (parentRecordName as RouteRecordRaw)

      if (!runPerRouteGuards || removePerRouteGuards) {
        // remove existing records to force our own router.beforeEach and easier
        // way to mock navigation guard returns.
        delete record.beforeEnter
      }

      // @ts-ignore: this should be valid
      return addRoute(parentRecordName, record)
    },
    spy
  )

  const [pushMock, pushMockClear] = createSpy((to: RouteLocationRaw) => {
    return consumeNextReturn(to)
  }, spy)

  const [replaceMock, replaceMockClear] = createSpy((to: RouteLocationRaw) => {
    return consumeNextReturn(to, { replace: true })
  }, spy)

  const [backMock, backMockClear] = createSpy((to: RouteLocationRaw) => {
    return consumeNextReturn(to, { back: true })
  }, spy)

  router.push = pushMock
  router.replace = replaceMock
  router.addRoute = addRouteMock
  router.back = backMock

  let guardRemovers: Array<() => void> = []
  router.beforeEach = (...args) => {
    const removeGuard = beforeEach(...args)
    guardRemovers.push(removeGuard)
    return removeGuard
  }
  router.beforeResolve = (...args) => {
    const removeGuard = beforeResolve(...args)
    guardRemovers.push(removeGuard)
    return removeGuard
  }

  function reset() {
    pushMockClear()
    replaceMockClear()
    addRouteMockClear()
    backMockClear()

    guardRemovers.forEach((remove) => remove())
    guardRemovers = []

    nextReturn = undefined
    router.currentRoute.value =
      initialLocation === START_LOCATION
        ? START_LOCATION
        : router.resolve(initialLocation)
  }

  let nextReturn: Error | boolean | RouteLocationRaw | undefined = undefined

  function setNextGuardReturn(
    returnValue: Error | boolean | RouteLocationRaw | undefined
  ) {
    nextReturn = returnValue
  }

  function consumeNextReturn(
    to: RouteLocationRaw,
    options: { replace?: boolean; back?: boolean } = {}
  ) {
    if (nextReturn != null || runInComponentGuards || useRealNavigation) {
      const removeGuard = router.beforeEach(() => {
        const value = nextReturn
        removeGuard()
        nextReturn = undefined
        return value
      })

      // avoid existing navigation guards
      const record = router.currentRoute.value.matched[depth.value]
      if (record && !runInComponentGuards) {
        record.leaveGuards.clear()
        record.updateGuards.clear()
        Object.values(record.components || {}).forEach((component) => {
          // TODO: handle promises?
          // @ts-ignore
          delete component.beforeRouteUpdate
          // @ts-ignore
          delete component.beforeRouteLeave
        })
      }
      if (options.back) {
        pendingNavigation = back()
        pendingNavigation = undefined
      } else {
        pendingNavigation = (options.replace ? replace : push)(to)
        pendingNavigation
          .catch(() => {})
          .finally(() => {
            pendingNavigation = undefined
          })
      }
      return pendingNavigation
    }

    // we try to resolve the navigation
    // but catch the error to simplify testing and avoid having to declare
    // all the routes in the mock router
    try {
      // NOTE: should we trigger a push to reset the internal pending navigation of the router?
      router.currentRoute.value = router.resolve(to)
    } catch (error) {
      if (noUndeclaredRoutes) {
        throw error
      }
    }
    return Promise.resolve()
  }

  let pendingNavigation:
    | ReturnType<typeof push>
    | ReturnType<typeof back>
    | undefined
  function getPendingNavigation() {
    return pendingNavigation || Promise.resolve()
  }

  // for all these functions we set the whole currentRoute to mimic router
  // behavior: each navigation replaces the whole `currentRoute` object

  function setParams(params: RouteParamsRaw) {
    router.currentRoute.value = router.resolve({ params })
    return nextTick()
  }

  function setQuery(query: LocationQueryRaw) {
    router.currentRoute.value = router.resolve({ query })
    return nextTick()
  }

  function setHash(hash: string) {
    router.currentRoute.value = router.resolve({ hash })
    return nextTick()
  }

  const depth = ref(0)

  // sets the initial location
  reset()

  return {
    ...router,
    push: pushMock,
    replace: replaceMock,
    addRoute: addRouteMock,
    back: backMock,
    depth,
    setNextGuardReturn,
    getPendingNavigation,
    setParams,
    setQuery,
    setHash,
    reset,
  }
}
