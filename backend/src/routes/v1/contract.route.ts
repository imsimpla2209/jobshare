import express, { Router } from 'express'
import { validate } from '../../providers/validate'
import { auth } from '../../modules/auth'
import { contractController, contractValidation } from '../../modules/contract'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(contractValidation.createContract), contractController.createContract)
  .get(validate(contractValidation.getContracts), contractController.getContracts)

router
  .route('/status/:id')
  .patch(auth(), validate(contractValidation.updateContractStatus), contractController.updateContractStatus)
router.route('/accept/:id').get(auth(), validate(contractValidation.acceptContract), contractController.acceptContract)
router.route('/reject/:id').get(auth(), validate(contractValidation.acceptContract), contractController.rejectContract)

router
  .route('/:id')
  .get(auth(), validate(contractValidation.getContract), contractController.getContract)
  .patch(auth(), validate(contractValidation.updateContract), contractController.updateContract)
  .patch(auth(), validate(contractValidation.updateContractStatus), contractController.updateContractStatus)
  .delete(auth(), validate(contractValidation.deleteContract), contractController.deleteContract)

export default router
