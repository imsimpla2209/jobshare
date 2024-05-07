/* eslint-disable import/no-cycle */
import { Document, Schema, model, Model, Types } from 'mongoose'
import { IUserDoc } from '@modules/user/user.interfaces'
import { IPost } from './Post'

export interface IComment extends Document {
  userId: IUserDoc['_id']
  postId: IPost['_id']
  content: string
  date: Date
  like?: number
  dislike?: Number
  isAnonymous?: boolean
}

const commentSchema: Schema = new Schema<IComment>({
  userId: { type: Types.ObjectId, ref: 'User' },
  postId: { type: Types.ObjectId, ref: 'Post' },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  like: { type: Number, default: 0, required: false },
  dislike: { type: Number, default: 0, required: false },
  isAnonymous: { type: Boolean, default: false, required: false },
})

const Comment: Model<IComment> = model<IComment>('Comment', commentSchema)

export default Comment
