import mongoose from 'mongoose'
import { EInvitationType, EStatus } from 'common/enums'
import toJSON from '../../common/toJSON/toJSON'
import paginate from '../../providers/paginate/paginate'
import { IInvitationDoc, IInvitationModel, INotifyDoc, INotifyModel } from './notify.interfaces'

const notifySchema = new mongoose.Schema<INotifyDoc, INotifyModel>(
  {
    to: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
    path: { type: String, default: '' },
    attachedId: { type: String, default: '' },
    seen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    content: {
      type: Object,
      required: true,
    },
    image: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

const invitationSchema = new mongoose.Schema<IInvitationDoc, IInvitationModel>(
  {
    to: { type: mongoose.Types.ObjectId, ref: 'User' },
    from: { type: mongoose.Types.ObjectId, ref: 'User' },
    content: {
      type: Object,
      required: true,
    },
    seen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    type: {
      type: String,
      enum: EInvitationType,
      default: EInvitationType.CONTRACT,
    },
    background: {
      type: String,
      default: '',
    },
    attachments: [
      {
        type: String,
        default: '',
      },
    ],
    dueDate: {
      type: String,
      default: '0',
    },
    image: {
      type: String,
      default: '',
    },
    status: [
      {
        type: {
          status: {
            type: String,
            enum: EStatus,
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
          status: EStatus.PENDING,
          comment: '',
        },
      },
    ],
    currentStatus: {
      type: String,
      enum: EStatus,
      default: EStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
notifySchema.plugin(toJSON)
notifySchema.plugin(paginate)

// // add plugin that converts mongoose to json
invitationSchema.plugin(toJSON)
invitationSchema.plugin(paginate)

notifySchema.pre('save', async function (next) {
  // const notify = this
  // const user = await getUserById(notify.user)
  // if (!user.isVerified) {
  //   throw new Error(`User is not verified`)
  // }
  next()
})

invitationSchema.pre('save', async function (next) {
  if (this.isModified('status')) {
    const status = this.get('status')?.at(-1)?.status
    this.set('currentStatus', status)
  }
  next()
})

const Notify = mongoose.model<INotifyDoc, INotifyModel>('Notify', notifySchema)

export const Invitation = mongoose.model<IInvitationDoc, IInvitationModel>('Invitation', invitationSchema)

export default Notify
