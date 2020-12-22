import { mount } from '@vue/test-utils'
import { NavigationFailureType } from 'vue-router'
import {
  injectRouterMock,
  createRouterMock,
  EmptyView,
  getRouter,
} from '../src'
import Test from './fixtures/Test'

describe('Navigations', () => {
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
    const router = getRouter()
    const error = new Error('fail')
    router.setNextGuardReturn(error)
    await expect(wrapper.vm.$router.push('/foo')).rejects.toBe(error)
  })

  it('can abort the next navigation', async () => {
    const wrapper = mount(Test)
    const router = getRouter()
    router.setNextGuardReturn(false)
    await expect(wrapper.vm.$router.push('/foo')).resolves.toMatchObject({
      type: NavigationFailureType.aborted,
    })
  })

  describe('per-router guards', () => {
    it('ignored by default', async () => {
      const beforeEnter = jest.fn()
      const router = createRouterMock()
      injectRouterMock(router)
      router.addRoute({ path: '/foo', beforeEnter, component: EmptyView })

      mount(Test)
      await router.push('/foo')
      expect(beforeEnter).not.toHaveBeenCalled()
    })

    it('ignore them with other setNextGuardReturn', async () => {
      const beforeEnter = jest.fn()
      const router = createRouterMock()
      injectRouterMock(router)
      router.addRoute({ path: '/foo', beforeEnter, component: EmptyView })

      mount(Test)
      router.setNextGuardReturn(true)
      await router.push('/foo')
      expect(beforeEnter).not.toHaveBeenCalled()
    })
  })

  describe('in-component guards', () => {
    async function factory(
      options: Parameters<typeof createRouterMock>[0] = {}
    ) {
      const leaveGuard = jest.fn()
      const updateGuard = jest.fn()
      const beforeRouteEnter = jest.fn()
      const beforeRouteUpdate = jest.fn()
      const beforeRouteLeave = jest.fn()

      const RouteComponent = {
        ...Test,
        beforeRouteEnter,
        beforeRouteUpdate,
        beforeRouteLeave,
      }
      const router = createRouterMock(options)
      injectRouterMock(router)
      router.addRoute({ path: '/test', component: RouteComponent })
      await router.push('/test')

      const wrapper = mount(RouteComponent, {
        props: { leaveGuard, updateGuard },
      })

      return {
        router,
        wrapper,
        leaveGuard,
        updateGuard,
        beforeRouteEnter,
        beforeRouteUpdate,
        beforeRouteLeave,
      }
    }

    it('ignores guards by default with no guard', async () => {
      const {
        router,
        leaveGuard,
        updateGuard,
        beforeRouteEnter,
        beforeRouteUpdate,
        beforeRouteLeave,
      } = await factory()

      await router.push('/test#two')
      expect(beforeRouteEnter).not.toHaveBeenCalled()
      expect(updateGuard).not.toHaveBeenCalled()
      expect(beforeRouteUpdate).not.toHaveBeenCalled()

      await router.push('/foo')
      expect(leaveGuard).not.toHaveBeenCalled()
      expect(beforeRouteLeave).not.toHaveBeenCalled()
    })

    it('ignores guards by default with a guard', async () => {
      const {
        router,
        leaveGuard,
        updateGuard,
        beforeRouteEnter,
        beforeRouteUpdate,
        beforeRouteLeave,
      } = await factory()

      router.setNextGuardReturn(true)
      await router.push('/test#two')
      expect(beforeRouteEnter).not.toHaveBeenCalled()
      expect(updateGuard).not.toHaveBeenCalled()
      expect(beforeRouteUpdate).not.toHaveBeenCalled()

      router.setNextGuardReturn(true)
      await router.push('/foo')
      expect(leaveGuard).not.toHaveBeenCalled()
      expect(beforeRouteLeave).not.toHaveBeenCalled()
    })

    it('runs guards without a guard return set', async () => {
      const {
        router,
        wrapper,
        leaveGuard,
        updateGuard,
        beforeRouteEnter,
        beforeRouteUpdate,
        beforeRouteLeave,
      } = await factory({
        runInComponentGuards: true,
      })

      expect(beforeRouteEnter).toHaveBeenCalled()
      await router.push('/test#two')
      expect(updateGuard).toHaveBeenCalled()
      expect(beforeRouteUpdate).toHaveBeenCalled()
      expect(beforeRouteUpdate.mock.instances[0]).toBe(wrapper.vm)

      await router.push('/foo')
      expect(leaveGuard).toHaveBeenCalled()
      expect(beforeRouteLeave).toHaveBeenCalled()
      expect(beforeRouteLeave.mock.instances[0]).toBe(wrapper.vm)
    })

    it('runs guards with a guard', async () => {
      const { router, leaveGuard, updateGuard } = await factory({
        runInComponentGuards: true,
      })

      router.setNextGuardReturn(true)
      await router.push('/test#two')
      expect(updateGuard).toHaveBeenCalled()

      router.setNextGuardReturn(true)
      await router.push('/foo')
      expect(leaveGuard).toHaveBeenCalled()
    })
  })

  it('can redirect the next navigation', async () => {
    const wrapper = mount(Test)
    const router = getRouter()
    router.setNextGuardReturn('/bar')
    await expect(wrapper.vm.$router.push('/foo')).resolves.toBe(undefined)
    expect(wrapper.text()).toBe('/bar')
  })

  it.skip('can wait for an ongoing navigation', async () => {
    const wrapper = mount(Test)
    const router = getRouter()

    // to force async navigation
    router.setNextGuardReturn('/bar')
    wrapper.vm.$router.push('/foo')
    await expect(router.getPendingNavigation()).resolves.toBe(undefined)
    expect(wrapper.text()).toBe('/bar')
  })
})
