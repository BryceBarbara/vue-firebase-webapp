import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from '~pages'

const routes = setupLayouts(generatedRoutes)

export const router = createRouter({
  routes,
  history: createWebHistory(),
})
