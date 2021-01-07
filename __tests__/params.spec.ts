import { mount } from '@vue/test-utils'
import { getRouter } from '../src'
import Test from './fixtures/Test'

describe('setParams', () => {
  it('sets current route params', () => {
    getRouter().setParams({ userId: 12 })
    const wrapper = mount(Test)

    expect(wrapper.vm.$route.params.userId).toBe('12')
  })
})
