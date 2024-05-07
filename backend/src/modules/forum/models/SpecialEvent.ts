/* eslint-disable import/no-cycle */
import { Document, Schema, model, Model, Types } from 'mongoose'
import { IPost } from './Post'

export interface ISpecialEvent extends Document {
  title: string
  description?: string
  startDate: Date
  firstCloseDate: Date
  finalCloseDate: Date
  posts?: IPost['_id'][]
  departments?: string[]
  categories?: string[]
}

const eventSchema = new Schema<ISpecialEvent>(
  {
    title: String,
    description: String,
    startDate: Date,
    firstCloseDate: Date,
    finalCloseDate: Date,
    posts: [{ type: Types.ObjectId, ref: 'Post' }],
    departments: Array<String>,
    categories: Array<String>,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const SpecialEvent: Model<ISpecialEvent> = model<ISpecialEvent>('SpecialEvent', eventSchema)

export default SpecialEvent
