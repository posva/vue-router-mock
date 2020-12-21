import { mount } from '@vue/test-utils'
import { createRouterMock, injectRouterMock } from '../src'
import Test from './fixtures/Test'

describe('Route location', () => {
  beforeAll(() => {
    injectRouterMock()
  })

  it('creates router properties', async () => {
    const wrapper = mount(Test)

    expect(wrapper.vm.$router).toBeDefined()
    expect(wrapper.vm.$route).toBeDefined()
  })

  it('can change the current location when pushing', async () => {
    const wrapper = mount(Test)

    wrapper.vm.$router.push('/hi?q=query#hash')
    wrapper.vm.$router

    expect(wrapper.vm.$route).toMatchObject({
      path: '/hi',
      query: { q: 'query' },
      hash: '#hash',
    })
  })

  describe('different initialLocation', () => {
    const router = createRouterMock({
      initialLocation: '/foo#bar',
    })

    beforeEach(async () => {
      injectRouterMock(router)
    })

    it('initializes the route to the initialLocation', async () => {
      const wrapper = mount(Test)

      expect(wrapper.vm.$route.path).toBe('/foo')
      expect(wrapper.vm.$route.hash).toBe('#bar')
    })
  })
})
