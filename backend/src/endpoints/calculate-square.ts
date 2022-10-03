import * as functions from 'firebase-functions'
import type { CalculateSquareRequest, CalculateSquareResponse } from '../api-types'
import checkAuth from '../utils/check-auth'

/**
 * Gets a welcome message.
 */
export const calculateSquare = functions.https.onCall<CalculateSquareRequest, CalculateSquareResponse>(async (data, context) => {
  checkAuth(context)

  if (data == null) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'request data must be a valid CalculateSquareRequest',
    )
  }

  if (typeof data.input !== 'number') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'input must be a valid number',
    )
  }

  const output = data.input * data.input

  functions.logger.info('Squared input', { uid: context.auth.uid, input: data.input, output })

  return {
    output,
  }
})

