import type {
  CalculateSquareRequest,
  CalculateSquareResponse,
  GetWelcomeMessageRequest,
  GetWelcomeMessageResponse,
} from './types'
import { defineCallable } from './utilities'

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export const { data: getWelcomeMessage } = defineCallable<GetWelcomeMessageRequest, GetWelcomeMessageResponse>('getWelcomeMessage')
export const { data: calculateSquare } = defineCallable<CalculateSquareRequest, CalculateSquareResponse>('calculateSquare')
