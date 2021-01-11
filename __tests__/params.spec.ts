import { mount } from '@vue/test-utils'
import { watch } from 'vue'
import { getRouter } from '../src'

describe('setParams', () => {
  it('sets current route params', async () => {
    const router = getRouter()
    router.setParams({ userId: 12 })
    const wrapper = mount({
      template: `<p>{{ $route.params.userId }}</p>`,
    })
    const spy = jest.fn()

    watch(wrapper.vm.$route, spy)

    expect(wrapper.vm.$route.params).toEqual({ userId: '12' })
    expect(wrapper.text()).toBe('12')
    expect(spy).toHaveBeenCalledTimes(0)

    await router.setParams({ userId: 12 })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toBe('12')

    await router.setParams({ userId: 2 })
    expect(spy).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toBe('2')
  })
})
