import { mount } from '@vue/test-utils'
import { addGlobalInjections, createMockedRouter } from '../src'
import Test from './fixtures/Test'

describe('Navigations', () => {
  const router = createMockedRouter()
  beforeAll(() => {
    addGlobalInjections(router)
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
    router.failNextNavigation(error)
    await expect(wrapper.vm.$router.push('/foo')).rejects.toBe(error)
  })

  it('can abort the next navigation', async () => {
    const wrapper = mount(Test)
    const error = new Error('fail')
    router.failNextNavigation(error)
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(0)
  })
})
