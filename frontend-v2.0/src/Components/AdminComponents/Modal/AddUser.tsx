/* eslint-disable react/jsx-no-target-blank */
import { ArrowLeftOutlined, PhoneOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import userIcon from 'assets/img/icon-user.svg'
import { useEffect, useRef, useState } from 'react'
import CountrySelect from 'react-bootstrap-country-select'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { registerAsClient } from 'src/api/client-apis'
import { registerAsFreelancer } from 'src/api/freelancer-apis'
import { createUser } from 'src/api/user-apis'
import { IUser } from 'src/types/user'
import { EUserType } from 'src/utils/enum'

export default function AddUser({ onRefresh }: any) {
  const { t } = useTranslation(['main'])
  const [validate, setValidate] = useState({
    firstName: '',
    lastName: '',
    password: '',
    terms: false,
    username: '',
    phone: '',
  })
  const terms = useRef(null)
  const [country, setCountry] = useState<any>(undefined)
  const [fName, setFName] = useState<any>('')
  const [lName, setlName] = useState<any>('')
  const [loading, setLoading] = useState(false)
  const [email, setemail] = useState('')

  useEffect(() => {
    setUserInfo({ ...userInfo, name: fName + ' ' + lName })
  }, [validate])

  useEffect(() => {
    console.log(validate)
  }, [validate])

  const [errorMessage, setErrorMessage] = useState('')
  const [workInfo, setWorkInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<
    Omit<
      IUser,
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
    password: '',
    email: '',
    // phone: "",
    images: [],
    lastLoginAs: '',
  })

  const onEmail = (email: string) => {
    setUserInfo({ ...userInfo, email })
  }

  const onUserTypeChange = type => {
    setUserInfo({ ...userInfo, lastLoginAs: type })
  }

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
    onEmail(target.value)
    setemail(target.value)
  }

  const getUserData = e => {
    const val = e.target.value
    const name = e.target.name
    switch (name) {
      case 'firstName':
        setFName(val)
        setValidate({
          ...validate,
          firstName:
            val === '' ? t('First name is required') : val.length < 3 ? t('First name must be more than 2') : null,
        })
        break
      case 'lastName':
        setlName(val)
        setValidate({
          ...validate,
          lastName:
            val === '' ? t('Last name is required') : val.length < 3 ? t('Last name must be more than 2') : null,
        })
        break
      case 'username':
        setUserInfo({ ...userInfo, username: val })
        setValidate({
          ...validate,
          username:
            val === ''
              ? t('This is Required')
              : // : val.match(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
              val.match(/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/)
              ? t('Please inter Valid Email')
              : null,
        })
        break
      case 'phone':
        setUserInfo({ ...userInfo, phone: val })
        setValidate({
          ...validate,
          phone: val.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g) ? t('Please inter Valid Phone') : null,
        })
        break
      case 'password':
        setUserInfo({ ...userInfo, password: val })
        setValidate({
          ...validate,
          password:
            val === ''
              ? t('This is Required')
              : val.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
              ? t('Password Should be More 8 Character')
              : null,
        })
        break
      case 'userType':
        onUserTypeChange(val)
        break
      case 'terms':
        setValidate({
          ...validate,
          terms: terms.current.checked,
        })
        break
      default:
        break
    }
  }

  const signUpComplete = async () => {
    await createUser({ ...userInfo, role: userInfo.lastLoginAs === 'admin' ? 'admin' : 'user' })
      .then(async res => {
        if (res.data) {
          if (userInfo.lastLoginAs === EUserType.FREELANCER) {
            await registerAsFreelancer({
              user: res.data?.id,
              name: userInfo.name,
              ...workInfo,
            })
          } else if (userInfo.lastLoginAs === EUserType.CLIENT) {
            await registerAsClient({
              user: res.data?.id,
              name: userInfo.name,
              ...workInfo,
            })
          }
          return res
        }
      })
      .then(res => {
        toast.success('Created Successfully')
        onRefresh()
      })
      .catch(err => {
        toast.error(err?.responseBody?.message)
        setErrorMessage(err.message)
        console.log(err.message)
      })
  }

  const handleSignup = async () => {
    setLoading(true)
    await signUpComplete()
    setLoading(false)
  }

  return (
    <div className="col-sm-12 col-md-12 mx-auto w-100">
      <h4>Create New User</h4>
      <div className="shadow-sm p-3 mb-5 bg-white rounded mx-auto mt-5 w-100 border">
        <form>
          <h5 className="text-danger text-center">{errorMessage}</h5>
          <h4 className="text-center m-0">
            <span
              style={{
                fontFamily: 'serif',
                fontWeight: 'bold',
                fontSize: '1.3em',
              }}
            ></span>
          </h4>
          <div className="row pt-3">
            <div className="input-group col-6 w-50">
              <div className="d-flex  mb-3" style={{ alignItems: 'baseline' }}>
                <span className="input-group-text bg-white d-inline" id="basic-addon1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="firstName"
                  className="form-control  border-start-0 d-inline"
                  placeholder={t('First Name')}
                  aria-label="Input group example"
                  aria-describedby="basic-addon1"
                  onInput={getUserData}
                />
              </div>
              <p className="text-danger">{validate.firstName}</p>
            </div>
            <div className="input-group col-6 w-50">
              <div className="d-flex" style={{ alignItems: 'baseline' }}>
                <span className="input-group-text bg-white d-inline" id="basic-addon1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-person-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="lastName"
                  className="form-control border-start-0 d-inline"
                  placeholder={t('Last Name')}
                  aria-label="Input group example"
                  aria-describedby="basic-addon1"
                  onInput={getUserData}
                />
              </div>
              <p className="text-danger">{validate.lastName}</p>
            </div>
          </div>
          <div className="d-flex" style={{ alignItems: 'baseline' }}>
            <span className="input-group-text bg-white d-inline" id="basic-addon1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="currentColor"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              className="form-control mt-1"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder={t('Work email address')}
              onInput={getEmail}
            />
          </div>
          <div className="input-group pt-3">
            <span className="input-group-text bg-white" id="basic-addon1">
              <img src={userIcon} width={16} alt="" />
            </span>
            <input
              type="text"
              name="username"
              className="form-control  border-start-0"
              placeholder={t('Username')}
              aria-label="Input group example"
              aria-describedby="basic-addon1"
              onInput={getUserData}
            />
          </div>
          <div className="input-group pt-3">
            <span className="input-group-text bg-white" id="basic-addon1">
              <PhoneOutlined />
            </span>
            <input
              type="text"
              name="phone"
              className="form-control  border-start-0"
              placeholder={t('Phone')}
              aria-label="Input group example"
              aria-describedby="basic-addon1"
              onInput={getUserData}
            />
          </div>
          <div className="input-group pt-3">
            <span className="input-group-text bg-white" id="basic-addon1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-lock-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              className="form-control  border-start-0"
              placeholder={t('Password')}
              aria-label="Input group example"
              aria-describedby="basic-addon1"
              onInput={getUserData}
            />
          </div>
          <p className="text-danger">{validate.password}</p>
          <div>
            <div
              className="btn-group d-flex  border-gray rounded"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <input
                type="radio"
                name="userType"
                className="btn-check"
                id="btnradio1"
                autoComplete="off"
                // defaultChecked
                value="Client"
                onInput={getUserData}
              />
              <label className="btn btn-outline-jobsicker" htmlFor="btnradio1">
                {t('Hire for a job')}
              </label>
              <input
                type="radio"
                name="userType"
                className="btn-check"
                id="btnradio2"
                autoComplete="off"
                value="Freelancer"
                onInput={getUserData}
                style={{ borderLeft: '1px solid black !important' }}
              />
              <label className="btn btn-outline-jobsicker" htmlFor="btnradio2">
                {t('Work as a freelancer')}
              </label>
              <input
                type="radio"
                name="userType"
                className="btn-check"
                id="btnradio3"
                autoComplete="off"
                value="admin"
                onInput={getUserData}
                style={{ borderLeft: '1px solid black !important' }}
              />
              <label className="btn btn-outline-jobsicker" htmlFor="btnradio3">
                {t('New Admin')}
              </label>
            </div>
          </div>

          <div className="d-grid gap-2 col-8 mx-auto mt-3 hitbtn-class loginpcolor mb-4">
            <Button
              className="btn bg-jobsicker"
              loading={loading}
              style={{ height: '50px' }}
              disabled={validate.password != null || !!validate.firstName || !!validate.lastName}
              onClick={handleSignup}
            >
              {t('Create Account')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
