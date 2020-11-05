import { defineComponent, PropType, h } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
export { routeLocationKey, routerKey } from 'vue-router'

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

export const Component = defineComponent({
  props: {
    custom: Boolean as PropType<boolean>,
    data: {
      required: true,
      type: Object as PropType<{ title: string; summary: string }>,
    },
  },

  setup(props) {
    return () =>
      h(
        'p',
        `Custom: ${props.custom}. ${props.data.title} - ${props.data.summary}.`
      )
  },
})
