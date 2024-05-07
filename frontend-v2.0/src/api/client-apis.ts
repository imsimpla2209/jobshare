import { NewRegisteredClient, IQueryParams, IUpdateClientBody } from "src/types/client";
import { Http, instance } from "./http";
import { IReview, filterFreelancersQuery } from "src/types/freelancer";

export const registerAsClient = (data: NewRegisteredClient) => {
  return instance.post('clients', data);
}

export const getClients = (data: IQueryParams ) => {
  return Http.get('clients', data);
}

export const getClientByOptions = (data: any ) => {
  return Http.get('clients/get-by-options', data);
}

export const getRcmdClients = (data?: any ) => {
  return Http.get('clients/rcmd/top', data);
}


export const verifyClient = (id: string ) => {
  return instance.patch(`clients/verify-profile/${id}`);
}

export const searchClients = (data: {searchText: string}, query: filterFreelancersQuery ) => {
  return Http.post('clients/search', data, query);
}

export const getClient = (id: string ) => {
  return instance.get(`clients/${id}`);
}

export const updateClient = (data: IUpdateClientBody, id: string ) => {
  return instance.patch(`clients/${id}`, data);
}

export const deleteClient = (id: string) => {
  return instance.delete(`clients/${id}`);
}

export const reviewClient = (data: IReview, id: string ) => {
  return instance.patch(`clients/review/${id}`, data);
}

export const forcedDeleteClient = (id: string) => {
  return instance.delete(`clients/admin/${id}`);
}