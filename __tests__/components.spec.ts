import { mount } from '@vue/test-utils'
import { getRouter } from '../src'
import { useRouter } from 'vue-router'

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

  it('mounts component', async () => {
    const wrapper = mount({
      template: `<button @click="navigate()">Home</button>`,
      setup() {
        const router = useRouter()
        function navigate() {
          router.push('/')
        }

        return { navigate }
      },
    })

    await wrapper.get('button').trigger('click')

    const router = getRouter()
    expect(router.push).toHaveBeenCalledWith('/')
  })
})
