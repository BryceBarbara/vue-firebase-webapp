<script setup lang="tsx">
import type { DropdownOption } from 'naive-ui'
import type { FunctionalComponent } from 'vue'
import EnFlag from '~icons/flag/gb-4x3'
import DeFlag from '~icons/flag/de-4x3'

const emit = defineEmits<{
  (e: 'change', locale: string): void
}>()

const flagMap: Record<string, FunctionalComponent> = {
  en: EnFlag,
  de: DeFlag,
}

const attrs = useAttrs()
const { t, availableLocales, locale } = useI18n()

const localeOptions = computed<DropdownOption[]>(() => {
  return availableLocales.map<DropdownOption>((l) => {
    const flag = flagMap[l.toLowerCase()]
    return {
      label: t(`locale.${l}`, {}, {
        locale: 'en',
      }),
      key: l,
      icon: flag ? () => h(flag) : undefined,
      disabled: l === locale.value,
    }
  })
})
function onSelectLocale(value: string) {
  if (!availableLocales.includes(value)) {
    console.error(`Locale ${value} is not available`)
    return
  }
  locale.value = value
  emit('change', value)
}
</script>

<template>
  <n-dropdown
    trigger="hover"
    :options="localeOptions"
    @select="onSelectLocale"
  >
    <n-button v-bind="attrs" :title="t('button.change-locale')" data-test="trigger">
      <template #icon>
        <i-carbon-language />
      </template>
    </n-button>
  </n-dropdown>
</template>

<style scoped>

</style>
