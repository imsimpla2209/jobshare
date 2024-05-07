/* eslint-disable import/prefer-default-export */
import { acceptContract } from '@modules/contract/contract.service'
import Queue from 'bull'
import { ApiError } from 'common/errors'
import { logger } from 'common/logger'
import httpStatus from 'http-status'

// const jobQueues = {};

// create a queue for each job dont neeed to use now
// function getQueueForJob(jobId) {
//   if (!jobQueues[jobId]) {
//     jobQueues[jobId] = new Queue(`accept-contract-${jobId}`, {
//       redis: {
//         host: 'localhost',
//         port: 6379,
//       },
//     });

//     jobQueues[jobId].process(async (job) => {
//       const { contractId, invitationId } = job.data;
//       await acceptContract(contractId, invitationId);
//     });

//     jobQueues[jobId].on('completed', (job, result) => {
//       console.log(`Job ${job.id} completed: ${result}`);
//     });

//     jobQueues[jobId].isReady().then(() => {
//       jobQueues[jobId].resume();
//     });
//   }

//   return jobQueues[jobId];
// }

export const contractQueue = new Queue('accept-contract', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
})

contractQueue.process(async job => {
  const { contractId, invitationId } = job.data

  try {
    // Gọi service để xử lý accept contract
    const result = await acceptContract(contractId, invitationId)
    return result
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Error processing contract job: ${error.message}`)
  }
})

contractQueue.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed: ${result}`)
  return result
})

contractQueue.isReady().then(() => {
  contractQueue.resume()
})
