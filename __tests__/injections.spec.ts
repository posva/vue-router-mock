import { mount } from '@vue/test-utils'
import { useRoute, useRouter } from 'vue-router'
import { injectRouterMock, createRouterMock } from '../src'

describe('Injections', () => {
  const router = createRouterMock()
  beforeAll(() => {
    injectRouterMock(router)
  })

  it('injects the router instance', async () => {
    mount({
      render: () => null,
      setup() {
        const r = useRouter()
        expect(r).toBe(router)
      },
    })
  })

  it('injects the current route', async () => {
    const wrapper = mount({
      render: () => null,
      setup() {
        const r = useRoute()
        return { r }
      },
    })

    expect(wrapper.vm.r).toMatchObject({ fullPath: '/' })

    await router.push('/bar')
    expect(wrapper.vm.r).toMatchObject({ fullPath: '/bar' })
  })
})
