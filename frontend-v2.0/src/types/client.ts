import { IReview } from "./freelancer";

export interface NewRegisteredClient {
  user: string;
  intro?: string;
  name: string;
  organization?: string;
  preferencesURL?: string[];
  preferLocations?: string[];
  preferJobType?: string[];
  favoriteFreelancers?: string[];
}

export interface IQueryParams {
  name?: string;
  rating?: {
    from?: number;
    to?: number;
  };
  sortBy?: string;
  projectBy?: string;
  limit?: number;
  page?: number;
}

export interface IUpdateClientBody {
  intro?: string;
  name?: string;
  organization?: string;
  preferencesURL?: string[];
  preferLocations?: string[];
  preferJobType?: string[];
  favoriteFreelancers?: string[];
}

export interface IClient {
  id?: string;
  _id?: string;
  user: string
  name?: any
  intro?: string
  rating?: number
  jobs?: string[]
  organization?: string
  reviews?: IReview[]
  images?: string[]
  preferencesURL?: string[]
  preferLocations?: string[]
  preferJobType?: string[]
  favoriteFreelancers?: string[]
  paymentVerified?: boolean
  spent?: number
}
