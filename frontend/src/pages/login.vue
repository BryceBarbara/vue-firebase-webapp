<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { t, availableLocales } = useI18n()
const router = useRouter()
const user = useUserStore()
const { isAuthenticated } = storeToRefs(user)
const message = useMessage()
const isSigningIn = ref(false)

const loginDestination = '/'

const showLanguageSelector = computed(() => availableLocales.length > 1)

const go = async () => {
  if (user.isAuthenticated) {
    router.push(loginDestination)
  }
  else {
    await signIn()
    if (user.isAuthenticated)
      router.push(loginDestination)
  }
}
async function signIn() {
  if (user.isAuthenticated)
    return go()
  try {
    isSigningIn.value = true
    await user.signIn(message)
  }
  catch (e) {
    console.error(e)
    const errorMessage = getErrorMessage(e, t('error.login-fallback'))
    message.error(errorMessage)
  }
  finally {
    isSigningIn.value = false
  }
}

watch(isAuthenticated, () => {
  if (isAuthenticated)
    router.replace(loginDestination)
})
onMounted(() => {
  if (isAuthenticated)
    router.replace(loginDestination)
})
</script>

<template>
  <div flex flex-col>
    <div pt-40 />
    <div
      flex
      flex-col
      max-w-400px
      mx-auto
      min-w-320px
      gap-4
      items-center
    >
      <div text-center>
        <div text-4xl>
          <div i-carbon:assembly inline-block />
        </div>
        <p>
          <a rel="noreferrer" href="" target="_blank">
            {{ t('login.title') }}
          </a>
        </p>
        <p>
          <em text-sm opacity-75>{{ $t('login.desc') }}</em>
        </p>
      </div>

      <div v-if="!user.isAuthenticated" self-stretch>
        <NButton
          :disabled="isSigningIn"
          type="primary"
          important-w-full
          @click="signIn"
        >
          {{ t('button.sign-in') }}
        </NButton>
      </div>
      <div v-else justify-self-stretch>
        {{ t('intro.signed-in') }}
      </div>
      <div>
        <LanguageSelector v-if="showLanguageSelector" quaternary />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  requiresAuth: false
  requiresGuest: true
  layout: bare
</route>
