import type { createRouter } from 'vue-router'

interface AppContext {
  app: ReturnType<typeof createApp>
  router: ReturnType<typeof createRouter>
}

export type UserModule = (ctx: AppContext) => void
