<script setup lang="ts">
import { calculateSquare, getWelcomeMessage } from '~/api'

const { t, d, n, locale } = useI18n()

const welcomeMessage = useAsyncState(async () => await getWelcomeMessage({ locale: locale.value }), null)

const welcomeErrorMessage = computed(() => {
  if (!welcomeMessage.error.value)
    return null
  return getErrorMessage(welcomeMessage.error.value, t('pages.api-test.error.welcome-test'))
})

watch(locale, () => {
  // Refresh the welcome message when the locale changes
  welcomeMessage.execute()
})

const mathForm = ref({
  numberInput: ref<null | number>(null),
})

const mathTest = useAsyncState(async () => {
  if (mathForm.value.numberInput === null)
    throw new Error(t('pages.api-test.remote-math-test.error.number-required'))
  if (typeof mathForm.value.numberInput !== 'number')
    throw new Error(t('pages.api-test.remote-math-test.error.invalid-value'))
  const response = await calculateSquare({ input: mathForm.value.numberInput })
  return {
    ...response,
    date: new Date(),
  }
}, null, { immediate: false })

const remoteMathErrorMessage = computed(() => {
  if (!mathTest.error.value)
    return null
  return getErrorMessage(mathTest.error.value, t('pages.api-test.error.remote-math-test'))
})
</script>

<template>
  <div p-4>
    <NSpace vertical>
      <NCard :title="t('pages.api-test.welcome-test.title')">
        <NSkeleton v-if="welcomeMessage.isLoading.value" />
        <NAlert v-else-if="welcomeErrorMessage" type="error">
          {{ welcomeErrorMessage }}
        </NAlert>
        <p v-else-if="welcomeMessage.state.value" leading-none data-test="welcome-message-result">
          <span mr-1>
            {{ t('pages.api-test.welcome-test.label.server-result') }}
          </span>
          <span>{{ welcomeMessage.state.value.message }}</span>
        </p>
        <template #action>
          <NButton :loading="welcomeMessage.isLoading.value" data-test="welcome-message-refresh-button" @click="() => welcomeMessage.execute()">
            {{ t('pages.api-test.welcome-test.button.refresh') }}
          </NButton>
        </template>
      </NCard>
      <NCard :title="t('pages.api-test.remote-math-test.title')">
        <NForm
          :model="mathForm"
          label-placement="top"
          inline
          @submit.prevent="() => mathTest.execute()"
        >
          <NFormItem :label="t('pages.api-test.remote-math-test.label.number-input')" path="mathForm.numberInput" required>
            <NInputNumber
              v-model:value="mathForm.numberInput"
              :placeholder="t('pages.api-test.remote-math-test.placeholder.number-input')"
              clearable
              min-w-280px
              data-test="remote-math-input"
            />
          </NFormItem>
          <NFormItem>
            <NButton :loading="mathTest.isLoading.value" attr-type="submit" data-test="remote-math-submit-button">
              {{ t('pages.api-test.remote-math-test.button.submit') }}
            </NButton>
          </NFormItem>
        </NForm>
        <p v-if="mathTest.isLoading.value || mathTest.state.value" leading-none>
          <span mr-1>
            {{ t('pages.api-test.remote-math-test.label.server-result') }}
          </span>
          <n-skeleton v-if="mathTest.isLoading.value" text style="width: 20ch" />
          <i18n-t
            v-else-if="mathTest.state.value"
            keypath="pages.api-test.remote-math-test.result"
            tag="span"
          >
            <template #output>
              <span data-test="remote-math-result-output">{{ n(mathTest.state.value.output) }}</span>
            </template>
            <template #when>
              <span data-test="remote-math-result-when">{{ d(mathTest.state.value.date, 'long') }}</span>
            </template>
          </i18n-t>
          <span v-else>{{ t('pages.api-test.remote-math-test.error.missing-result') }}</span>
        </p>
        <NAlert v-else-if="remoteMathErrorMessage" type="error">
          {{ remoteMathErrorMessage }}
        </NAlert>
      </NCard>
    </NSpace>
  </div>
</template>
