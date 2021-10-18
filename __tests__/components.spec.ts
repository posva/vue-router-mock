import { mount } from '@vue/test-utils'

describe('components', () => {
  it('stubs router link', async () => {
    const wrapper = mount(
      {
        template: `<router-link to="/">Hello</router-link>`,
      },
      { global: { stubs: { RouterLink: true } } }
    )

    expect(wrapper.html()).toMatch(/router-link-stub/)
  })

  it('can use real router-link', async () => {
    const wrapper = mount(
      {
        template: `<router-link to="/about">About</router-link>`,
      },
      { global: { stubs: { RouterLink: false } } }
    )

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<a href=\\"/about\\" class=\\"\\">About</a>"`
    )
  })
})
