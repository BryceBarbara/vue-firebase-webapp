import type { I18n } from 'vue-i18n'
import { createI18n } from 'vue-i18n'

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//
// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
const fileNameRE = /(?:\/|^)(?<name>\w+)(?<ext>\.\w+)?$/
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('./../locales/*.y(a)?ml', { eager: true }))
    .map(([path, value]) => {
      const name = path.match(fileNameRE)?.groups?.name
      return [name, value.default]
      // return [name, {}]
    }),
)

const storageLocale = useLocalStorage('locale', 'en')

export const i18n = createI18n({
  legacy: false,
  locale: storageLocale.value,
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    de: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },
  messages,
}) as
// Hardcoding type to avoid recursive type error: https://github.com/microsoft/TypeScript/issues/34933
I18n<{}, {}, {}, '', false>

watch(i18n.global.locale, (val) => {
  storageLocale.value = val
})
