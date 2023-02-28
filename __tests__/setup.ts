import {
  VueRouterMock,
  createRouterMock as _createRouterMock,
  injectRouterMock,
  RouterMockOptions,
} from '../src'
import { config } from '@vue/test-utils'
import { beforeEach, vi, SpyInstance } from 'vitest'

export function createRouterMock(options?: RouterMockOptions) {
  return _createRouterMock({
    ...options,
    spy: {
      create: (fn) => vi.fn(fn),
      reset: (spy: SpyInstance) => spy.mockClear(),
      ...options?.spy,
    },
  })
}

export function setupRouterMock() {
  const router = createRouterMock()

  beforeEach(() => {
    router.reset()
    injectRouterMock(router)
  })

  config.plugins.VueWrapper.install(VueRouterMock)
}

setupRouterMock()
