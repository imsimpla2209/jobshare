/* eslint-disable */
import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { loginGoogle, postLogin } from 'src/api/auth-apis'
import { useAuth } from 'src/Components/Providers/AuthProvider'
import { ResponseStatus } from 'src/api/constants'
import toast from 'react-hot-toast'
import { Input } from 'antd'
import { EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'
import { GoogleLogin } from 'react-google-login'
import { gapi } from 'gapi-script'

export default function LoginTemp() {
  const [user, setUser] = useState({ email: '', password: '' })
  const [emailError, setEmailErorr] = useState('')
  const [PasswordError, setPasswordErrorr] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const { t } = useTranslation(['main'])

const responseGoogle = async response => {
  console.log('ss',response?.profileObj)
  loginGoogle({
    email: response?.profileObj?.email,
  })
    .then(result => {
      if (result.data.user) {
        localStorage.setItem('userType', result.data.user?.lastLoginAs || 'Freelancer')
        result.data.user?.lastLoginAs === 'Freelancer' ? navigate('/find-work') : navigate('/home')
        login(result.data?.tokens?.token, result.data?.user)
        toast.success('Got you, bro!')
      }
    })
    .catch(error => {
      console.log(error)
      if (error?.responseBody?.code === ResponseStatus?.UNAUTHORIZED) {
        toast.error('Wrong username/email or password!')
        return setErrorMessage('Wrong username/email or password!')
      }
      navigate('/sign-up', { state: { user: response?.profileObj } })

    })
}

  const getUserData = e => {
    const name = e.target.name
    const val = e.target.value
    switch (name) {
      case 'email':
        setUser({
          ...user,
          email: val,
        })
        setEmailErorr(
          val === ''
            ? t('This is Required')
            : !val.match(
                /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$|^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
              )
            ? t('Please inter Valid Email')
            : null
        )
        break
      case 'password':
        setUser({
          ...user,
          password: val,
        })
        setPasswordErrorr(
          val === '' ? t('This is Required') : val.length < 8 ? t('Password Should be More 8 Character') : null
        )
        break
      default:
        break
    }
  }

  const onLogin = async e => {
    console.log(user)
    e.preventDefault()
    await postLogin({ username: user.email, password: user.password })
      .then(res => {
        if (res.data.user) {
          localStorage.setItem('userType', res.data.user?.lastLoginAs || 'Freelancer')
          res.data.user?.lastLoginAs === 'Freelancer' ? navigate('/find-work') : navigate('/home')
          login(res.data?.tokens?.token, res.data?.user)
          toast.success('Got you, bro!')
        }
      })
      .catch(error => {
        console.log(error)
        if (error?.responseBody?.code === ResponseStatus?.UNAUTHORIZED) {
          toast.error('Wrong username/email or password!')
          return setErrorMessage('Wrong username/email or password!')
        }
        setErrorMessage(error.message)
        toast.error(error.message)
      })
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-5  mx-auto">
            <div className="shadow-sm p-5 mb-5 bg-white rounded mx-auto mt-5 w-100  border ">
              <h5 data-v-904d5b16 className="text-center m-0">
                <span data-v-733406b2 data-v-44072c38>
                  {t('Login and get to work')}
                </span>
              </h5>
              <form>
                <div className="form-group col-8 mx-auto mt-3">
                  {/* <span className="text-danger">{emailError}</span> */}
                  <Input
                    prefix={<UserOutlined />}
                    size={'large'}
                    type="email"
                    name="email"
                    className={`shadow-none ${emailError ? 'border-danger' : ''}`}
                    aria-describedby="emailHelp"
                    placeholder={t('User name or Email')}
                    onInput={getUserData}
                  />
                </div>
                <div className="form-group col-8 mx-auto mt-3">
                  {/* <span className="text-danger">{PasswordError}</span> */}
                  <Input.Password
                    prefix={<LockOutlined />}
                    size={'large'}
                    type="password"
                    name="password"
                    className={`shadow-none ${PasswordError ? 'border-danger' : ''}`}
                    aria-describedby="emailHelp"
                    placeholder={t('Password')}
                    onInput={getUserData}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </div>
                <div className="form-group col-8 mx-auto mt-3 d-flex justify-content-between">
                  <label>
                    <input type="checkbox" className="me-2" />
                    {t('Keep me logged in')}
                  </label>
                  <Link to="/forgot-password">{t('Forgot password')}</Link>
                </div>
                <div className="d-grid gap-2 col-8 mx-auto mt-3 hitbtn-className loginpcolor">
                  <button
                    className="btn bg-jobsicker "
                    onClick={onLogin}
                    disabled={PasswordError != null || emailError != null}
                  >
                    {t('Log in')}
                  </button>
                </div>
                <span className="text-danger text-center ms-md-5 ">{errorMessage}</span>

                {/* <div className="d-grid gap-2 col-8 mx-auto mt-3">
                  <Link to="" className="text-center">
                    {t("Not you")}
                  </Link>
                </div> */}
                <div className="separator mt-4 col-8 mx-auto d-flex justify-content-center align-items-center">or</div>
                <div className="mt-2 col-8 mx-auto d-flex justify-content-center align-items-center">
                  <GoogleLogin
                    clientId="195590118934-evractfheid56o6s2l1ufe6voo2funji.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                  />
                </div>
                {/* <div
                  className="google-btn  gap-2 mx-auto mt-3 rounded hitbtn-className col-sm-12"
                  style={{ height: '40px' }}
                  onClick={googleLogin}
                >
                  <div className="google-icon-wrapper" style={{ marginRight: '1px' }}>
                    <img
                      className="google-icon me-2"
                      src="https://th.bing.com/th/id/OIP.0eRUZcdA6VxiTjvM4MoR9gAAAA?w=214&h=214&c=7&r=0&o=5&dpr=2&pid=1.7"
                    />
                  </div>
                  <div className="text-justify ">
                    <p className="text-center text-white pt-2">{t('Sign in with google')}</p>
                  </div>
                </div>
                <div
                  className="google-btn  gap-2 mx-auto mt-3 rounded hitbtn-className col-sm-12"
                  style={{ height: '40px' }}
                  onClick={googleLogin}
                >
                  <div className="google-icon-wrapper" style={{ marginRight: '1px' }}>
                    <img
                      className="google-icon me-2"
                      src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
                    />
                  </div>
                  <div className="text-justify ">
                    <p className="text-center text-white pt-2">{t('Sign in with facebook')}</p>
                  </div>
                </div> */}
                <hr />
                <div>
                  <div className="separator mt-4 col-8 mx-auto">{t('New To JobShare')}</div>
                  <div className="d-grid gap-2 col-md-5 col-sm-10 mx-auto mt-3   rounded mb-5">
                    <Link className="btn signup" to="/sign-up">
                      {t('Sign Up')}
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
