import { darkTheme, lightTheme } from 'naive-ui'

// these APIs are auto-imported from @vueuse/core
export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export const preferredDark = usePreferredDark()

export const currentNaiveTheme = computed(() => isDark.value ? darkTheme : lightTheme)
