import { config, mount } from '@vue/test-utils'
import { routeLocationKey, routerKey } from 'vue-router'
import Test from './fixtures/Test'

describe('Route location', () => {
  const routerMock = {
    push: jest.fn(),
  }
  const routeMock = {
    fullPath: 'fullPath',
  }

  beforeAll(() => {
    config.global.provide = config.global.provide || {}
    // config.global.provide = { foo: 'foo' }
    // shouldn't this be always present for convenience?
    // record string is not enough
    // config.global.provide[routerKey as any] = routerMock
    // config.global.provide[routeLocationKey as any] = routeMock

    // config.global.mocks.
  })

  it('creates router properties', async () => {
    const wrapper = mount(Test)

    expect(wrapper.vm.$router).toBeDefined()
    expect(wrapper.vm.$route).toBeDefined()
  })
})
