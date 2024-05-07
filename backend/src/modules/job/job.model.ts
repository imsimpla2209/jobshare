import { ILevelSkill } from '@modules/skill/skill.interfaces'
import { EComplexity, EJobStatus, ELevel, EPaymenType } from 'common/enums'
import mongoose from 'mongoose'
import toJSON from '../../common/toJSON/toJSON'
import paginate from '../../providers/paginate/paginate'
import {
  IJobCategory,
  IJobCategoryModel,
  IJobDoc,
  IJobModel,
  IJobPayment,
  IJobPreferences,
  IJobScope,
  IJobTag,
  IJobTagModel,
} from './job.interfaces'

const jobSchema = new mongoose.Schema<IJobDoc, IJobModel>(
  {
    client: { type: String, ref: 'Client' },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: 'Nothing :))',
    },
    budget: {
      type: Number,
      default: 0,
    },
    scope: {
      type: {
        complexity: Number,
        duration: Number,
      } as unknown as IJobScope,
      default: {
        complexity: EComplexity.MEDIUM,
        duration: 0,
      },
    },
    payment: {
      type: {} as IJobPayment,
      default: {
        amount: 0,
        type: EPaymenType.PERHOURS,
      },
    },
    status: [
      {
        type: {
          status: {
            type: String,
            enum: EJobStatus,
          },
          date: {
            type: Date,
          },
          comment: {
            type: String,
          },
        },
        default: {
          date: new Date(),
          status: EJobStatus.PENDING,
          comment: '',
        },
      },
    ],
    reqSkills: [
      {
        type: {
          skill: {
            // type: mongoose.Types.ObjectId,
            type: String,
            ref: 'Skill',
          },
          level: {
            type: Number,
            enum: ELevel,
            default: ELevel.INTERMEDIATE,
          },
        } as unknown as ILevelSkill,
        default: [],
      },
    ],
    checkLists: [{ type: String, default: [] }],
    proposals: [{ type: String, ref: 'Proposal', default: [] }],
    attachments: [{ type: String, required: 'false', default: [] }],
    questions: [{ type: String, required: 'false', default: [] }],
    categories: [
      {
        // type: mongoose.Types.ObjectId,
        type: String,
        ref: 'JobCategory',
        default: [],
      },
    ],
    preferences: {
      type: {
        nOEmployee: Number,
        locations: [String],
      } as unknown as IJobPreferences,
      default: {
        nOEmployee: 1,
        locations: [],
      },
    },
    isDeleted: { type: Boolean, default: false, private: true },
    currentStatus: {
      type: String,
      enum: EJobStatus,
      default: EJobStatus.OPEN,
    },
    type: {
      type: String,
      default: '',
    },
    experienceLevel: [{ type: Number, default: [] }],
    visibility: {
      type: Boolean,
      default: true,
    },
    jobDuration: {
      type: String,
      default: 'short-term',
    },
    appliedFreelancers: [{ type: String, default: [] }],
    blockFreelancers: [{ type: String, default: [] }],
    proposalNotifyMail: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const jobCategorySchema = new mongoose.Schema<IJobCategory, IJobCategoryModel>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

const jobTagSchema = new mongoose.Schema<IJobTag, IJobTagModel>({
  name: {
    type: String,
    required: true,
    index: true,
  },
})

// add plugin that converts mongoose to json
jobSchema.plugin(toJSON)
jobSchema.plugin(paginate)

jobSchema.index({ title: 'text' })

// add plugin that converts mongoose to json
jobTagSchema.plugin(toJSON)
jobTagSchema.plugin(paginate)

/**
 * Check if tag name is taken
 * @param {string} name
 * @returns {Promise<boolean>}
 */
jobTagSchema.static('isNameTaken', async function (name: string): Promise<boolean> {
  const skill = await this.findOne({ name })
  return !!skill
})

// add plugin that converts mongoose to json
jobCategorySchema.plugin(toJSON)
jobCategorySchema.plugin(paginate)

/**
 * Check if tag name is taken
 * @param {string} name
 * @returns {Promise<boolean>}
 */
jobCategorySchema.static('isNameTaken', async function (name: string): Promise<boolean> {
  const skill = await this.findOne({ name })
  return !!skill
})

/**
 * Check if email is taken
 * @param {string} email - The job's email
 * @param {ObjectId} [excludeJobId] - The id of the job to be excluded
 * @returns {Promise<boolean>}
 */

jobSchema.pre('save', function (done) {
  if (this.isModified('status')) {
    const status = this.get('status').at(-1)?.status
    this.set('currentStatus', status)
  }
  done()
})

const Job = mongoose.model<IJobDoc, IJobModel>('Job', jobSchema)

export const JobCategory = mongoose.model<IJobCategory, IJobCategoryModel>('JobCategory', jobCategorySchema)
export const JobTag = mongoose.model<IJobTag, IJobTagModel>('JobTag', jobTagSchema)

export default Job
