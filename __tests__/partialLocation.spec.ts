import { mount } from '@vue/test-utils'
import { watch } from 'vue'
import { getRouter } from '../src'
import { describe, it, expect, vi } from 'vitest'

describe('partial location', () => {
  describe('setParams', () => {
    it('sets current route params', async () => {
      const router = getRouter()
      router.setParams({ userId: 12 })
      const wrapper = mount({
        template: `<p>{{ $route.params.userId }}</p>`,
      })
      const spy = vi.fn()

      watch(() => wrapper.vm.$route.params, spy)

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

  describe('setQuery', () => {
    it('sets current route query', async () => {
      const router = getRouter()
      router.setQuery({ page: 2 })
      const wrapper = mount({
        template: `<p>{{ $route.query.page }}</p>`,
      })
      const spy = vi.fn()

      watch(() => wrapper.vm.$route.query, spy)

      expect(wrapper.vm.$route.query).toEqual({ page: '2' })
      expect(wrapper.text()).toBe('2')
      expect(spy).toHaveBeenCalledTimes(0)

      await router.setQuery({ page: 2 })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(wrapper.text()).toBe('2')

      await router.setQuery({ page: 3 })
      expect(spy).toHaveBeenCalledTimes(2)
      expect(wrapper.text()).toBe('3')
    })
  })

  describe('setHash', () => {
    it('sets current route hash', async () => {
      const router = getRouter()
      router.setHash('#more')
      const wrapper = mount({
        template: `<p>{{ $route.hash }}</p>`,
      })
      const spy = vi.fn()

      watch(() => wrapper.vm.$route.hash, spy)

      expect(wrapper.vm.$route.hash).toEqual('#more')
      expect(wrapper.text()).toBe('#more')
      expect(spy).toHaveBeenCalledTimes(0)

      await router.setHash('#other')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(wrapper.text()).toBe('#other')

      await router.setHash('#about')
      expect(spy).toHaveBeenCalledTimes(2)
      expect(wrapper.text()).toBe('#about')
    })
  })
})
