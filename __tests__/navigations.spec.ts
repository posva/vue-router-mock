import { mount } from '@vue/test-utils'
import { addGlobalInjections, createMockedRouter } from '../src'
import Test from './fixtures/Test'

describe('Navigations', () => {
  beforeAll(() => {
    const router = createMockedRouter()
    addGlobalInjections(router)
  })

  it('can check calls', async () => {
    const wrapper = mount(Test)

    wrapper.vm.$router.push('/hey')
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/hey')
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)
  })

  it('reset calls between tests', async () => {
    const wrapper = mount(Test)
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(0)
  })
})
