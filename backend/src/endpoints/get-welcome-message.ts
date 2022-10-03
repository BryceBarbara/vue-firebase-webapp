import * as functions from 'firebase-functions'
import type { GetWelcomeMessageRequest, GetWelcomeMessageResponse } from '../api-types'
import checkAuth from '../utils/check-auth'

/**
 * Gets a welcome message.
 */
export const getWelcomeMessage = functions.https.onCall<GetWelcomeMessageRequest, GetWelcomeMessageResponse>(async (data, context) => {
  checkAuth(context)

  const WelcomeMessages: Record<string, string[]> = {
    en: [
      'Welcome to the Vue & Firebase Web App!',
      'Did you know that you can edit this message in the backend?',
      'Enjoy your stay!',
    ],
    de: [
      'Willkommen in der Vue & Firebase Web App!',
      'Wusstest du, dass du diese Nachricht im Backend bearbeiten kannst?',
      'Viel Spaß!',
    ],
  }

  let locale = 'en'
  if (data !== null) {
    if (data.locale && data.locale in WelcomeMessages)
      locale = data.locale
  }

  functions.logger.info('Getting welcome message...', { uid: context.auth.uid, locale })

  const message = WelcomeMessages[locale][Math.floor(Math.random() * WelcomeMessages[locale].length)]

  return {
    message,
  }
})

