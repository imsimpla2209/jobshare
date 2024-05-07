
import { Button } from "antd";
import { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { loginGoogle } from "src/api/auth-apis";
import { checkUniqueField } from "src/api/user-apis";
import { ESignupStep } from "src/pages/BeforeLoginPages/SignUp";
import { generatePsw } from "src/utils/handleData";

export default function SignupForm({ setEmail, setSSOData, setStep, errorMessage, setErrorMessage, emailText, setUser, setIsWithSSO, isWithSSO }: any) {
  const { t } = useTranslation(['main'])
  const [loading, setLoading] = useState(false)
  const [email, setemail] = useState('')

  useEffect(() => {
    if (emailText) {
      console.log('emailText', emailText)
      setemail(emailText)
    }
  }, [emailText])

  const getEmail = ({ target }) => {
    const checkErr =
      target.value === ''
        ? t('Email required')
        : !target.value.match(
            /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
          )
        ? t('Please inter Valid Email')
        : null
    setErrorMessage(checkErr)
    if (checkErr) {
      return
    }
    setemail(target.value)
    setEmail(target.value)
  }

  const signUpContinue = async () => {
    setLoading(true)
    checkUniqueField({ email })
      .then(res => {
        if (res.data) {
          return toast.error('Email already used!!')
        }
        setStep(ESignupStep.DETAIL)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onEnter = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      if (!errorMessage) {
        setStep(ESignupStep.DETAIL)
      }
    }
  }

  const responseGoogle = async response => {
    console.log('ss', response?.profileObj)
    setIsWithSSO(true)
    setEmail(response?.profileObj?.email)
    setUser({
      email: response?.profileObj?.email,
      username: response?.profileObj?.email?.split('@')[0],
      password: generatePsw(),
    })
    setSSOData(response?.profileObj)
    setStep(ESignupStep.DETAIL)
  }

  return (
    <div className="col-sm-12 col-md-6 mx-auto">
      <div className="shadow-sm p-3 mb-5 bg-white rounded mx-auto mt-5 w-100 border">
        <h4 data-v-904d5b16 className="text-center m-0">
          <span style={{ fontFamily: 'serif', fontWeight: 'bold' }}>{t('Get your free account')}</span>
        </h4>
        <div className="mt-2 col-8 mx-auto d-flex justify-content-center align-items-center">
          <GoogleLogin
            clientId="195590118934-evractfheid56o6s2l1ufe6voo2funji.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </div>
        <div className="separator mt-3 col-8 mx-auto">or</div>
        <form>
          <div className="form-group col-8 mx-auto mt-3">
            <span className="text-danger">{errorMessage}</span>
            <input
              type="email"
              name="email"
              value={emailText}
              className="form-control mt-1"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder={t('Work email address')}
              onInput={getEmail}
              onKeyDown={onEnter}
            />
          </div>
          <div className="d-grid gap-2 col-8 mx-auto mt-3 hitbtn-class loginpcolor mb-4">
            <Button
              disabled={errorMessage != null || isWithSSO}
              className="btn bg-jobsicker"
              onClick={signUpContinue}
              loading={loading}
            >
              {t('Continue with Email')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
