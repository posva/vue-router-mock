import { mount } from '@vue/test-utils'
import { useRoute, useRouter } from 'vue-router'
import { getRouter } from '../src'
import { describe, it, expect } from 'vitest'

describe('Injections', () => {
  it('injects the router instance', async () => {
    const router = getRouter()
    const wrapper = mount({
      render: () => null,
      setup() {
        const r = useRouter()
        expect(r).toBe(router)
      },
    })

    expect(wrapper.vm.$router).toBe(router)
  })

  it('sets the wrapper router property', () => {
    const wrapper = mount({ render: () => null })
    const router = getRouter()
    expect(wrapper.router).toBe(router)
  })

  it('injects the current route', async () => {
    const wrapper = mount({
      render: () => null,
      setup() {
        const r = useRoute()
        return { r }
      },
    })
    const router = getRouter()

    expect(wrapper.vm.$route).toBe(wrapper.vm.r)
    expect(wrapper.vm.r).toMatchObject({ fullPath: '/' })

    await router.push('/bar')
    expect(wrapper.vm.r).toMatchObject({ fullPath: '/bar' })
  })
})
