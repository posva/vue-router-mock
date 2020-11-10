import { createRouter, createWebHashHistory } from 'vue-router'
import { config, VueWrapper } from '@vue/test-utils'

export function routerMockPlugin(wrapper: VueWrapper<any>) {
  const router = createMockedRouter()

  // TODO: remove in next test utils release
  config.global.plugins = config.global.plugins || []
  config.global.plugins.push(router)
  console.log('hey')
  // config.global.provide![routerKey as any] = router
  // config.global.provide![routeLocationKey as any] =

  return {}
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

  router.push = jest.fn((to) => {
    router.currentRoute.value = router.resolve(to)
    // resolve pending navigation failure
    return Promise.resolve()
  })

  // TODO: replace

  return router
}
