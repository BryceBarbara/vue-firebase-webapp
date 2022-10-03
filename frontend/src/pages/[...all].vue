<script setup lang="ts">
const { t } = useI18n()

const router = useRouter()
function goHome() {
  router.push('/')
}
</script>

<template>
  <div>
    <n-result
      status="404"
      :title="t('not-found.title')"
      :description="t('not-found.description')"
    >
      <template #footer>
        <n-button @click="goHome">
          {{ t('not-found.go-home') }}
        </n-button>
      </template>
    </n-result>
  </div>
</template>

<route lang="yaml">
meta:
  layout: 404
</route>
