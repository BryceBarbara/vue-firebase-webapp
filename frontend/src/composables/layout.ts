export const sidebarCollapsed = useLocalStorage('sidebarCollapsed', false)
export const sidebarCollapsedWidth = ref(64)
export const sidebarExpandedWidth = ref(240)

export function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
