import { HttpsFunction, Runnable } from 'firebase-functions'
import { CallableContext } from 'firebase-functions/v1/https'

declare module 'firebase-functions' {
  namespace https {
    function onCall<Response>(handler: (data: unknown, context: CallableContext) => Response | Promise<Response>): HttpsFunction & Runnable<unknown>;
    function onCall<RequestData, Response>(handler: (data: RequestData | null, context: CallableContext) => Response | Promise<Response>): HttpsFunction & Runnable<RequestData>;
  }
  interface https {
    onCall(handler: boolean): void
  }
}
