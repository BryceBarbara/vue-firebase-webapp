<script lang="tsx" setup>
import type { MenuOption } from 'naive-ui'
import type { Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'
import PagesIcon from '~icons/carbon/document'
import AboutPageIcon from '~icons/carbon/information'
import HomePageIcon from '~icons/carbon/home'
import ApiTestPageIcon from '~icons/carbon/result'

const { t } = useI18n()

function menuLabel(func: () => string) {
  const blah = () => (<span>{func()}</span>)
  return blah
}

const selectedMenu = ref('')
const menuOptions = ref<MenuOption[]>([
  {
    label: menuLabel(() => t('sidebar.items.pages')),
    key: 'pages',
    icon: () => h(PagesIcon),
    children: [
      {
        label: menuLabel(() => t('pages.home-page.title')),
        key: 'home-page',
        to: '/',
        icon: () => h(HomePageIcon),
      },
      {
        label: menuLabel(() => t('pages.api-test.title')),
        key: 'api-test',
        to: '/api-test',
        icon: () => h(ApiTestPageIcon),
      },
    ],
  },
  {
    label: menuLabel(() => t('pages.about.title')),
    key: 'about',
    to: '/about',
    icon: () => h(AboutPageIcon),
  },
]) as Ref<MenuOption[]>

function renderMenuLabel(option: MenuOption) {
  const label = typeof option.label === 'function' ? option.label() : option.label
  if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, [
      label,
    ])
  }
  if ('to' in option) {
    return h(RouterLink, { to: option.to as RouteLocationRaw }, {
      default: () => label,
    })
  }

  return label
}

const route = useRoute()
watch(route, (val) => {
  const matchingMenuItem = findMatchingMenuToRoute(val.path)
  if (matchingMenuItem)
    selectedMenu.value = matchingMenuItem.key as string
}, { immediate: true })

function findMatchingMenuToRoute(routePath: string): MenuOption | null {
  if (!routePath)
    return null
  function searchChildren(item: MenuOption): MenuOption | null {
    if ('children' in item) {
      for (const child of (item.children as MenuOption[])) {
        const result = searchChildren(child)
        if (result)
          return result
      }
    }
    if ('to' in item) {
      if (item.to === routePath)
        return item
    }
    return null
  }
  for (const item of menuOptions.value) {
    const result = searchChildren(item)
    if (result)
      return result
  }
  return null
}
</script>

<template>
  <n-menu
    v-model:value="selectedMenu"
    :collapsed="sidebarCollapsed"
    :collapsed-width="sidebarCollapsedWidth"
    :options="menuOptions"
    :render-label="renderMenuLabel"
    data-test="sidebar"
  />
</template>
