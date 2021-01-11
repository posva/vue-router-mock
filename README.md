# vue-router-mock [![Build Status](https://badgen.net/circleci/github/posva/vue-router-mock/v2)](https://circleci.com/gh/posva/vue-router-mock) [![npm package](https://badgen.net/npm/v/vue-router-mock)](https://www.npmjs.com/package/vue-router-mock) [![coverage](https://badgen.net/codecov/c/github/posva/vue-router-mock/v2)](https://codecov.io/github/posva/vue-router-mock) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Easily mock routing interactions in your Vue 3 apps

**⚠️ This library intends to be a collaboration of people writing tests to create a better experience writing tests that involve the use of routing with Vue.** Your feedback and experienced is welcomed in issues and discussions to give the API shape and create a library that eases unit testing components that deal with the router.

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

## Introduction

Vue Router Mock exposes a few functions to be used individually and they are all documented through TS. But most of the time you want to globally inject the router in a _setupFilesAfterEnv_ file. Create a `jest.setup.js` file at the root of your project (it can be named differently):

```js
const {
  VueRouterMock,
  createRouterMock,
  injectRouterMock,
} = require('vue-router-mock')
const { config } = require('@vue/test-utils')

// create one router per test file
const router = createRouterMock()
beforeEach(() => {
  injectRouterMock(router)
})

// Add properties to the wrapper
config.plugins.VueWrapper.install(VueRouterMock)
```

Then add this line to your `jest.config.js`:

```js
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
```

This will inject a router in all your tests. If for specific tests, you need to inject a different version of the router, you can do so:

```js
describe('SearchUsers', () => {
  // create one mock instance, pass options
  const router = createRouterMock({
    // ...
  })
  beforeEach(() => {
    // inject it globally to ensure `useRoute()`, `$route`, etc work
    // properly and give you access to test specific functions
    injectRouterMock(router)
  })

  it('should paginate', async () => {
    const wrapper = mount(SearchUsers)

    expect(wrapper.router).toBe(router)

    // go to the next page
    // this will internally trigger `router.push({ query: { page: 2 }})`
    wrapper.find('button.next-page').click()

    expect(wrapper.router.push).toHaveBeenCalledWith(expect.objectContaining({ query: { page: 2 } }))
    expect(wrapper.router.push).toHaveBeenCalledTimes(1)

    // if we had a navigation guard fetching the search results,
    // waiting for it to be done will allow us to wait until it's done.
    // Note you need to mock the fetch and to activate navigation
    // guards as explained below
    await router.getPendingNavigation()
    // wait for the component to render again if we want to check
    await wrapper.vm.nextTick()

    expect(wrapper.find('#user-results .user').text()).toMatchSnapshot()

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

## Guide

## Accessing the Router Mock instance

You can access the instance of the router mock in multiple ways:

- Access `wrapper.router`:

  ```js
  it('tests something', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.router.push('/new-location')
  })
  ```

- Access it through `wrapper.vm`:

  ```js
  it('tests something', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.vm.$router.push('/new-location')
    expect(wrapper.vm.$route.name).toBe('NewLocation')
  })
  ```

- Call `getRouter()` inside of a test:

  ```js
  it('tests something', async () => {
    // can be called before creating the wrapper
    const router = getRouter()
    const wrapper = mount(MyComponent)
    await router.push('/new-location')
  })
  ```

### Setting parameters

`setParams` allows you to set some initial parameters on the route before mounting your component:

```js
it('should display the user details', async () => {
  getRouter().setParams({ userId: 12 })
  const wrapper = mount(UserDetails)

  // test...
})
```

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

By default, **all navigation guards are ignored** so that you can simulate the return of the next guard by using `setNextGuardReturn()` without depending on existing ones:

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

## Caveats

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

## Related

- [Jest](https://jestjs.io/)
- [Vue Test Utils](https://github.com/vuejs/vue-test-utils-next)
- [Vue Router](https://github.com/vuejs/vue-router-next)
- [Vuex Mock Store](https://github.com/posva/vuex-mock-store) - A Vuex 3.x mock

## License

[MIT](http://opensource.org/licenses/MIT)

<div align="right">
<sub><em>
This project was created using the <a href="https://github.com/posva/vue-ts-lib" rel="nofollow">Vue Library template</a> by <a href="https://github.com/posva" rel="nofollow">posva</a>
</em></sub>
</div>
