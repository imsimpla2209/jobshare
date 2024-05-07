import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { skillController, skillValidation } from '@modules/skill'

const router: Router = express.Router()

router
  .route('/')
  .get(auth(), validate(skillValidation.getSkills), skillController.getSkills)
  .post(auth(), validate(skillValidation.createSkill), skillController.createSkill)

router
  .route('/:id')
  .get(auth(), validate(skillValidation.getSkill), skillController.getSkill)
  .patch(auth(), validate(skillValidation.updateSkill), skillController.updateSkill)
  .delete(auth(), validate(skillValidation.deleteSkill), skillController.deleteSkill)

export default router
