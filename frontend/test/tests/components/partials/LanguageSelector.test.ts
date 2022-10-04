import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import type { I18n } from 'vue-i18n'
import LanguageSelector from '../../../../src/components/partials/LanguageSelector.vue'

enableAutoUnmount(afterEach)

const TriggerSelector = '[data-test=trigger]'

let i18n: I18n
let t = (key: string) => key

beforeAll(async () => {
  const result = await import('../../../scripts/vue-i18n.setup')
  i18n = result.i18n
  t = i18n.global.t
})

async function sleep(ms: number): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('LanguageSelector.vue', () => {
  it('should render', () => {
    const wrapper = mount(LanguageSelector)
    // Ensure there is a trigger element
    expect(wrapper.get(TriggerSelector)).toBeTruthy()
    // Ensure the trigger element has a title
    expect(wrapper.get(TriggerSelector).attributes('title')).toBe(t('button.change-locale'))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render when expanded', async () => {
    const wrapper = mount(LanguageSelector, { attachTo: document.body })
    await wrapper.get(TriggerSelector).trigger('mouseenter')
    // Wait for the dropdown to appear
    await sleep(200)
    // Snapshot the body since the dropdown is appended to the body
    expect(document.body.innerHTML).toMatchSnapshot()
  })

  it('should be interactive', async () => {
    const wrapper = await mount(LanguageSelector, { attachTo: document.body })
    const optionBodySelector = '.n-dropdown-option-body'

    const triggerNode = wrapper.find(TriggerSelector)
    expect(triggerNode.exists()).toBe(true)

    const getOptions = () => Array.from(document.querySelectorAll(optionBodySelector))
    const isDisabledOption = (option: Element) => option.classList.contains('n-dropdown-option-body--disabled')
    const getOptionText = (option: Element) => option.querySelector('.n-dropdown-option-body__label')?.textContent
    const openDropdown = async () => {
      if (getOptions().length)
        await triggerNode.trigger('mouseleave')

      await triggerNode.trigger('mouseenter')
      // Wait for the dropdown to appear
      await sleep(200)
    }

    await openDropdown()
    const options = getOptions()
    expect(options.length).toBe(i18n.global.availableLocales.length)

    const enabledOption = options.find(option => !isDisabledOption(option))
    expect(enabledOption).toBeTruthy()
    if (enabledOption instanceof HTMLDivElement) {
      const localeToChangeTo = getOptionText(enabledOption)
      enabledOption.click()

      if (typeof i18n.global.locale !== 'string')
        // Hack to mark the computed property as dirty to force a re-evaluation
        // @ts-expect-error _dirty isn't defined
        i18n.global.locale._dirty = true

      await nextTick()
      expect(wrapper.emitted('change')?.length).toBe(1)
      await openDropdown()
      const updatedOption = getOptions().find(option => getOptionText(option) === localeToChangeTo)
      expect(updatedOption && isDisabledOption(updatedOption)).toBeTruthy()
    }
    else {
      throw new TypeError('enabledOption is not a HTMLDivElement')
    }
  })
})
