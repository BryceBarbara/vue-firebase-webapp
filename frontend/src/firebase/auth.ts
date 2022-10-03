import {
  signInWithPopup as fbSignInWithPopup,
  getAuth,
} from 'firebase/auth'
import type { UserCredential } from 'firebase/auth'
import { app } from './app.g'
import { authProvider } from './auth-provider.g'

export const auth = getAuth(app)

export function signInWithPopup(): Promise<UserCredential> {
  return fbSignInWithPopup(auth, authProvider)
}
