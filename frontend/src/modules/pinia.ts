import { createPinia } from 'pinia'
import { type UserModule } from '~/types'

// Setup Pinia
// https://pinia.vuejs.org/
export const install: UserModule = ({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
  // Refer to
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // for other serialization strategies.
  pinia.state.value = {}
}
