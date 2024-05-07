import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import OtpInput from 'src/Components/CommonComponents/input/OTPInput'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import { userStore } from 'src/Store/user.store'
import { sendVerifySMS, verifySMS } from 'src/api/auth-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { EStep, profileFreelancerData, profileStepStore, userData } from 'src/pages/FreelancerPages/CreateProfile'

export default function CreateProfilePhoneNumber() {
  const [isVerified, setVerify] = useState(false)
  const [isSentSMS, onSentSMS] = useState(false)
  const [msg, setMSG] = useState({ type: '', message: '' })
  const [validate, setValidate] = useState<any>('')
  const profileStep = useSubscription(profileStepStore).setState
  const { setState, state } = useSubscription(profileFreelancerData)
  const { setState: setUser, state: user } = useSubscription(userData)
  const [value, setValue] = useState(user?.phone || '')
  const [otp, setOtp] = useState<any>('')

  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation(['main'])

  const setNumber = (phone: any) => {
    if (isSentSMS) {
      onSentSMS(false)
    }
    setValue(phone)
    setValidate(phone?.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g) ? t('Please inter Valid Phone') : null)
  }

  const getNumber = () => {
    console.log(value)
    setUser({ ...user, phone: value })
    setState({ ...state, profileCompletion: 100 })
    profileStep({ step: EStep.SUBMIT })
  }

  const sentVerifyNumber = () => {
    try {
      onSentSMS(true)
      setLoading(true)
      sendVerifySMS(value)
        .then(res => {
          if (res.data) {
          }
        })
        .catch(err => {
          onSentSMS(false)
          console.log('ERROR: Sent SMS Failed, ', err)
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const verifyNumber = () => {
    try {
      setLoading(true)
      verifySMS(otp)
        .then(res => {
          setMSG({ type: 'success', message: 'Congragulation/Xác nhận OTP thành công ấn tiếp tục để hoàn tất' })
          setVerify(true)
        })
        .catch(err => {
          setMSG({ type: 'err', message: 'Wrong OTP Code/ Sai mã OTP' })
          console.log('ERROR: Sent SMS Failed, ', err)
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>Phone number</h4>
        <p>Currently Only Support Vietnamese Phone number/Hiện tại chỉ hỗ trợ số điện thoại Việt Nam</p>
      </div>
      {user?.phone && user?.isPhoneVerified ? (
        <p>Your Phone is already verified - {user?.phone}</p>
      ) : (
        <div className="px-4 my-4">
          <p>
            <strong>Add your phone number.</strong>
          </p>
          <span className="d-block mb-2">
            <strong>Phone</strong>
          </span>
          <PhoneInput
            className="form-control w-50 mb-5"
            placeholder="Enter phone number"
            value={value}
            onChange={setNumber}
            countries={['VN', 'EG', 'US', 'LA', 'GB', 'KH', 'CN', 'HK', 'JP', 'KR', 'TW']}
          />
          <p className="text-danger">{validate}</p>
          <p>
            Your phone number will <strong>not</strong> be shared with clients.
          </p>
        </div>
      )}
      {isSentSMS && (
        <div>
          {loading ? (
            <Loader />
          ) : (
            <div className="text-center">
              <p>An OTP is sent to your phone/OTP đã được gửi về máy bạn</p>
              <p className="text">Let use it to verify your phone number/Hãy dùng nó để xác nhận số điện thoại</p>
              <OtpInput otp={otp} setOtp={setOtp} />
              {msg && (
                <>
                  {msg.type === 'success' ? (
                    <p className="text-success">{msg.message}</p>
                  ) : (
                    <p className="text-danger">{msg.message}</p>
                  )}
                </>
              )}
              <button
                className={`btn bg-jobsicker px-5 mt-4 me-2 ${value && !validate && !isVerified ? '' : 'disabled'}`}
                onClick={verifyNumber}
              >
                {t('Ok')}
              </button>
              <button
                className={`btn bg-jobsicker px-5 mt-4 ms-2 ${value && !validate && !isVerified ? '' : 'disabled'}`}
                onClick={sentVerifyNumber}
              >
                {t('Resend code')}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="px-4 my-3 pt-4 border-top d-flex justify-content-between">
        <button className="btn border me-4 px-5 fw-bold" onClick={() => profileStep({ step: EStep.LOCATION })}>
          {t('Back')}
        </button>
        {isVerified ? (
          <button
            className={`btn bg-jobsicker px-5 ${value && isVerified && !validate ? '' : 'disabled'}`}
            onClick={getNumber}
          >
            {t('Review profile')}
          </button>
        ) : (
          <button
            className={`btn bg-jobsicker px-5 ${value && !validate && !isSentSMS ? '' : 'disabled'}`}
            onClick={sentVerifyNumber}
          >
            {t('Next')}
          </button>
        )}
      </div>
    </section>
  )
}
