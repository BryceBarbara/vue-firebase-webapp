import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import type { UserModule } from './types'
import { auth } from './firebase/auth'
import { i18n } from './i18n'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

import { router } from './router'

function waitForFirebaseAuth() {
  return new Promise<void>((resolve) => {
    auth.onAuthStateChanged(() => {
      resolve()
    })
  })
}

function startAndMountApp() {
  const app = createApp(App)

  app.use(createHead({
    titleTemplate: title => title ? `${title} | ${i18n.global.t('app.title')}` : i18n.global.t('app.title'),
  }))
  app.use(router)

  // install all modules under `modules/`
  Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
    .forEach(i => i.install?.({ app, router }))

  // See: https://www.naiveui.com/en-US/dark/docs/style-conflict#About-Tailwind's-Preflight-Style-Override
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)

  app.mount('#app')
}

waitForFirebaseAuth().then(startAndMountApp)
