import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { messageController, messageValidation } from '../../modules/message'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(messageValidation.createMessage), messageController.createMessage)
  .get(validate(messageValidation.getMessages), messageController.getMessages)

router
  .route('/rooms/')
  .post(auth(), validate(messageValidation.createMessageRoom), messageController.createMessageRoom)
  .get(auth(), validate(messageValidation.getMessageRooms), messageController.getMessageRooms)

router
  .route('/rooms/check')
  .post(auth(), validate(messageValidation.createMessageRoom), messageController.checkMessageRoom)
router
  .route('/rooms/request')
  .post(auth(), validate(messageValidation.requestMessageRoom), messageController.createRequestMessage)
router
  .route('/rooms/accept/:id')
  .post(auth(), validate(messageValidation.getMessage), messageController.acceptMessageRequest)
router
  .route('/rooms/reject/:id')
  .post(auth(), validate(messageValidation.getMessage), messageController.rejectMessageRequest)
router
  .route('/rooms/status/:id')
  .post(auth(), validate(messageValidation.updateStatus), messageController.updateMessageRoomStatus)

router
  .route('/rooms/:id')
  .get(auth(), validate(messageValidation.getMessageRooms), messageController.getMessageRooms)
  .patch(auth(), validate(messageValidation.updateMessageRoom), messageController.updateMessageRoom)
  .delete(auth(), validate(messageValidation.deleteMessage), messageController.deleteMessageRoom)

router
  .route('/:id')
  .get(auth(), validate(messageValidation.getMessage), messageController.getMessage)
  .patch(auth(), validate(messageValidation.updateMessage), messageController.updateMessage)
  .delete(auth(), validate(messageValidation.deleteMessage), messageController.deleteMessage)

export default router
