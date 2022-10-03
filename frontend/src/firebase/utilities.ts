import { FirebaseError } from '@firebase/util'
import type { Auth } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import type { Functions, HttpsCallableResult } from 'firebase/functions'
import type { Messaging } from 'firebase/messaging'
import { getToken as getMessagingToken } from 'firebase/messaging'
import type { AppCheck } from 'firebase/app-check'
import type { Options as KyOptions, KyResponse } from 'ky-universal'
import { getToken as getAppCheckToken } from 'firebase/app-check'
import ky from 'ky-universal'
import { getFunctionUrl } from '../firebase/functions'

export declare type CustomHttpCallable<RequestData = unknown, ResponseData = unknown> = (data?: RequestData | null, options?: CallOptions) => Promise<HttpsCallableResult<ResponseData>>

interface PostResponse<T> {
  status: number
  json: T | null
}

interface FirebaseCallableResponse<TData> {
  data?: TData
  result?: TData
}

export interface CallOptions extends Omit<KyOptions, 'method' | 'body' | 'headers'> {
  auth?: Auth | null
  headers?: Record<string, string | undefined>
  messaging?: Messaging | null
  appCheck?: AppCheck | null
}

/**
 * Returns a reference to the callable https trigger with the given name.
 * @param name - The name of the trigger.
 * @public
 */
export function customCallable<RequestData, ResponseData>(
  functionsInstance: Functions,
  name: string,
): CustomHttpCallable<RequestData, ResponseData> {
  const url = getFunctionUrl(name)
  const defaultOptions: CallOptions = {
    auth: getAuth(functionsInstance.app),
  }
  return (data, options) => {
    return callAtURL<ResponseData>(url, data, { ...defaultOptions, ...options })
  }
}

const LONG_TYPE = 'type.googleapis.com/google.protobuf.Int64Value'
const UNSIGNED_LONG_TYPE = 'type.googleapis.com/google.protobuf.UInt64Value'

class FunctionsError extends FirebaseError {
  details?: unknown | null

  constructor(code: string, message?: string, details?: unknown | null) {
    super(`functions/${code}`, message || '')
    this.details = details
  }
}

function mapValues(
  o: { [key: string]: any },
  f: (arg0: unknown) => unknown,
): object {
  const result: { [key: string]: unknown } = {}
  for (const key in o) {
    if (Object.prototype.hasOwnProperty.call(o, key))
      result[key] = f(o[key])
  }
  return result
}

/**
 * Takes data and encodes it in a JSON-friendly way, such that types such as
 * Date are preserved.
 * @internal
 * @param data - Data to encode.
 */
function encode(data: unknown): unknown {
  if (data == null)
    return null

  if (data instanceof Number)
    data = data.valueOf()

  if (typeof data === 'number' && isFinite(data)) {
    // Any number in JS is safe to put directly in JSON and parse as a double
    // without any loss of precision.
    return data
  }
  if (data === true || data === false)
    return data

  if (Object.prototype.toString.call(data) === '[object String]')
    return data

  if (data instanceof Date)
    return data.toISOString()

  if (Array.isArray(data))
    return data.map(x => encode(x))

  if (typeof data === 'function' || typeof data === 'object')
    return mapValues(data!, x => encode(x))

  // If we got this far, the data is not able to be encoded.
  throw new Error(`Data cannot be encoded in JSON: ${data}`)
}

/**
 * Takes data that's been encoded in a JSON-friendly form and returns a form
 * with richer datatypes, such as Dates, etc.
 * @internal
 * @param json - JSON to convert.
 */
function decode<T>(json: unknown): T | object | number | null | undefined | T[] {
  if (json === null || json === undefined)
    return json

  if ((json as { [key: string]: unknown })['@type']) {
    switch ((json as { [key: string]: unknown })['@type']) {
      case LONG_TYPE:
      // Fall through and handle this the same as unsigned.
      case UNSIGNED_LONG_TYPE: {
        // Technically, this could work return a valid number for malformed
        // data if there was a number followed by garbage. But it's just not
        // worth all the extra code to detect that case.
        const value = Number((json as { [key: string]: unknown }).value)
        if (isNaN(value))
          throw new Error(`Data cannot be decoded from JSON: ${json}`)

        return value
      }
      default: {
        throw new Error(`Data cannot be decoded from JSON: ${json}`)
      }
    }
  }
  if (Array.isArray(json))
    return json.map(x => decode(x)) as T[]

  if (typeof json === 'function' || typeof json === 'object')
    return mapValues(json!, x => decode(x))

  // Anything else is safe to return.
  return json
}

/**
 * Takes an HTTP status code and returns the corresponding ErrorCode.
 * This is the standard HTTP status code -> error mapping defined in:
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 *
 * @param status An HTTP status code.
 * @return The corresponding ErrorCode, or ErrorCode.UNKNOWN if none.
 */
function codeForHTTPStatus(status: number) {
  // Make sure any successful status is OK.
  if (status >= 200 && status < 300)
    return 'ok'

  switch (status) {
    case 0:
      // This can happen if the server returns 500.
      return 'internal'
    case 400:
      return 'invalid-argument'
    case 401:
      return 'unauthenticated'
    case 403:
      return 'permission-denied'
    case 404:
      return 'not-found'
    case 409:
      return 'aborted'
    case 429:
      return 'resource-exhausted'
    case 499:
      return 'cancelled'
    case 500:
      return 'internal'
    case 501:
      return 'unimplemented'
    case 503:
      return 'unavailable'
    case 504:
      return 'deadline-exceeded'
  }
  return 'unknown'
}

const errorCodeMap: Record<string, string | undefined> = {
  OK: 'ok',
  CANCELLED: 'cancelled',
  UNKNOWN: 'unknown',
  INVALID_ARGUMENT: 'invalid-argument',
  DEADLINE_EXCEEDED: 'deadline-exceeded',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  PERMISSION_DENIED: 'permission-denied',
  UNAUTHENTICATED: 'unauthenticated',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
  FAILED_PRECONDITION: 'failed-precondition',
  ABORTED: 'aborted',
  OUT_OF_RANGE: 'out-of-range',
  UNIMPLEMENTED: 'unimplemented',
  INTERNAL: 'internal',
  UNAVAILABLE: 'unavailable',
  DATA_LOSS: 'data-loss',
}
/**
* Takes an HTTP response and returns the corresponding Error, if any.
*/
function _errorForResponse(status: number, bodyJSON: any) {
  let code = codeForHTTPStatus(status)
  // Start with reasonable defaults from the status code.
  let description = code
  let details
  // Then look through the body for explicit details.
  try {
    const errorJSON = bodyJSON && bodyJSON.error
    if (errorJSON) {
      const status_1 = errorJSON.status
      if (typeof status_1 === 'string') {
        if (!errorCodeMap[status_1]) {
          // They must've included an unknown error code in the body.
          return new FunctionsError('internal', 'internal')
        }
        code = errorCodeMap[status_1]!
        // TODO(klimt): Add better default descriptions for error enums.
        // The default description needs to be updated for the new code.
        description = status_1
      }
      const message = errorJSON.message
      if (typeof message === 'string')
        description = message

      details = errorJSON.details
      if (details !== undefined)
        details = decode(details)
    }
  }
  catch (e) {
    // If we couldn't parse explicit error data, that's fine.
  }
  if (code === 'ok') {
    // Technically, there's an edge case where a developer could explicitly
    // return an error code of OK, and we will treat it as success, but that
    // seems reasonable.
    return null
  }
  return new FunctionsError(code, description, details)
}

/**
 * Calls a callable function asynchronously and returns the result.
 * @param url The url of the callable trigger.
 * @param data The data to pass as params to the function.s
 */
async function callAtURL<TResponse>(
  url: string,
  data: unknown,
  options?: CallOptions | null,
): Promise<HttpsCallableResult<TResponse>> {
  // Encode any special types, such as dates, in the input data.
  data = encode(data)
  const body = { data }

  if (!options)
    options = {}
  if (!options.headers)
    options.headers = {}

  // Add a header for the authToken.
  // const headers: Record<string, string> = {}
  const token = options.auth ? await options.auth.currentUser?.getIdToken() : undefined
  const messagingToken = options.messaging ? await getMessagingToken(options.messaging) : undefined
  const appCheckToken = options.appCheck ? await getAppCheckToken(options.appCheck) : undefined

  // const context = await functionsInstance.contextProvider.getContext()
  if (token)
    options.headers.Authorization = `Bearer ${token}`

  if (messagingToken)
    options.headers['Firebase-Instance-ID-Token'] = messagingToken

  if (appCheckToken)
    options.headers['X-Firebase-AppCheck'] = appCheckToken.token

  // Default timeout to 70s, but let the options override it.
  // const timeout = options.timeout || 70000

  // const failAfterHandle = failAfter(timeout)
  const response = await postJSON<FirebaseCallableResponse<TResponse>>(url, body, options)

  // Always clear the failAfter timeout
  // failAfterHandle.cancel()

  // If service was deleted, interrupted response throws an error.
  if (!response) {
    throw new FunctionsError(
      'cancelled',
      'Firebase Functions instance was deleted.',
    )
  }

  // Check for an error status, regardless of http status.
  const error = _errorForResponse(response.status, response.json)
  if (error)
    throw error

  if (!response.json)
    throw new FunctionsError('internal', 'Response is not valid JSON object.')

  let responseData = response.json.data
  // TODO(klimt): For right now, allow "result" instead of "data", for
  // backwards compatibility.
  if (typeof responseData === 'undefined')
    responseData = response.json.result

  if (typeof responseData === 'undefined') {
    // Consider the response malformed.
    throw new FunctionsError('internal', 'Response is missing data field.')
  }

  // Decode any special types, such as dates, in the returned data.
  const decodedData = decode(responseData) as TResponse

  return { data: decodedData }
}

/**
 * Does an HTTP POST and returns the completed response.
 * @param url The url to post to.
 * @param body The JSON body of the post.
 * @param headers The HTTP headers to include in the request.
 * @return A Promise that will succeed when the request finishes.
 */
async function postJSON<TResponse>(
  url: string,
  body: unknown,
  options: CallOptions,
  // headers: Record<string, string>,
  // abortSignal?: AbortSignal | null,
): Promise<PostResponse<TResponse>> {
  const headers = (options?.headers as Record<string, string | undefined>) || {}
  headers['Content-Type'] = 'application/json'
  const kyOptions: KyOptions = {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  }

  if (options.signal)
    options.signal.throwIfAborted()
  let response: KyResponse
  try {
    response = await ky(url, kyOptions)
  }
  catch (e) {
    // This could be an unhandled error on the backend, or it could be a
    // network error. There's no way to know, since an unhandled error on the
    // backend will fail to set the proper CORS header, and thus will be
    // treated as a network error by fetch.
    return {
      status: 0,
      json: null,
    }
  }
  let json: TResponse | null = null
  try {
    json = await response.json<TResponse>()
  }
  catch (e) {
    // If we fail to parse JSON, it will fail the same as an empty body.
  }
  return {
    status: response.status,
    json,
  }
}
