import { i18n } from '~/i18n'
import { type UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(i18n)
}
