# vue-router-mock [![Build Status](https://badgen.net/circleci/github/posva/vue-router-mock/v2)](https://circleci.com/gh/posva/vue-router-mock) [![npm package](https://badgen.net/npm/v/vue-router-mock)](https://www.npmjs.com/package/vue-router-mock) [![coverage](https://badgen.net/codecov/c/github/posva/vue-router-mock/v2)](https://codecov.io/github/posva/vue-router-mock) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Easily mock routing interactions in your Vue 3 apps

## Installation

```sh
yarn add vue-router-mock@next
# or
npm install vue-router-mock@next
```

## Usage

### Stubs

By default, both `<router-link>` and `<router-view>` are stubbed but you can override them locally. This is specially useful when you have nested `<router-view>` and you rely on them for a test:

```js
const wrapper = mount(MyComponent, {
  global: {
    stubs: { RouterView: MyNestedComponent },
  },
})
```

## API

## Related

## License

[MIT](http://opensource.org/licenses/MIT)

<div align="right">
<sub><em>
This project was created using the <a href="https://github.com/posva/vue-ts-lib" rel="nofollow">Vue Library template</a> by <a href="https://github.com/posva" rel="nofollow">posva</a>
</em></sub>
</div>
