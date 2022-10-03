import { acceptHMRUpdate, defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import { auth, signInWithPopup } from '../firebase/auth'
import { router } from '../router'
import WelcomeIcon from '~icons/carbon/user-favorite-alt'

export const useUserStore = defineStore('user', () => {
  const authUser = ref<User | null>(null)

  auth.onAuthStateChanged(async (user) => {
    // console.log('Auth state changed', user)
    const justLoggedOut = authUser.value && !user
    authUser.value = user

    if (justLoggedOut) {
      // If a user is logged out, redirect to the login page.
      router.push({ name: 'login' })
    }
  })

  const isAuthenticated = computed(() => !!authUser.value)

  async function signIn(message: MessageApiInjection) {
    if (isAuthenticated.value)
      return

    await signInWithPopup()
    if (authUser.value) {
      message.success(`Welcome, ${authUser.value!.displayName}!`, {
        icon: () => h(WelcomeIcon),
        closable: true,
      })
    }
  }

  async function signOut() {
    await auth.signOut()
    authUser.value = null
  }

  return {
    auth,
    authUser,
    isAuthenticated,
    signIn,
    signOut,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
