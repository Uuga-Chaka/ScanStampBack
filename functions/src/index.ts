import { onSchedule } from 'firebase-functions/v2/scheduler'
import * as logger from 'firebase-functions/logger'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const handleDailyCleanup = onSchedule('every day 00:00', async () => {
  logger.info('stated clean up')
  try {
    const ref = await admin.database().ref('/api')
    await ref.remove()
    logger.info('Scheduled daily cleanup completed successfully.')
  } catch (err) {
    logger.error(`Error occurred during scheduled cleanup: ${err}`)
  }
})
