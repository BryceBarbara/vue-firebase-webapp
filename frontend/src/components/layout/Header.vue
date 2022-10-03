<script lang="ts" setup>
import DarkIcon from '~icons/carbon/sun'
import LightIcon from '~icons/carbon/moon'

const props = defineProps<{
  hasSidebar?: boolean
}>()

const { t, availableLocales } = useI18n()
const { signOut } = useUserStore()

const themeIcon = computed(() => isDark.value ? LightIcon : DarkIcon)
const showLanguageSelector = computed(() => availableLocales.length > 1)
</script>

<template>
  <div flex p-1 gap-1>
    <NButton
      v-if="props.hasSidebar"
      quaternary
      :title="t('button.toggle-sidebar')"
      class="sidebar-toggle"
      :class="{ flipped: sidebarCollapsed }"
      @click="() => toggleSidebar()"
    >
      <i-carbon-chevron-left class="icon" />
    </NButton>
    <div grow />
    <LanguageSelector v-if="showLanguageSelector" quaternary />
    <NButton quaternary :title="t('button.toggle-theme')" @click="() => toggleDark()">
      <template #icon>
        <component :is="themeIcon" />
      </template>
    </NButton>
    <NButton quaternary :title="t('button.sign-out-title')" @click="signOut">
      {{ t('button.sign-out') }}
    </NButton>
  </div>
</template>

<style lang="scss">
.sidebar-toggle {
  .icon {
    transition: transform 0.3s ease-in-out;
  }
  &.flipped {
    .icon {
      transform: rotate(180deg);
    }
  }
}
</style>
