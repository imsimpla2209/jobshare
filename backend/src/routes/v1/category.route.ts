import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { jobController, jobValidation } from '../../modules/job'

const router: Router = express.Router()

router
  .route('/')
  .get(jobController.getAllCategories)
  .post(auth(), validate(jobValidation.createCategory), jobController.createCategory)

router
  .route('/:id')
  .patch(auth(), validate(jobValidation.updateCategory), jobController.updateCategory)
  .delete(auth(), validate(jobValidation.deleteCategory), jobController.deleteCategory)

export default router
