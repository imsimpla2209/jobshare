import { appInfo } from './commom.store';
import { createSubscription } from 'libs/global-state-hook'
export interface ISkill {
  name: string
  name_vi: string
  category: string
  isDeleted: boolean
}

export enum EAppStatus {
  Normal = 'Normal',
  Maintenance = 'Maintenance',
  Limited = 'Limited',
}

export interface IApp {
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

export const locationStore = createSubscription<{ name: string; code: string }[]>([])

export const skillStore = createSubscription([])
export const categoryStore = createSubscription([])
export const appInfoStore = createSubscription<IApp>({} as IApp)
