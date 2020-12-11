import { mount } from '@vue/test-utils'
import { NavigationFailureType } from 'vue-router'
import { injectRouterMock, createRouterMock } from '../src'
import Test from './fixtures/Test'

describe('Navigations', () => {
  const router = createRouterMock()
  beforeAll(() => {
    injectRouterMock(router)
  })

  it('can check calls on push', async () => {
    const wrapper = mount(Test)

    wrapper.vm.$router.push('/hey')
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/hey')
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  })

  it('can check calls on replace', async () => {
    const wrapper = mount(Test)

    wrapper.vm.$router.replace('/hey')
    expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/hey')
    expect(wrapper.vm.$router.replace).toHaveBeenCalledTimes(1)
  })

  it('reset calls between tests', async () => {
    const wrapper = mount(Test)
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(0)
  })

  it('rejects next navigation with an error', async () => {
    const wrapper = mount(Test)
    const error = new Error('fail')
    router.setNextGuardReturn(error)
    await expect(wrapper.vm.$router.push('/foo')).rejects.toBe(error)
  })

  it('can abort the next navigation', async () => {
    const wrapper = mount(Test)
    router.setNextGuardReturn(false)
    await expect(wrapper.vm.$router.push('/foo')).resolves.toMatchObject({
      type: NavigationFailureType.aborted,
    })
  })

  it('can redirect the next navigation', async () => {
    const wrapper = mount(Test)
    router.setNextGuardReturn('/bar')
    await expect(wrapper.vm.$router.push('/foo')).resolves.toBe(undefined)
    expect(wrapper.text()).toBe('/bar')
  })

  it.skip('can wait for an ongoing navigation', async () => {
    const wrapper = mount(Test)

    // to force async navigation
    router.setNextGuardReturn('/bar')
    wrapper.vm.$router.push('/foo')
    await expect(router.getPendingNavigation()).resolves.toBe(undefined)
    expect(wrapper.text()).toBe('/bar')
  })
})
