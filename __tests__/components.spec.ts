import { mount } from '@vue/test-utils'
import { addGlobalInjections, createMockedRouter } from '../src'

describe('components', () => {
  beforeAll(() => {
    const router = createMockedRouter()
    addGlobalInjections(router)
  })

  it('stubs router link', async () => {
    const wrapper = mount(
      {
        template: `<router-link>Hello</router-link>`,
      }
      // { global: { stubs: { RouterLink: true } } }
    )

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<router-link>Hello</router-link>"`
    )
  })
})
