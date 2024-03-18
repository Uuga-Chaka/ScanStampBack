import { onSchedule } from 'firebase-functions/v2/scheduler'
import * as logger from 'firebase-functions/logger'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const handleUserValidation = functions.auth.user().onCreate(async (user) => {
  logger.info('Adding user to DB')
  await admin.database().ref(`/api/admin/${user.uid}`).set({ validated: false })
  logger.info('Finished adding user to DB')
})

export const handleDailyCleanup = onSchedule('every day 00:00', async () => {
  logger.info('Started clean up')
  await admin.database().ref('/api').remove()
  logger.info('Scheduled daily cleanup completed successfully.')
})
