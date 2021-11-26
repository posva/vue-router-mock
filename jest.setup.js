const { VueRouterMock, createRouterMock, injectRouterMock } = require('./src')
const { config } = require('@vue/test-utils')

const router = createRouterMock()

beforeEach(() => {
  router.reset()
  injectRouterMock(router)
})

config.plugins.VueWrapper.install(VueRouterMock)
