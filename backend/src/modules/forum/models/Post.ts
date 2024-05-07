/* eslint-disable import/no-cycle */
import { IJobCategory } from '@modules/job/job.interfaces'
import { IUserDoc } from '@modules/user/user.interfaces'
import { Document, Model, Schema, Types, model } from 'mongoose'
import { IComment } from './Comment'
import { ISpecialEvent } from './SpecialEvent'

export interface IPostMeta extends Document {
  likesCount: number
  views: number
  dislikesCount: number
}

export interface IPost extends Document {
  publisherId: IUserDoc['_id']
  categories?: IJobCategory['_id'][]
  title: string
  content: string
  files?: string[]
  meta?: IPostMeta
  likes?: IUserDoc['_id'][]
  dislikes?: IUserDoc['_id'][]
  comments?: IComment['_id'][]
  createdAt?: Date
  specialEvent: ISpecialEvent['_id']
  isAnonymous?: boolean
}

const postSchema = new Schema<IPost>(
  {
    publisherId: { type: Types.ObjectId, ref: 'User' },
    categories: [{ type: Types.ObjectId, ref: 'Category' }],
    title: String,
    content: String,
    files: Array<string>,
    meta: {
      views: { type: Number, default: 0 },
      dislikesCount: { type: Number, default: 0 },
      likesCount: { type: Number, default: 0 },
    },
    likes: [{ type: Types.ObjectId, ref: 'User', default: [] }],
    dislikes: [{ type: Types.ObjectId, ref: 'User', default: [] }],
    comments: [{ type: Types.ObjectId, ref: 'Comment', default: [] }],
    createdAt: { type: Date, default: Date.now },
    specialEvent: { type: Types.ObjectId, ref: 'SpecialEvent', required: false },
    isAnonymous: { type: Boolean, default: false, required: false },
  },
  { timestamps: { updatedAt: true } }
)

postSchema.pre('save', async function (done) {
  if (this.isModified('likes') || this.isModified('dislikes')) {
    const likesCounter = await this.get('likes')
    this.set('meta.likesCount', likesCounter.length)
    const disLikesCounter = await this.get('dislikes')
    this.set('meta.dislikesCount', disLikesCounter.length)
  }
  done()
})

const Post: Model<IPost> = model<IPost>('Post', postSchema)

export default Post
