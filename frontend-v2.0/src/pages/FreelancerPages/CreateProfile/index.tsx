import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CreateProfileAside from 'src/Components/FreelancerComponents/CreateProfileAside'
import { freelancerStore, userStore } from 'src/Store/user.store'
import { createSubscription, useSubscription } from 'src/libs/global-state-hook'
import { IFreelancer } from 'src/types/freelancer'
import { IUser } from 'src/types/user'

export enum EStep {
  START = 0,
  CATEGORY = 1,
  EXPERTISELEVEL = 2,
  EDUANDEMP = 3,
  LANGUAGE = 4,
  HOURLYRATE = 5,
  TITLEANDOVERVIEW = 6,
  PROFILEPHOTO = 7,
  LOCATION = 8,
  PHONENUMBER = 9,
  SUBMIT = 10,
}

// Import components dynamically
const components = {
  [EStep.START]: () => import('Components/FreelancerComponents/CreateProfileGetStart'),
  [EStep.CATEGORY]: () => import('Components/FreelancerComponents/CreateProfileCategory'),
  [EStep.EXPERTISELEVEL]: () => import('Components/FreelancerComponents/CreateProfileExpertiseLevel'),
  [EStep.EDUANDEMP]: () => import('Components/FreelancerComponents/CreateProfileEducationAndEmployment'),
  [EStep.LANGUAGE]: () => import('Components/FreelancerComponents/CreateProfileLanguage'),
  [EStep.HOURLYRATE]: () => import('Components/FreelancerComponents/CreateProfileHourlyRate'),
  [EStep.TITLEANDOVERVIEW]: () => import('Components/FreelancerComponents/CreateProfileTitleAndOverview'),
  [EStep.PROFILEPHOTO]: () => import('Components/FreelancerComponents/CreateProfilePhoto'),
  [EStep.LOCATION]: () => import('Components/FreelancerComponents/CreateProfileLocation'),
  [EStep.PHONENUMBER]: () => import('Components/FreelancerComponents/CreateProfilePhoneNumber'),
  [EStep.SUBMIT]: () => import('Components/FreelancerComponents/CreateProfileSubmit'),
}

export const profileStepStore = createSubscription<{ step: EStep }>({ step: EStep.START || 0 })
export const profileFreelancerData = createSubscription<IFreelancer>({} as IFreelancer)
export const userData = createSubscription<IUser>({} as IUser)

export default function CreateProfile() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isReview = searchParams.get('isReview')

  const profileStep = useSubscription(profileStepStore).state
  const profilesetStep = useSubscription(profileStepStore).setState
  const setState = useSubscription(profileFreelancerData).setState
  const setStateUser = useSubscription(userData).setState
  const currentFreelancerData = useSubscription(freelancerStore).state
  const currentUserData = useSubscription(userStore).state

  const DynamicComponent = components[profileStep.step]
  const [Component, setComponent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    if (isReview === 'true') {
      profilesetStep({ step: EStep.SUBMIT })
    }
    console.log('current profile', currentFreelancerData)
    setState(currentFreelancerData)
    setStateUser(currentUserData)
  }, [currentFreelancerData?._id, currentUserData?._id, isReview])

  useEffect(() => {
    console.log(profileStep.step)
    const loadComponent = async () => {
      const dynamicComponent = await DynamicComponent()
      setComponent(() => dynamicComponent.default)
    }

    loadComponent()
  }, [DynamicComponent])

  return (
    <section className="p-4" style={{ backgroundColor: '#F1F2F4' }}>
      <div className="container">
        <div className="row">
          {profileStep.step !== EStep.SUBMIT && (
            <div className="col-lg-3">
              <CreateProfileAside profileStep={profilesetStep} step={profileStep.step} />
            </div>
          )}
          <div className={profileStep.step === EStep.SUBMIT ? 'col-lg-12' : 'col-lg-9'}>
            {Component && <Component />}
          </div>
        </div>
      </div>
    </section>
  )
}
