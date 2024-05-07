import { IContract, IContractQuery } from "src/types/contract";
import { Http, instance } from "./http";
import { EStatus } from "src/utils/enum";

export const createContract = (data?: Omit<
  IContract,
  'status' | 'messages' | 'paymentHistory' | 'currentStatus'
>, isAgree: boolean = false) => {
  return instance.post('contracts', { ...data, isAgree });
}

export const acceptStatusContract = (id: string, statusData: {
  status: EStatus
  comment: string
}) => {
  return instance.post(`contracts/status/${id}`, statusData);
}

export const acceptContract = (id: string, invitationId) => {
  return Http.get(`contracts/accept/${id}`, { invitationId });
}

export const rejectContract = (id: string, invitationId) => {
  return Http.get(`contracts/reject/${id}`, { invitationId });
}

export const getContracts = (data: IContractQuery) => {
  return Http.get('contracts', data);
}

export const getContract = (id: string) => {
  return instance.get(`contracts/${id}`);
}

export const updateContract = (data: Omit<IContract, 'freelancer' | 'job'>, id: string) => {
  return instance.patch(`contracts/${id}`, data);
}

export const deleteContract = (id: string) => {
  return instance.delete(`contracts/${id}`);
}

export const forcedDeleteContract = (id: string) => {
  return instance.delete(`contracts/admin/${id}`);
}