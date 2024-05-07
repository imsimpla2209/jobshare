import { EStatus, EPaymenType } from 'common/enums'
import mongoose from 'mongoose'
import paginate from '../../providers/paginate/paginate'
import toJSON from '../../common/toJSON/toJSON'
import { IContractDoc, IContractEmployee, IContractEmployeeModel, IContractModel } from './contract.interfaces'

const contractSchema = new mongoose.Schema<IContractDoc, IContractModel>(
  {
    job: { type: mongoose.Types.ObjectId, ref: 'Job' },
    proposal: { type: mongoose.Types.ObjectId, ref: 'Proposal' },
    freelancer: { type: mongoose.Types.ObjectId, ref: 'Freelancer' },
    client: { type: mongoose.Types.ObjectId, ref: 'Client' },
    overview: {
      type: String,
      default: 'Nothing :))',
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentType: {
      type: String,
      enum: EPaymenType,
      default: EPaymenType.WHENDONE,
    },
    agreeAmount: {
      type: Number,
      required: false,
    },
    catalogs: [{ type: String, required: 'false', default: [] }],
    attachments: [{ type: String, required: 'false', default: [] }],
    paymentHistory: [{ type: mongoose.Types.ObjectId, ref: 'PaymentHistory', default: [] }],
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

const contractEmployeeSchema = new mongoose.Schema<IContractEmployee, IContractEmployeeModel>(
  {
    freelancer: { type: mongoose.Types.ObjectId, ref: 'Freelancer' },
    contract: { type: mongoose.Types.ObjectId, ref: 'Contract' },
    endDate: {
      type: String,
      default: '',
    },
    status: {
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
contractSchema.plugin(toJSON)
contractSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The contract's email
 * @param {ObjectId} [excludeContractId] - The id of the contract to be excluded
 * @returns {Promise<boolean>}
 */

contractSchema.pre('save', async function (next) {
  if (this.isModified('status')) {
    const status = this.get('status').at(-1)?.status
    this.set('currentStatus', status)
  }
  next()
})

const Contract = mongoose.model<IContractDoc, IContractModel>('Contract', contractSchema)

export const ContractEmployee = mongoose.model<IContractEmployee, IContractEmployeeModel>(
  'ContractEmployee',
  contractEmployeeSchema
)

export default Contract
