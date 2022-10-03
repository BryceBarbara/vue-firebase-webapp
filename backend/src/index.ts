import * as cors from 'cors'

export { getWelcomeMessage } from './endpoints/get-welcome-message'
export { calculateSquare } from './endpoints/calculate-square'

cors({ origin: true })
