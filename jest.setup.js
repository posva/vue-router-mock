const { routerMockPlugin } = require('./src')
const { config } = require('@vue/test-utils')

config.plugins.VueWrapper.install(routerMockPlugin)
