import { defineComponent, h, inject } from 'vue'
import { routeLocationKey, useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Test',

  setup() {
    const foo = inject('foo')!
    const route = useRoute()
    const router = useRouter()

    return { route, router, foo }
  },

  render() {
    return h('p', this.route.fullPath)
    // return h('p', this.$r.fullPath)
  },
})
