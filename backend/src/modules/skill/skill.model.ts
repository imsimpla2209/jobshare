import mongoose from 'mongoose'
import paginate from '../../providers/paginate/paginate'
import toJSON from '../../common/toJSON/toJSON'
import { ISkillDoc, ISkillModel } from './skill.interfaces'

const skillSchema = new mongoose.Schema<ISkillDoc, ISkillModel>(
  {
    name: {
      type: String,
      required: true,
    },
    name_vi: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
skillSchema.plugin(toJSON)
skillSchema.plugin(paginate)

/**
 * Check if skill name is taken
 * @param {string} name
 * @returns {Promise<boolean>}
 */
skillSchema.static('isNameTaken', async function (name: string): Promise<boolean> {
  const skill = await this.findOne({ name })
  return !!skill
})

skillSchema.pre('deleteOne', async function (next) {
  // const job = this
  // const user = await getUserById(skill.user)
  // if (!user.isVerified) {
  //   throw new Error(`User is not verified`)
  // }
  next()
})

const Skill = mongoose.model<ISkillDoc, ISkillModel>('Skill', skillSchema)

export default Skill
