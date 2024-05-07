import { EMessagePurpose, EMessageType, ERoomType, EStatus } from 'common/enums'
import mongoose from 'mongoose'
import paginate from '../../providers/paginate/paginate'
import toJSON from '../../common/toJSON/toJSON'
import { IMessageDoc, IMessageRoom, IMessageRoomModel, IMessageModel, IMessageRoomDoc } from './message.interfaces'

const messageSchema = new mongoose.Schema<IMessageDoc, IMessageModel>(
  {
    from: { type: mongoose.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Types.ObjectId, ref: 'User' },
    room: { type: mongoose.Types.ObjectId, ref: 'MessageRoom' },
    seen: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    content: {
      type: String,
      required: true,
    },
    other: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: EMessageType,
      default: EMessageType.Normal,
    },
    attachments: [{ type: String, required: 'false', default: [] }],
  },
  {
    timestamps: true,
  }
)

const messageRoomSchema = new mongoose.Schema<IMessageRoomDoc, IMessageRoomModel>(
  {
    isDeleted: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    proposal: { type: mongoose.Types.ObjectId, ref: 'Proposal' },
    member: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    proposalStatusCatalog: [{ type: String, required: 'false', default: [] }],
    purpose: {
      type: String,
      enum: EMessagePurpose,
      default: EMessagePurpose.Proposal,
    },
    type: {
      type: String,
      enum: ERoomType,
      default: ERoomType.Single,
    },
    background: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    attachments: [{ type: String, required: 'false', default: [] }],
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
          status: EStatus.INPROGRESS,
          comment: '',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON)
messageSchema.plugin(paginate)

// add plugin that converts mongoose to json
messageRoomSchema.plugin(toJSON)
messageRoomSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The message's email
 * @param {ObjectId} [excludeMessageId] - The id of the message to be excluded
 * @returns {Promise<boolean>}
 */

messageSchema.pre('save', async function (next) {
  // const message = this
  // const user = await getUserById(message.user)
  // if (!user.isVerified) {
  //   throw new Error(`User is not verified`)
  // }
  next()
})

const Message = mongoose.model<IMessageDoc, IMessageModel>('Message', messageSchema)

export const MessageRoom = mongoose.model<IMessageRoom, IMessageRoomModel>('MessageRoom', messageRoomSchema)

export default Message
