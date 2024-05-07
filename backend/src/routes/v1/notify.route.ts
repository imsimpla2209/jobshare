import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { notifyController, notifyValidation } from '../../modules/notify'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(notifyValidation.createNotify), notifyController.createNotify)
  .patch(validate(notifyValidation.updateManyNotify), notifyController.updateManyNotify)
  .get(validate(notifyValidation.getNotifys), notifyController.getNotifys)

router
  .route('/invitation')
  .post(validate(notifyValidation.createInvitation), notifyController.createInvitation)
  .patch(validate(notifyValidation.createInvitation), notifyController.updateManyInvitation)
  .get(validate(notifyValidation.getInvitations), notifyController.getInvitations)
router
  .route('/invitation/status/:id')
  .patch(auth(), validate(notifyValidation.updateStatus), notifyController.updateInvitationStatus)
router
  .route('/invitation/:id')
  .get(auth(), validate(notifyValidation.getNotify), notifyController.getInvitation)
  .patch(auth(), validate(notifyValidation.createInvitation), notifyController.updateInvitation)
  .delete(auth(), validate(notifyValidation.deleteNotify), notifyController.deleteInvitation)

router
  .route('/:id')
  .get(auth(), validate(notifyValidation.getNotify), notifyController.getNotify)
  .patch(auth(), validate(notifyValidation.updateNotify), notifyController.updateNotify)
  .delete(auth(), validate(notifyValidation.deleteNotify), notifyController.deleteNotify)

export default router
