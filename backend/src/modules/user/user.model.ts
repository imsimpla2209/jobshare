import * as bcrypt from 'bcrypt'
import { ESex, EUserType } from 'common/enums'
import mongoose from 'mongoose'
import validator from 'validator'
import { roles } from '../../config/roles'
import paginate from '../../providers/paginate/paginate'
import toJSON from '../../common/toJSON/toJSON'
import { IOAuth, IUserDoc, IUserModel } from './user.interfaces'

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number')
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    oAuth: {
      type: Object as unknown as IOAuth,
      default: {
        google: {},
        facebook: {},
      },
    },
    refreshToken: {
      type: String,
      private: true,
    },
    paymentInfo: [
      {
        type: {
          bankName: {
            type: String,
          },
          bankAccNumber: {
            type: String,
          },
          bankAccType: {
            type: String,
          },
          routingNumber: {
            type: String,
          },
          branchName: {
            type: String,
          },
          isPrimary: {
            type: Boolean,
          },
          createdAt: {
            type: Date,
          },
        },
        default: [],
      },
    ],
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    balance: {
      type: Number,
      required: false,
      default: 0,
    },
    lastLoginAs: {
      type: String,
      enum: EUserType,
      required: false,
    },
    sex: {
      type: Number,
      enum: ESex,
      default: ESex.UNKNOWN,
      required: false,
    },
    jobsPoints: {
      type: Number,
      required: false,
      default: 20,
    },
    posts: [
      {
        type: String,
        required: false,
        default: [],
      },
    ],
    comments: [
      {
        type: String,
        required: false,
        default: [],
      },
    ],
    avatar: {
      type: String,
      required: false,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
userSchema.plugin(toJSON)
userSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
})

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this
  return bcrypt.compare(password, user.password)
})

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)

export default User
