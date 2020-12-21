import { defineComponent, getCurrentInstance, h, PropType } from 'vue'
import {
  NavigationGuard,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from 'vue-router'

export default defineComponent({
  name: 'Test',
  props: {
    leaveGuard: Function as PropType<NavigationGuard>,
    updateGuard: Function as PropType<NavigationGuard>,
  },

  setup(props) {
    const route = useRoute()
    const router = useRouter()

    if (props.leaveGuard) {
      onBeforeRouteLeave(props.leaveGuard)
    }
    if (props.updateGuard) {
      onBeforeRouteUpdate(props.updateGuard)
    }

    return { route, router }
  },

  render() {
    return h('p', this.$route.fullPath)
    // return h('p', this.$r.fullPath)
  },
})
