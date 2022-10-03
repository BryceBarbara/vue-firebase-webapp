<script setup lang="ts">
const { t } = useI18n()
useHead({
  title: computed(() => t('pages.home-page.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('pages.home-page.page-description')),
    },
  ],
})
</script>

<template>
  <HomePage />
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
