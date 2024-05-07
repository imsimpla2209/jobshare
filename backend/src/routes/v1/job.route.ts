import { getSkills } from '@modules/skill/skill.controller'
import express, { Router } from 'express'
import { auth } from '../../modules/auth'
import { jobController, jobValidation } from '../../modules/job'
import { validate } from '../../providers/validate'

const router: Router = express.Router()

router
  .route('/')
  .post(validate(jobValidation.createJob), jobController.createJob)
  .get(validate(jobValidation.getJobs), jobController.getJobs)

router.route('/all').get(jobController.getAllJobs)
router.route('/allforAdmin').get(jobController.getAllJobsforAdmin)
router.route('/filter').post(validate(jobValidation.advancedGetJobs), jobController.getAdvancedJobs)
router.route('/search').get(validate(jobValidation.searchJob), jobController.searchJobs)
router.route('/fav').get(validate(jobValidation.getRcmdJob), jobController.getFavJobsByUser)
router.route('/similar').get(validate(jobValidation.getSimilarJobs), jobController.getSimilarJobs)
router.route('/categories').get(validate(jobValidation.getSimilarJobs), jobController.getCategories)
router.route('/skills').get(validate(jobValidation.getSimilarJobs), getSkills)
router.route('/skill-sum-by-jobs').get(validate(jobValidation.getJobs), jobController.sumBySkills)
router.route('/cats-sum-by-jobs').get(validate(jobValidation.getJobs), jobController.sumByCats)
router.route('/byFreelancerfav').get(auth(), validate(jobValidation.getJobs), jobController.getJobByFreelancerFav)
router.route('/cur-interest').get(auth(), validate(jobValidation.getJobs), jobController.getCurrentInterestedJobs)
router
  .route('/cur-interest-jobs')
  .get(auth(), validate(jobValidation.getJobs), jobController.getCurrentInterestedJobsByJobs)
router
  .route('/cur-interest-type')
  .get(auth(), validate(jobValidation.getJobs), jobController.getCurrentInterestedJobsByType)
router
  .route('/top-interest-type')
  .get(auth(), validate(jobValidation.getJobs), jobController.getTopInterestedJobsByType)
router.route('/rcmd').get(auth(), validate(jobValidation.getRcmdJob), jobController.getRcmdJobs)

router
  .route('/:id')
  .get(validate(jobValidation.getJob), jobController.getJob)
  .patch(auth(), validate(jobValidation.updateJob), jobController.updateJob)
  .delete(auth(), validate(jobValidation.deleteJob), jobController.deleteJob)
router.route('/status/:id').patch(auth(), validate(jobValidation.updateJobStatus), jobController.updateJobStatus)
router.route('/admin/:id').delete(auth(), validate(jobValidation.deleteJob), jobController.forcedDeleteJob)

export default router
