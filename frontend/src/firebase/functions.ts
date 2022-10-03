import type { FirebaseError } from 'firebase/app'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { app } from './app.g'

export const functions = getFunctions(app)

// If running locally, automatically connect to the emulator
if (process.env.NODE_ENV === 'development')
  connectFunctionsEmulator(functions, 'localhost', 5002)

export function isFirebaseError(error: unknown): error is FirebaseError {
  return (error as FirebaseError)?.name === 'FirebaseError'
}

export function getFunctionUrl(name: string): string {
  const projectId = app.options.projectId
  let emulatorOrigin: string | null | undefined = null
  if ('emulatorOrigin' in functions)
    emulatorOrigin = (functions as unknown as Record<string, string | null | undefined>).emulatorOrigin

  if (emulatorOrigin) {
    const origin = emulatorOrigin
    return `${origin}/${projectId}/${functions.region}/${name}`
  }
  if (functions.customDomain !== null)
    return `${functions.customDomain}/${name}`

  return `https://${functions.region}-${projectId}.cloudfunctions.net/${name}`
}
