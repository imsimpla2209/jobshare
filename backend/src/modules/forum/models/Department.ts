import { IUserDoc } from '@modules/user/user.interfaces'
import { Document, Schema, model, Model, Types } from 'mongoose'

export interface IDepartment extends Document {
  name: string
  users: IUserDoc['_id'][]
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: String,
    users: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const Department: Model<IDepartment> = model<IDepartment>('Department', departmentSchema)

export default Department
