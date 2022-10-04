import { config } from '@vue/test-utils'
import { createI18nInstance } from '../../src/i18n'

export const i18n = createI18nInstance('en')

if (!config.global.plugins)
  config.global.plugins = []

config.global.plugins.push(i18n)
