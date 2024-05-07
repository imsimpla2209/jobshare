import { useState } from 'react'
import SignupForm from 'src/Components/BeforeLoginComponents/Signup Form'
import SignUpSecondForm from 'src/Components/BeforeLoginComponents/Signup Second Form'
import LoginHeader from '../../../Components/BeforeLoginComponents/LoginHeader'
import SignupFooter from '../../../Components/BeforeLoginComponents/SignupFooter'
import { IUser } from 'src/types/user'
import { register, sendVerifyEmail } from 'src/api/auth-apis'
import { useAuth } from 'src/Components/Providers/AuthProvider'
import { EUserType } from 'src/utils/enum'
import { registerAsFreelancer } from 'src/api/freelancer-apis'
import { registerAsClient } from 'src/api/client-apis'
import { useNavigate } from 'react-router-dom'
import FreelancerRegisterModal from 'src/Components/BeforeLoginComponents/FreelancerRegisterModal'
import ClientRegisterModal from 'src/Components/BeforeLoginComponents/ClientRegisterModal'
import toast from 'react-hot-toast'

export enum ESignupStep {
  INITIAL = 0,
  DETAIL = 1,
  INFO = 2,
}

export default function SignUp() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<ESignupStep>(ESignupStep.INITIAL)
  const [errorMessage, setErrorMessage] = useState('')
  const [workInfo, setWorkInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<
    Omit<
      IUser,
      | 'role'
      | 'isEmailVerified'
      | 'provider'
      | 'oAuth'
      | 'paymentInfo'
      | 'isVerified'
      | 'isActive'
      | 'balance'
      | 'refreshToken'
      | 'jobsPoints'
      | 'token'
    >
  >({
    name: '',
    username: '',
    email: '',
    // phone: "",
    images: [],
    lastLoginAs: '',
  })

  const signUpComplete = async () => {
    await register(userInfo)
      .then(async res => {
        if (res.data?.user) {
          localStorage.setItem('userType', userInfo.lastLoginAs)
          if (userInfo.lastLoginAs === EUserType.FREELANCER) {
            await registerAsFreelancer({
              user: res.data?.user?.id,
              name: userInfo.name,
              ...workInfo,
            })
          } else if (userInfo.lastLoginAs === EUserType.CLIENT) {
            await registerAsClient({
              user: res.data?.user?.id,
              name: userInfo.name,
              ...workInfo,
            })
          }
          return res
        }
      })
      .then(res => {
        // sendVerifyEmail();
        login(res.data?.tokens.token, res.data?.user)
        localStorage.setItem('userType', userInfo?.lastLoginAs || 'Freelancer')
        userInfo?.lastLoginAs === 'Freelancer' ? navigate('/find-work') : navigate('/home')
        toast.success('Welcome, mah bro')
        // navigate("/sign-up/please-verify");
      })
      .catch(err => {
        toast.error(err?.responseBody?.message)
        setErrorMessage(err.message)
        console.log(err.message)
      })
  }

  const onEmail = (email: string) => {
    setUserInfo({ ...userInfo, email })
  }

  const onUserTypeChange = type => {
    setUserInfo({ ...userInfo, lastLoginAs: type })
    setStep(ESignupStep.INFO)
  }

  const onCloseInfoForm = () => {
    setStep(ESignupStep.DETAIL)
  }

  return (
    <div style={{ height: '100vh' }}>
      <LoginHeader />
      <div className="container-fluid bg-jobsicker-dark mb-auto" style={{ padding: '20vh' }}>
        <div className="row">
          {step === ESignupStep.INITIAL ? (
            <SignupForm
              setEmail={onEmail}
              email={userInfo.email}
              setStep={setStep}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          ) : (
            <SignUpSecondForm
              goBack={() => setStep(ESignupStep.INITIAL)}
              usr={userInfo}
              setuser={setUserInfo}
              signUpComplete={signUpComplete}
              errorMessage={errorMessage}
              onUserTypeChange={onUserTypeChange}
            />
          )}
          {userInfo.lastLoginAs === 'Freelancer' ? (
            <FreelancerRegisterModal
              isOpen={step === ESignupStep.INFO}
              onClose={onCloseInfoForm}
              setWorkInfo={setWorkInfo}
              workInfo={workInfo}
            />
          ) : (
            <ClientRegisterModal
              isOpen={step === ESignupStep.INFO}
              onClose={onCloseInfoForm}
              setWorkInfo={setWorkInfo}
              workInfo={workInfo}
            />
          )}
        </div>
      </div>
      <SignupFooter />
    </div>
  )
}
