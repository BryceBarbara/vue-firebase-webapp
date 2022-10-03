<template>
  <LayoutRoot min-h-screen>
    <n-layout has-sider min-h-screen content-style="overflow: visible; min-height: 100%">
      <n-layout-sider
        collapse-mode="width"
        :collapsed="sidebarCollapsed"
        :collapsed-width="sidebarCollapsedWidth"
        :width="sidebarExpandedWidth"
      >
        <Sidebar />
      </n-layout-sider>
      <n-layout min-h-screen>
        <n-layout-header><Header has-sidebar /></n-layout-header>
        <n-layout-content content-style="overflow: visible">
          <RouterView />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </LayoutRoot>
</template>
