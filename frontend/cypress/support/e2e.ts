import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import { attachCustomCommands } from 'cypress-firebase'
import { app } from '../../src/firebase/app.g'

firebase.initializeApp({
  ...app.options,
})

attachCustomCommands({ Cypress, cy, firebase })
