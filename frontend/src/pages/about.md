<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
useHead({
  title: computed(() => t('pages.about.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('pages.about.page-description')),
    },
  ],
})
</script>
<route>
{
  meta: {
    requiresAuth: true
  }
}
</route>

<div text-center mt-4>
  <div i-carbon-information class="text-4xl -mb-6 m-auto" />
  <!-- you can use the normal vue functionality here -->
  <h3>{{ t('pages.about.title') }}</h3>
</div>

<!-- you can even use custom components -->
<i18n-t keypath="pages.about.description" tag="p" scope="global">
  <template v-slot:self>
    <RouterLink to='/'>
      {{ t('app.title') }}
    </RouterLink>
  </template>
  <template v-slot:vue>
    <a href="https://vuejs.org/" target="_blank">Vue</a>
  </template>
  <template v-slot:firebase>
    <a href="https://firebase.google.com/" target="_blank">Firebase</a>
  </template>
</i18n-t>

```js
// todo: finish this
function isThisTemplateProductionReady() {
  return false
}
```

<div text-center>
  <NButton @click="router.push('/')">
    {{ t('pages.about.back') }}
    <template #icon>
      <i-carbon-home />
    </template>
  </NButton>
</div>
