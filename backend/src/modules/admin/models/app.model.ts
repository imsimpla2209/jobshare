import { Document, Model, Schema, Types, model } from 'mongoose'

export enum EAppStatus {
    Normal = 'Normal',
    Maintenance = 'Maintenance',
    Limited = 'Limited',
}

export interface IApp extends Document {
    status: EAppStatus,
    freelancerSicks: {
        proposalCost: number,
        withdrawReturn: number,
        updateProposalCost: number,
        assistantCost: number,
        inviteMsg: number,
    },
    clientSicks: {
        postJob: number,
        updateJob: number,
        createContract: number,
        deleteJob: number,
        inviteMsg: number,
    },
    pointsCost: number,

}

const appSchema = new Schema<IApp>(
    {
        status: { type: String, default: EAppStatus.Normal },
        freelancerSicks: {
            type: {
                proposalCost: { type: Number, default: 2 },
                withdrawReturn: { type: Number, default: 1 },
                updateProposalCost: { type: Number, default: 1 },
                assistantCost: { type: Number, default: 15 },
                inviteMsg: { type: Number, default: 2 },
            }, default: {
                proposalCost: 2,
                withdrawReturn: 1,
                updateProposalCost: 1,
                assistantCost: 15,
                inviteMsg: 2,
            }
        },
        clientSicks: {
            type: {
                postJob: { type: Number, default: 6 },
                updateJob: { type: Number, default: 5 },
                createContract: { type: Number, default: 4 },
                deleteJob: { type: Number, default: 4 },
                inviteMsg: { type: Number, default: 2 },
            }, default: {
                postJob: 6,
                updateJob: 5,
                createContract: 4,
                deleteJob: 4,
                inviteMsg: 2,
            },
        },
        pointsCost: { type: Number, default: 5000 },
    },
    { timestamps: { createdAt: true, updatedAt: true } }
)

const App: Model<IApp> = model<IApp>('App', appSchema)

export default App
