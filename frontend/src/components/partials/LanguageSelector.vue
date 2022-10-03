<script setup lang="tsx">
import type { DropdownOption } from 'naive-ui'
import type { Component } from 'vue'
import EnFlag from '~icons/flag/gb-4x3'
import DeFlag from '~icons/flag/de-4x3'

const flagMap: Record<string, Component> = {
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
}
</script>

<template>
  <n-dropdown
    trigger="hover"
    :options="localeOptions"
    @select="onSelectLocale"
  >
    <n-button v-bind="attrs" :title="t('button.change-locale')">
      <template #icon>
        <i-carbon-language />
      </template>
    </n-button>
  </n-dropdown>
</template>

<style scoped>

</style>
