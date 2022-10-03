import type { HttpsCallableResult } from 'firebase/functions'
import { functions, getFunctionUrl } from '../firebase/functions'
import type { CallOptions } from '../firebase/utilities'
import { customCallable } from '../firebase/utilities'

export function defineCallable<TResponse>(apiEndpointName: string): {
  raw: (options?: CallOptions) => Promise<HttpsCallableResult<TResponse>>
  data: (options?: CallOptions) => Promise<TResponse>
}
export function defineCallable<TRequest, TResponse>(apiEndpointName: string): {
  raw: (data: TRequest, options?: CallOptions) => ReturnType<ReturnType<typeof customCallable<TRequest, TResponse>>>
  data: (data: TRequest, options?: CallOptions) => Awaited<ReturnType<ReturnType<typeof customCallable<TRequest, TResponse>>>>['data']
}
export function defineCallable(apiEndpointName: string) {
  const apiFunc = customCallable(functions, apiEndpointName)
  const raw = async function rawFunc(data = undefined, options = undefined) {
    return await apiFunc(data, options)
  }
  const data = async function dataFunc(data = undefined, options = undefined) {
    const response = await raw(data, options)
    return response.data
  }
  return { raw, data }
}

export function defineGet<TResponse>(apiEndpointName: string): {
  raw: () => Promise<Response>
  data: () => Promise<TResponse>
} {
  const functionUrl = getFunctionUrl(apiEndpointName)
  async function raw() {
    const response = await fetch(functionUrl)
    return response
  }
  async function data() {
    const response = await raw()
    return await response.json() as TResponse
  }
  return { raw, data }
}
