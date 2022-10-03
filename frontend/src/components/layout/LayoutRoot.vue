<script lang="ts" setup>
const router = useRouter()

// Setup the loading bar for navigation
const loadingBar = useLoadingBar()
router.beforeEach((to, from) => {
  if (to.path !== from.path)
    loadingBar.start()
})
router.afterEach(() => { loadingBar.finish() })
</script>

<template>
  <div h-full>
    <slot />
  </div>
</template>
