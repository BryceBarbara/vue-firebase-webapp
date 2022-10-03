import { isAbortError } from '../api'

type AllButLast<T extends any[]> = T extends [ ...infer Head, any ] ? Head : never

type FunctionWithAbortSignal<TResponse = any> =
    { (signal: AbortSignal): TResponse } |
    { (arg1: any, signal: AbortSignal): TResponse } |
    { (arg1: any, arg2: any, signal: AbortSignal): TResponse } |
    { (arg1: any, arg2: any, arg3: any, signal: AbortSignal): TResponse }

export interface UseSingletonRequestInput<TExecute extends FunctionWithAbortSignal = FunctionWithAbortSignal> {
  execute: TExecute
}

export function useSingletonRequest<TInput extends UseSingletonRequestInput>(input: TInput) {
  const abortController = ref<AbortController | null>(null)

  function cancelPending() {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
  }

  async function execute(...args: AllButLast<Parameters<TInput['execute']>>) {
    try {
      if (abortController.value) {
        console.warn('Aborting previous request')
        cancelPending()
      }

      const controller = new AbortController()
      abortController.value = controller

      const newArgs = [...args, controller.signal] as const

      // @ts-expect-error TypeScript is angry about the arguments not matching
      const result = await input.execute.apply(null, newArgs) as ReturnType<TInput['execute']>
      abortController.value = null
      return result
    }
    catch (e) {
      if (isAbortError(e))
        return
      abortController.value = null
      throw e
    }
  }

  return {
    execute,
    cancelPending,
    loading: computed(() => !!abortController.value),
  }
}
