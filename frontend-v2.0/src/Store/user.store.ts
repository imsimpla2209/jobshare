import { createSubscription } from 'libs/global-state-hook'
import { IClient } from 'src/types/client'
import { IFreelancer } from 'src/types/freelancer'
import { IUser } from 'src/types/user'

export const userStore = createSubscription<IUser>({
  id: '',
  _id: '',
  name: '',
  username: '',
  email: '',
  phone: '',
  nationalId: '',
  role: '',
  isEmailVerified: false,
  oAuth: {},
  avatar: '',
  images: [],
  dob: null,
  address: '',
  isVerified: false,
  isActive: false,
  balance: 0,
  lastLoginAs: '',
  jobsPoints: 0,
  token: '',
})

export const freelancerStore = createSubscription<IFreelancer>({
  _id: '',
  id: '',
  user: '',
  name: '',
  intro: '',
  members: [],
  // tests: ITestDoc['_id'][]
  skills: [],
  certificate: '',
  proposals: [],
  images: [],
  reviews: [],
  favoriteJobs: [],
  preferJobType: [],
  currentLocations: [],
  preferencesURL: [],
  rating: 0,
  expertiseLevel: 0,
  jobsDone: { number: 0, success: 0 },
  earned: 0,
  available: false,
})

export const clientStore = createSubscription<IClient>({
  _id: '',
  id: '',
  user: '',
  name: '',
  intro: '',
  organization: '',
  // tests: ITestDoc['_id'][]
  images: [],
  reviews: [],
  favoriteFreelancers: [],
  preferJobType: [],
  preferLocations: [],
  preferencesURL: [],
  rating: 0,
  jobs: [],
  spent: 0,
  paymentVerified: false,
})

window.clientStore = clientStore
window.userStore = userStore
window.freelancerStore = freelancerStore
