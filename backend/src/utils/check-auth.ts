import * as functions from 'firebase-functions'

/**
 * Determines if the HTTPS request is authenticated and throws an
 * HttpsError if not.
 * @param {functions.https.CallableContext} context The HTTPS request context.
 */
export default function checkAuth(
  context: functions.https.CallableContext,
): asserts context is functions.https.CallableContext & Required<Pick<functions.https.CallableContext, 'auth'>> {
  // Check authentication
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    )
  }
}
