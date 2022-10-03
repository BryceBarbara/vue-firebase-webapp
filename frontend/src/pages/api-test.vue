<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: computed(() => t('pages.api-test.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('pages.api-test.page-description')),
    },
  ],
})
</script>

<template>
  <ApiTestPage />
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
