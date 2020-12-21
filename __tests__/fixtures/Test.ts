import { defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Test',
  props: {
    leaveGuard: Function,
    updateGuard: Function,
  },

  setup() {
    const route = useRoute()
    const router = useRouter()

    return { route, router }
  },

  render() {
    return h('p', this.$route.fullPath)
    // return h('p', this.$r.fullPath)
  },
})
