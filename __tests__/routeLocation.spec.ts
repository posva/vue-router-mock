import { mount } from '@vue/test-utils'
import { injectRouterMock } from '../src'
import Test from './fixtures/Test'
import { describe, it, expect, beforeEach } from 'vitest'
import { createRouterMock } from './setup'
import { useRoute } from 'vue-router'

describe('Route location', () => {
  it('creates router properties', async () => {
    const wrapper = mount(Test)

    expect(wrapper.vm.$router).toBeDefined()
    expect(wrapper.vm.$route).toBeDefined()
  })

  it('can change the current location when pushing', async () => {
    const wrapper = mount(Test)

    wrapper.router.push('/hi?q=query#hash')

    expect(wrapper.vm.$route).toMatchObject({
      path: '/hi',
      query: { q: 'query' },
      hash: '#hash',
    })
  })

  it('keeps $route reactive', async () => {
    const wrapper = mount({
      template: `<div>{{ $route.path }}</div>`,
    })

    expect(wrapper.text()).toBe('/')
    await wrapper.router.push('/foo')
    expect(wrapper.text()).toBe('/foo')
  })

  it('keeps useRoute() reactive', async () => {
    const wrapper = mount({
      setup() {
        return {
          route: useRoute(),
        }
      },
      template: `<div>{{ route.path }}</div>`,
    })

    expect(wrapper.text()).toBe('/')
    await wrapper.router.push('/foo')
    expect(wrapper.text()).toBe('/foo')
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
