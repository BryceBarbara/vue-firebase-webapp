import { defineConfig } from 'cypress'
import admin from 'firebase-admin'
import { plugin as cypressFirebasePlugin } from 'cypress-firebase'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333',
    chromeWebSecurity: false,
    specPattern: 'cypress/e2e/**/*.spec.*',
    setupNodeEvents(on, config) {
      cypressFirebasePlugin(on, config, admin)
    },
  },
})
