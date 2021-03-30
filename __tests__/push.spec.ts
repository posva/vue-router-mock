import { getRouter, createRouterMock } from '../src'

describe('router.push mock', () => {
  it('still calls push for non valid routes', async () => {
    const router = getRouter()
    // this is not defined
    await expect(router.push({ name: 'one' })).resolves.toBe(undefined)
  })

  it('can start with invalid route', async () => {
    const router = getRouter()
    // this is not defined
    await expect(router.push({ name: 'one' })).resolves.toBe(undefined)
  })

  it('can be configured to throw on invalid routes', async () => {
    const router = createRouterMock({ noUndeclaredRoutes: true })
    // this is not defined
    expect(() => router.push({ name: 'one' })).toThrowError('No match')
  })
})
