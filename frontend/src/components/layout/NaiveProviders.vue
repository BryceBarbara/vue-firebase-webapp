<script setup lang="ts">
const theme = currentNaiveTheme
</script>

<template>
  <n-config-provider :theme="theme" h-full>
    <n-message-provider placement="top-right">
      <n-loading-bar-provider>
        <slot />
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>
