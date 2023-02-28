import { getJestGlobal } from './testers/jest'
import { getSinonGlobal } from './testers/sinon'
import { getVitestGlobal } from './testers/vitest'

/**
 * Creates a spy on a function
 *
 * @param fn function to spy on
 * @returns [spy, mockClear]
 */
export function createSpy<Fn extends (...args: any[]) => any>(
  fn: Fn,
  spyFactory?: RouterMockSpyOptions
): [_InferSpyType<Fn>, () => void] {
  if (spyFactory) {
    const spy = spyFactory.create(fn)
    return [spy, () => spyFactory.reset(spy)]
  }

  const sinon = getSinonGlobal()
  if (sinon) {
    const spy = sinon.spy(fn)
    return [spy as unknown as _InferSpyType<Fn>, () => spy.resetHistory()]
  }

  const jest = getVitestGlobal() || getJestGlobal()
  if (jest) {
    const spy = jest.fn(fn)
    return [spy as unknown as _InferSpyType<Fn>, () => spy.mockClear()]
  }

  console.error(
    `Couldn't detect a global spy (tried jest and sinon). Make sure to provide a "spy.create" option when creating the router mock.`
  )
  throw new Error(
    'No Spy Available. See https://github.com/posva/vue-router-mock#testing-libraries'
  )
}

/**
 * Options passed to the `spy` option of the `createRouterMock` function
 */
export interface RouterMockSpyOptions {
  /**
   * Creates a spy (for example, `create: fn => vi.fn(fn)` with vitest)
   */
  create: (...args: any[]) => any

  /**
   * Resets a spy but keeps it active.
   */
  reset: (spy: _InferSpyType) => void
}

/**
 * Define your own Spy to adapt to your testing framework (jest, peeky, sinon, vitest, etc)
 * @beta: still trying out, could change in the future
 *
 * @example
 * ```ts
 * import 'vue-router-mock' // Only needed on external d.ts files
 *
 * declare module 'vue-router-mock' {
 *   export interface RouterMockSpy<Fn> {
 *     spy: Sinon.Spy<Parameters<Fn>, ReturnType<Fn>>
 *   }
 * }
 * ```
 */
export interface RouterMockSpy<
  Fn extends (...args: any[]) => any = (...args: any[]) => any
> {
  // cannot be added or it wouldn't be extensible
  // spy: any
}

/**
 * @internal
 */
export type _InferSpyType<
  Fn extends (...args: any[]) => any = (...args: any[]) => any
  // @ts-ignore: the version with Record<'spy', any> doesn't work...
> = RouterMockSpy<Fn> extends Record<'spy', unknown>
  ? RouterMockSpy<Fn>['spy']
  : Fn
// > = RouterMockSpy<Fn> extends Record<'spy', any> ? RouterMockSpy<Fn>['spy'] : Fn
