import { IReview } from 'common/interfaces/subInterfaces'
import mongoose from 'mongoose'
import toJSON from '../../common/toJSON/toJSON'
import paginate from '../../providers/paginate/paginate'
import { IClientDoc, IClientModel } from './client.interfaces'

const clientSchema = new mongoose.Schema<IClientDoc, IClientModel>(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    intro: {
      type: String,
      default: 'Nothing :))',
    },
    rating: {
      type: Number,
      index: true,
      default: 0,
    },
    jobs: [{ type: mongoose.Types.ObjectId, required: 'false', ref: 'Job', default: [] }],
    organization: [{ type: mongoose.Types.ObjectId, required: 'false', ref: 'Organization', default: [] }],
    images: [{ type: String, required: 'false', default: [] }],
    reviews: [{ type: {} as IReview, default: [] }],
    preferJobType: [{ type: mongoose.Types.ObjectId, ref: 'JobCategory', default: [] }],
    findingSkills: [{ type: mongoose.Types.ObjectId, ref: 'Skill', default: [] }],
    preferLocations: [{ type: String, required: 'false', default: [] }],
    preferencesURL: [{ type: String, required: 'false', default: [] }],
    paymentVerified: { type: Boolean, default: false },
    favoriteFreelancers: [{ type: mongoose.Types.ObjectId, required: 'false', ref: 'Freelancer', default: [] }],
    spent: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
clientSchema.plugin(toJSON)
clientSchema.plugin(paginate)

clientSchema.index({ name: 'text' })

/**
 * Check if email is taken
 * @param {string} email - The client's email
 * @param {ObjectId} [excludeClientId] - The id of the client to be excluded
 * @returns {Promise<boolean>}
 */
clientSchema.static('isUserSigned', async function (user_id: mongoose.Types.ObjectId): Promise<boolean> {
  const user = await this.findOne({ user: user_id })
  return !!user
})

clientSchema.pre('save', async function (done) {
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

const Client = mongoose.model<IClientDoc, IClientModel>('Client', clientSchema)

export default Client
