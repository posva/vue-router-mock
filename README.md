# vue-router-mock [![Build Status](https://badgen.net/circleci/github/posva/vue-router-mock/v2)](https://circleci.com/gh/posva/vue-router-mock) [![npm package](https://badgen.net/npm/v/vue-router-mock)](https://www.npmjs.com/package/vue-router-mock) [![coverage](https://badgen.net/codecov/c/github/posva/vue-router-mock/v2)](https://codecov.io/github/posva/vue-router-mock) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Easily mock routing interactions in your Vue 3 apps

**⚠️ This library intends to be a collaboration of people writing tests to create a better experience writing tests that involve the use of routing with Vue**

## Installation

```sh
yarn add vue-router-mock@2
# or
npm install vue-router-mock@2
```

## Requirements

This library

- jest
- vue test utils next
- vue 3 and vue router 4

## Goal

The goal of Vue Router Mock is to enable users to **unit and integration test** navigation scenarios. This means tests that are isolated enough to not be end to end tests (e.g. using [Cypress](https://www.cypress.io/)) or are edge cases (e.g. network failures). Because of this, some scenarios are more interesting as end to end tests, **using the real** vue router.

## Usage

Vue Router Mock exposes a few functions to be used individually and they are all documented through TS. But most of the time you want to globally inject the router mock in tests requiring the router to be present. This will give your tested component access to `$route` and `$router` and a few handy tools for unit testing behaviors.

Start by injecting the router _before_ your tests:

```js
describe('SearchUsers', () => {
  // create one mock instance
  const router = createRouterMock()
  beforeAll(() => {
    // inject it globally to ensure `useRoute()`, `$route`, etc work properly and give you access to test specific functions
    injectRouterMock(router)
  })

  it('should paginate', async () => {
    const wrapper = mount(SearchUsers)

    // router will have a few extra typings
    expect(wrapper.vm.$router).toBe(router)

    // go to the next page
    // this will internally trigger `router.push({ query: { page: 2 }})`
    wrapper.find('button.next-page').click()

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith(expect.objectContaining({ query: { page: 2 } }))
    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1)

    // if we had a navigation guard fetching the search results, waiting for it to be done
    // will allow us to
    await router.getPendingNavigation()
    // wait for the component to render again if we want to check
    await wrapper.vm.nextTick()

    expect(wrapper.find('#user-results '))

  })
```

If you need to create a specific version of the router for one single test (or a nested suite of them), you should call the same functions:

```js
it('should paginate', async () => {
  const router = createRouterMock()
  injectRouterMock(router)
  const wrapper = mount(SearchUsers)
})
```

Note that in this case, you will have to transform the initial `beforeAll` to `beforeEach`, so that injections are run with the correct router mock for other tests.

### Nested Routes

By default, the router mock comes with one single _catch all_ route. You can add routes calling the `router.addRoute()` function but **if you add nested routes and you are relying on running navigation guards**, you must manually set the _depth_ of the route you are displaying. This is because the router has no way to know which level of nesting you are trying to display. e.g. Imagine the following `routes`:

```js
const routes = [
  {
    path: '/users',
    // we are not testing this one so it doesn't matter
    component: UserView,
    children: [
      // UserDetail must be the same component we are unit testing
      { path: ':id', component: UserDetail },
    ],
  },
]
```

```js
// 0 would be if we were testing UserView at /users
router.depth.value = 1
const wrapper = mount(UserDetail)
```

Remember, this is not necessary if you are not adding routes or if they are not nested.

### Setting the initial location

By default the router mock starts on [`START_LOCATION`](https://next.router.vuejs.org/api/#start-location). In some scenarios this might need to be adjusted by pushing a new location and awaiting it before testing:

```js
it('should paginate', async () => {
  await router.push('/users?q=haruno')
  const wrapper = mount(SearchUsers)

  // test...
})
```

You can also set the initial location for all your tests by passing an `initialLocation`:

```js
const router = createRouterMock({
  initialLocation: '/users?q=jolyne',
})
```

`initialLocation` accepts anything that can be passed to `router.push()`.

### Simulating navigation failures

You can simulate the failure of the next navigation

### Simulating a navigation guard

By default, all navigation guards are ignored so that you can simulate the return of the next guard by using `setNextGuardReturn()`:

```js
// simulate a navigation guard that returns false
router.setNextGuardReturn(false)
// simulate a redirection
router.setNextGuardReturn('/login')
```

If you want to still run existing navigation guards inside component, you can active them when creating your router mock:

```js
const router = createRouterMock({
  // run `onBeforeRouteLeave()`, `onBeforeRouteUpdate()`, `beforeRouteEnter()`, `beforeRouteUpdate()`, and `beforeRouteLeave()`
  runInComponentGuards: true,
  // run `beforeEnter` of added routes. Note that you must manually add these routes with `router.addRoutes()`
  runPerRouteGuards: true,
})
```

### Stubs

By default, both `<router-link>` and `<router-view>` are stubbed but you can override them locally. This is specially useful when you have nested `<router-view>` and you rely on them for a test:

```js
const wrapper = mount(MyComponent, {
  global: {
    stubs: { RouterView: MyNestedComponent },
  },
})
```

You need to manually specify the component that is supposed to be displayed because the mock won't be able to know the level of nesting.

NOTE: this might change to become automatic if the necessary `routes` are provided.

## API

## Related

- [Jest](#a)
- [Vue Test Utils](#a)
- [Vue Router](#a)

## License

[MIT](http://opensource.org/licenses/MIT)

<div align="right">
<sub><em>
This project was created using the <a href="https://github.com/posva/vue-ts-lib" rel="nofollow">Vue Library template</a> by <a href="https://github.com/posva" rel="nofollow">posva</a>
</em></sub>
</div>
