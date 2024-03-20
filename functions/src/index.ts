import { onSchedule } from 'firebase-functions/v2/scheduler'
import { onValueUpdated } from 'firebase-functions/v2/database'
import * as logger from 'firebase-functions/logger'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const handleUserValidation = functions.auth.user().onCreate(async (user) => {
  logger.info('Setting users claims')
  await admin.auth().setCustomUserClaims(user.uid, { validated: false })
  logger.info('Finish setting user claims')
  logger.info('Adding user to DB')
  await admin.database().ref(`/api/admin/${user.uid}`).set({ email: user.email, uid: user.uid })
  logger.info('Finished adding user to DB')
})

export const setUserRoles = onValueUpdated('/api/admin/{uid}', (event) => {
  if (!event.data.after.exists()) return

  const { validated } = event.data.after.val()

  if (!validated) return

  const uid = event.params.uid
  logger.info('Setting up user permissions')
  return admin.auth().setCustomUserClaims(uid, { validated })
})

export const handleDailyCleanup = onSchedule('every day 00:00', async () => {
  logger.info('Started clean up')
  await admin.database().ref('/api/user/').remove()
  logger.info('Scheduled daily cleanup completed successfully.')
})
