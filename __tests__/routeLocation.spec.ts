import { mount } from '@vue/test-utils'
import { START_LOCATION } from 'vue-router'
import { addGlobalInjections, createMockedRouter } from '../src'
import Test from './fixtures/Test'

describe('Route location', () => {
  beforeAll(() => {
    const router = createMockedRouter()
    addGlobalInjections(router)
  })

  it('creates router properties', async () => {
    const wrapper = mount(Test)

    expect(wrapper.vm.$router).toBeDefined()
    expect(wrapper.vm.$route).toBeDefined()
  })

  it('initializes the route to START_LOCATION', async () => {
    const wrapper = mount(Test)

    expect(wrapper.vm.$route).toEqual(START_LOCATION)
  })

  it('can change the current location when pushing', async () => {
    const wrapper = mount(Test)

    wrapper.vm.$router.push('/hi?q=query#hash')

    expect(wrapper.vm.$route).toMatchObject({
      path: '/hi',
      query: { q: 'query' },
      hash: '#hash',
    })
  })
})
