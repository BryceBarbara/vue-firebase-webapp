import { FirebaseError } from 'firebase/app'

import { i18n } from '~/i18n'

/**
 * Determines if the object has a `message` string property.
 * @param error The object to check.
 * @returns `true` if the object has a `message` string property, `false` otherwise.
 */
function hasMessageString(error: any): error is { message: string } {
  return error && typeof error.message === 'string'
}

function getFirebaseErrorMessage(error: FirebaseError): string {
  if (error.message === 'internal')
    return i18n.global.t('error.firebase-internal')
  return error.message
}

/**
 * Attempts to extract a message from the given error.
 * @param error The thrown error.
 * @param fallbackMessage The message to return if the error does not have a message.
 * @returns The error's message, or the fallback message if the a message couldn't be extracted.
 * @example
 * ```javascript
 * try {
 *   someFunctionThatThrows()
 * } catch (error) {
 *   const errorMessage = getErrorMessage(error, 'An error ocurred while doing something.')
 *   toasts.error(errorMessage)
 * }
 * ```
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'Unknown error'): string {
  if (error instanceof FirebaseError)
    return `${getFirebaseErrorMessage(error)} (${error.code})`
  if (error instanceof Error)
    return error.message
  if (typeof error === 'string')
    return error
  else if (typeof error === 'object' && error && hasMessageString(error))
    return error.message
  else if (error instanceof Object)
    return (error as object).toString()
  else
    return fallbackMessage
}
