import { auth } from '../firebase/auth'
import { type UserModule } from '~/types'
export const install: UserModule = ({ router }) => {
  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const requiresGuest = to.matched.some(x => x.meta.requiresGuest)

    if (requiresAuth && !auth.currentUser) {
      // console.log('Redirecting to login...')
      next({ name: 'login' })
    }
    else if (requiresGuest && auth.currentUser) {
      // console.log('Redirecting to home...')
      next('/')
    }
    else {
      next()
    }
  })
}
