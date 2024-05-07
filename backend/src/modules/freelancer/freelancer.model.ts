import { ILevelSkill } from '@modules/skill/skill.interfaces'
import { EComplexity, ELevel, EPaymenType } from 'common/enums'
import { IReview } from 'common/interfaces/subInterfaces'
import mongoose from 'mongoose'
import toJSON from '../../common/toJSON/toJSON'
import paginate from '../../providers/paginate/paginate'
import { IFreelancerDoc, IFreelancerModel, ISimilarFreelancer, ISimilarFreelancerModel } from './freelancer.interfaces'

const freelancerSchema = new mongoose.Schema<IFreelancerDoc, IFreelancerModel>(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    intro: {
      type: String,
      default: 'Nothing :))',
    },
    title: {
      type: String,
      default: 'Nothing :))',
    },
    name: {
      type: String,
    },
    members: [{ type: mongoose.Types.ObjectId, ref: 'User', default: [] }],
    // tests: [{ type: String, ref: 'TestResult', default: [] }],
    skills: [
      {
        type: {
          skill: {
            type: mongoose.Types.ObjectId,
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
    favoriteJobs: [{ type: mongoose.Types.ObjectId, ref: 'Job', default: [] }],
    jobs: [{ type: mongoose.Types.ObjectId, ref: 'Job', default: [] }],
    relevantClients: [{ type: mongoose.Types.ObjectId, ref: 'Client', default: [] }],
    favoriteClients: [{ type: mongoose.Types.ObjectId, ref: 'Client', default: [] }],
    jobsDone: {
      type: {
        number: {
          type: Number,
          default: 0,
        },
        success: {
          type: Number,
          default: 0,
        },
      },
      default: { number: 0, success: 0 },
    },
    certificate: {
      type: String,
      default: 'Nothing :))',
    },
    rating: {
      type: Number,
      default: 0,
    },
    earned: {
      type: Number,
      default: 0,
    },
    isProfileVerified: {
      type: Boolean,
      default: false,
    },
    isSubmitProfile: {
      type: Boolean,
      default: false,
    },
    proposals: [{ type: mongoose.Types.ObjectId, ref: 'Proposal', default: [] }],
    expertiseLevel: { type: Number, enum: EComplexity, default: EComplexity.EASY },
    expectedAmount: { type: Number, default: 0 },
    expectedPaymentType: { type: String, enum: EPaymenType, default: EPaymenType.PERHOURS },
    images: [{ type: String, required: 'false', default: [] }],
    reviews: [{ type: {} as IReview, default: [] }],
    preferJobType: [{ type: mongoose.Types.ObjectId, ref: 'JobCategory', default: [] }],
    currentLocations: [{ type: String, required: 'false', default: [] }],
    preferencesURL: [{ type: String, required: 'false', default: [] }],
    available: { type: Boolean, default: true },
    education: { type: Object, default: {} },
    historyWork: { type: Object, default: {} },
    englishProficiency: { type: String, default: '' },
    otherLanguages: [{ type: String, default: {} }],
    profileCompletion: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

const similarFreelancerSchema = new mongoose.Schema<ISimilarFreelancer, ISimilarFreelancerModel>({
  freelancer: { type: mongoose.Types.ObjectId, ref: 'Freelancer' },
  similarKeys: { type: String, default: '' },
  similarJobCats: [{ type: String, required: 'false', default: [] }],
  similarLocations: [{ type: String, required: 'false', default: [] }],
  similarSkills: [{ type: String, required: 'false', default: [] }],
  potentialJobCats: [{ type: String, required: 'false', default: [] }],
  potentialSkills: [{ type: String, required: 'false', default: [] }],
  similarTags: [{ type: String, required: 'false', default: [] }],
  similarClients: [{ type: String, required: 'false', default: [] }],
})

// add plugin that converts mongoose to json
freelancerSchema.plugin(toJSON)
freelancerSchema.plugin(paginate)

freelancerSchema.index({ name: 'text' })

freelancerSchema.virtual('nOProposals').get(function () {
  return this.proposals.length
})

freelancerSchema.pre('save', async function (done) {
  if (this.isModified('reviews')) {
    const reviews = await this.get('reviews')
    let newRating = 0
    if (reviews?.length) {
      const totalRating = reviews.reduce((accumulator, currentValue) => accumulator + currentValue?.rating || 0, 0)
      newRating = totalRating / reviews?.length
    }
    this.set('rating', newRating)
  }
  done()
})

const Freelancer = mongoose.model<IFreelancerDoc, IFreelancerModel>('Freelancer', freelancerSchema)
export const SimilarFreelancer = mongoose.model<ISimilarFreelancer, ISimilarFreelancerModel>(
  'SimilarFreelancer',
  similarFreelancerSchema
)

export default Freelancer
