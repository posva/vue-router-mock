import { RouteLocationNormalizedLoaded } from 'vue-router'
import { computed, ComputedRef, reactive, Ref } from 'vue'

/**
 * Wraps a `router.currentRoute` properties using `reactive` and computed
 * properties to mimic `useRoute()` from vue-router.
 *
 * @param route router.currentRoute to wrap
 */
export function createReactiveRouteLocation(
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
