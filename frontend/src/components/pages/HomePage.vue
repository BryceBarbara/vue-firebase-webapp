<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const user = useUserStore()

const { authUser } = storeToRefs(user)
</script>

<template>
  <div p-4>
    <NCard :title="t('pages.home-page.welcome', { name: authUser?.displayName })">
      {{ t('pages.home-page.main-description') }}
    </NCard>
  </div>
</template>
