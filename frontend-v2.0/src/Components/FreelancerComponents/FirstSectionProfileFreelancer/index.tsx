/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import ShowMore from 'react-show-more-button/dist/module'
import { updateUserData } from '../../../Network/Network'
import img from '../../../assets/img/icon-user.svg'
import { PlusOutlined } from '@ant-design/icons'
import { Card, Col, Form, Modal, Row, Space, Upload, UploadFile } from 'antd'
import { RcFile } from 'antd/es/upload'
import { checkFileFunc } from 'src/Components/CommonComponents/upload/upload'
import Progress from 'src/Components/SharedComponents/Progress'
import SkillPicker from 'src/Components/SharedComponents/SkillPicker'
import { locationStore } from 'src/Store/commom.store'
import { freelancerStore, userStore } from 'src/Store/user.store'
import { getContracts } from 'src/api/contract-apis'
import { getFreelancer, updateFreelancer } from 'src/api/freelancer-apis'
import { getUser, updateUser } from 'src/api/user-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { currencyFormatter, fetchAllToCL, getBase64, pickName, timeAgo } from 'src/utils/helperFuncs'
import Loader from '../../SharedComponents/Loader/Loader'
import InviteFreelancerModal from './inviteModal'
import CommentsList from 'src/pages/FreelancerPages/Profile/CommentList'

export default function FirstSectionProfileFreelancer({ noMargin }) {
  const { id } = useParams()
  const clientRoute = useLocation().pathname.includes('freelancer-profile')
  const clientProfile = useLocation().pathname.includes('client-profile')
  const { i18n, t } = useTranslation(['main'])
  let lang = i18n.language
  const [imgUrl, setimgUrl] = useState(null)
  const [progress, setprogress] = useState(0)
  const [profileTitle, setprofileTitle] = useState('')
  const [portfolioList, setportfolioList] = useState([])
  const [profileOverview, setprofileOverview] = useState('')
  const [imgTitle, setimgTitle] = useState('')
  const [imageItself, setimageItself] = useState('')
  const [inputVal, setinputVal] = useState('')
  const [skillsList, setskillsList] = useState([])
  const [EmpTitle, setEmpTitle] = useState('')
  const [EmpCompany, setEmpCompany] = useState('')
  const [EmpStillWork, setEmpStillWork] = useState(false)
  let [user, setUser] = useState<any>(null)
  let [freelancer, setFreelancer] = useState<any>(null)
  const { state: userData, setState: setUserState } = useSubscription(userStore)
  const { state: freelancerData, setState } = useSubscription(freelancerStore)
  const locations = useSubscription(locationStore).state
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [previewImage, setPreviewImage] = useState('')
  const [EmpList, setEmpList] = useState([])
  const handleCancel = () => setPreviewOpen(false)

  useEffect(() => {
    if (id === 'me') {
      setFreelancer(freelancerData)
      setUser(userData)
      if (freelancerData?._id) {
        console.log(freelancerData)
        getContracts({ freelancer: freelancerData?._id }).then(res => setContracts(res.data?.results))
      }
    } else {
      setLoading(true)

      getFreelancer(id)
        .then(res => {
          setFreelancer(res.data)
          getContracts({ freelancer: res.data?._id }).then(res => setContracts(res.data?.results))
          return res
        })
        .then(res => {
          getUser(res?.data?.user)
            .then(res => {
              setUser(res.data)
            })
            .catch(err => {
              console.log('Error: cannot get this user', err)
            })
        })
        .catch(err => {
          console.log('Error: cannot get this freelancer', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [userData, freelancerData, id])

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const skillVal = e => {
    setinputVal(e.target.value)
  }

  const addskills = e => {
    if (inputVal !== '') {
      let arr2 = [...skillsList, inputVal]
      setskillsList(arr2)
      console.log(skillsList)
      const currSkills = freelancer?.skills ?? []
      updateFreelancer({ skills: [...currSkills, e] }, freelancer?._id)
    }
  }

  const updateProfile = e => {
    const val = e.target.value
    const name = e.target.name
    switch (name) {
      case 'title':
        setprofileTitle(val)

        break
      case 'overview':
        setprofileOverview(val)

        break
      case 'imgTitle':
        setimgTitle(val)

        break
      case 'imageItself':
        setimageItself(val)

        break
      case 'EmpTitle':
        setEmpTitle(val)
        break
      case 'EmpCompany':
        setEmpCompany(val)
        break
      case 'EmpStillWork':
        setEmpStillWork(val)
        break
      default:
        break
    }
  }
  const UpdateEditprofileTitleOverView = () => {
    updateFreelancer({ title: profileTitle, intro: profileOverview }, freelancer?._id).then(res => {
      setFreelancer({ ...freelancerData, title: profileTitle, intro: profileOverview })
      setState({ ...freelancerData, title: profileTitle, intro: profileOverview })
    })
  }
  const UpdateEditPortofolio = () => {
    if (imageItself !== '' && imgTitle !== '') {
      let arr3 = [...portfolioList, { image: imgUrl, imagetitle: imgTitle }]
      setportfolioList(arr3)
      console.log(portfolioList)
      updateUserData('freelancer', { portfolio: [...user?.portfolio, { image: imgUrl, imagetitle: imgTitle }] })
    }
  }
  const UpdateEditEmployment = () => {
    if (EmpTitle !== '' && EmpCompany !== '') {
      let arr4 = [...EmpList, { jobTitle: EmpTitle, companyName: EmpCompany, stillWork: EmpStillWork }]
      setEmpList(arr4)
      console.log(EmpList)
      updateUserData('freelancer', {
        company: [...user?.company, { jobTitle: EmpTitle, companyName: EmpCompany, stillWork: EmpStillWork }],
      })
    }
  }

  const updateAvatar = async () => {
    let avatar = userData?.avatar
    if (userData?.avatar !== files) {
      const fileNameList = await fetchAllToCL(files)
      avatar = fileNameList[0]
    }
    await updateUser({ avatar }, user?.id).then(res => {
      setUserState(res.data)
    })
  }
  console.log(freelancerData, freelancer)
  return (
    <div style={{ padding: noMargin ? '20px 0px' : '' }}>
      {user !== null ? (
        <>
          <Card
            loading={loading}
            className={`container-xxl container-fluid-sm bg-white ${noMargin ? '' : 'mt-5  mb-3'}`}
          >
            <div className={`row ${noMargin ? '' : 'mt-3'} ps-4 pt-2`}>
              <div className="col-lg-2 pt-lg-3">
                <div
                  className="ms-3 mb-1"
                  style={{ maxWidth: '169px', maxHeight: '169px', borderRadius: '20%', overflow: 'hidden' }}
                >
                  <img
                    alt=""
                    style={{ width: '169px' }}
                    className=" avatar vertical-align-middle m-0 avatar-sm avatar-responsive"
                    src={user?.avatar ? user?.avatar : img}
                  />
                </div>
                {id === 'me' && (
                  <div className="ms-3">
                    {!clientRoute && (
                      <button
                        type="button"
                        className="btn btn-default me-2 d-flex justify-content-center border rounded-circle"
                        style={{
                          width: 30,
                          height: 30,
                          textAlign: 'center',
                          paddingTop: 3,
                          paddingBottom: 3,
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#editAvatar"
                      >
                        <div>
                          <i className="fas fa-pen" />
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="col-lg-6 pt-lg-5 mx-3">
                <h2 className="fw-bold">{user?.name}.</h2>
                <div className="my-3 w-100">
                  <div className="d-flex">
                    <span className="text-muted me-2">
                      <i className="fas fa-map-marker-alt me-2" />
                      {t('Location')}:
                    </span>
                    <span className="d-flex flex-wrap fw-bold mb-2">
                      {freelancer?.currentLocations?.map(l => (
                        <span key={l} className="fw-bold me-2">
                          {locations?.find(s => s.code === l.toString())?.name} |
                        </span>
                      ))}
                    </span>
                  </div>
                  <p className="text-muted">
                    <strong>{t('Self-Introduce')}:</strong> {freelancer?.title}
                  </p>
                </div>
                <div className="row py-3">
                  <div className="col">
                    <span className="text-success">
                      {' '}
                      {freelancer?.isProfileVerified !== 0 && (
                        <svg
                          width="15px"
                          data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 14 14"
                          aria-hidden="true"
                          role="img"
                        >
                          <polygon points="7 0 0 0 0 9.21 7 14 14 9.21 14 0 7 0" fill="#1caf9d" />
                        </svg>
                      )}{' '}
                      {t('Profile Verified')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-2"></div>

              {id === 'me' && !freelancer?.isProfileVerified && (
                <div className="col py-3 mx-1 float-end ">
                  <Link to="/create-profile">
                    <button type="button" className="btn px-4  mx-3" style={{ background: '#0E4623', color: 'white' }}>
                      {t('Profile Settings')}
                    </button>
                  </Link>
                </div>
              )}

              {clientRoute ? <InviteFreelancerModal /> : null}

              <hr />
              <div className="row my-3">
                <div className="col-3 row border-end border-2 me-1">
                  <div className="row">
                    <div className="">
                      <div className="fw-bold fs-5">{currencyFormatter(freelancer?.earned)}</div>
                      <div className="fs-6">{t('Earnings')}</div>
                    </div>
                    <div className="">
                      <div className="fs-6">{t('Total Jobs')}</div>
                      <div className="fw-bold fs-5">{freelancer?.jobsDone?.number}</div>
                    </div>
                    <div className="">
                      <div className="fs-6">{t('Total Completed Jobs')}</div>
                      <div className="fw-bold fs-5">{freelancer?.jobsDone?.success}</div>
                    </div>
                  </div>
                  <hr />
                  <h5 className="fw-bold text-muted">{t('Availability')}</h5>
                  <h6>
                    {lang === 'vi'
                      ? freelancer?.available === true
                        ? 'Đang rảnh'
                        : 'Không rảnh'
                      : freelancer?.available === true
                      ? 'available'
                      : 'not available'}
                  </h6>

                  <h5 className="fw-bold text-muted">{t('Languages')}</h5>
                  <p style={{ lineHeight: 0 }}>
                    <span className="text-muted">{t('Vietnamese')}: </span> {t('Expert')}
                  </p>
                  <p style={{ lineHeight: 0 }}>
                    <span className="text-muted">{t('English')}: </span> {' : '}{' '}
                    {freelancer?.englishProficiency || 'Basic/Cơ bản'}
                  </p>
                  {freelancer?.otherLanguages?.map((langItem, ix) => (
                    <p key={ix}>{[langItem.language, ' ', ':', ' ', langItem.langProf]}</p>
                  ))}

                  <h5 className="fw-bold mt-3 text-muted">{t('Education')}</h5>
                  <p style={{ lineHeight: 0 }}>
                    <span className="text-muted">University: </span>
                    {freelancer?.education?.school || 'Trường Đời'}
                  </p>
                  <p style={{ lineHeight: 0 }}>
                    <span className="text-muted">Study: </span>
                    {freelancer?.education?.areaOfStudy || 420}
                  </p>
                  <p style={{ lineHeight: 0 }}>
                    <span className="text-muted">Degree: </span>
                    {freelancer?.education?.degree || 'None/Chưa từng đi học'}
                  </p>
                  <p className="text-capitalize" style={{ lineHeight: 0 }}>
                    <span className="text-muted">Year: </span>
                    {freelancer?.education?.gradYear
                      ? new Date(freelancer?.education?.gradYear).toLocaleString('vi-VN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: '2-digit',
                          day: 'numeric',
                        })
                      : 2019}
                  </p>
                </div>

                <div className="col-5 px-4">
                  <div className="d-flex justify-content-between">
                    <h4 className="fw-bold"> {t('Description')}</h4>
                    {id === 'me' && (
                      <div className="col-1 d-flex justify-content-end">
                        {!clientRoute && (
                          <button
                            type="button"
                            className="btn btn-default me-2 d-flex justify-content-center border rounded-circle"
                            style={{
                              width: 30,
                              height: 30,
                              textAlign: 'center',
                              paddingTop: 3,
                              paddingBottom: 3,
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#modalProfileTitleAndDescription"
                          >
                            <div>
                              <i className="fas fa-pen" />
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <ShowMore
                    className="mb-0 mt-4"
                    maxHeight={100}
                    button={
                      <button
                        id="seemorebutton"
                        className="advanced-search-link "
                        style={{ color: 'green', position: 'absolute', left: 0 }}
                      >
                        more
                      </button>
                    }
                  >
                    {freelancer?.intro}
                  </ShowMore>

                  <hr />
                  <div className="row">
                    <h3 className="col-4 mx-0 text-muted">{t('Portfolio')}</h3>
                    {!clientRoute && (
                      <button
                        type="button"
                        className=" col-1 btn btn-default d-flex justify-content-center border rounded-circle"
                        style={{
                          width: 30,
                          height: 30,
                          textAlign: 'center',
                          paddingTop: 3,
                          paddingBottom: 3,
                          marginRight: 10,
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#modalPortfolioWithImages"
                      >
                        <div>
                          <i className="fas fa-plus"></i>{' '}
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="card-group">
                    <Space size="small" wrap>
                      <div className="fw-bold me-1 text-muted" style={{ fontSize: '0.9em' }}>
                        {t('Categories') + ':'}
                      </div>
                      {freelancer?.preferJobType?.map((c, index) => (
                        <div key={index}>
                          <Link
                            to={`/search?categoryId=${c?._id}`}
                            key={index}
                            type="button"
                            className="btn text-light btn-sm rounded-pill cats mx-1"
                          >
                            {c?.name}
                          </Link>
                        </div>
                      ))}
                    </Space>
                  </div>

                  <div className="row mt-5">
                    <hr />
                    <h3 className="text-muted">{t('Skills and experties')}</h3>
                    {!clientRoute && (
                      <button
                        type="button"
                        className=" col-1 btn btn-default d-flex justify-content-center border rounded-circle"
                        style={{
                          width: 30,
                          height: 30,
                          textAlign: 'center',
                          paddingTop: 3,
                          paddingBottom: 3,
                          marginRight: 10,
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#modalAddSkills"
                      >
                        <div>
                          <i className="fas fa-plus"></i>{' '}
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="col">
                    {freelancer?.skills?.map((skill, index) => (
                      <Space key={index} size={1} className="me-sm-5 " wrap={true}>
                        <Link
                          key={index}
                          className="btn text-light btn-sm rounded-pill cats mx-1 my-1"
                          to={`/search?skillId=${skill?._id}`}
                        >
                          {pickName(skill?.skill, lang)}:
                        </Link>
                        <Progress done={skill?.level} />
                      </Space>
                    ))}
                  </div>
                  <hr />
                </div>
                <div className=" col-4 ms-1" style={{ borderLeft: '0.5px solid #ccc' }}>
                  <div className="ms-2 row">
                    <h3 className="col mx-0 text-muted">{t('Expected Amount')}</h3>
                  </div>
                  <hr />
                  <h5 className="ms-4 mt-2 fw-bold">
                    {currencyFormatter(freelancer?.expectedAmount || 0)} / {t(freelancer?.expectedPaymentType)}
                  </h5>
                  <hr />
                  <div className="ms-2 row">
                    <h3 className="col mx-0 text-muted">{t('Work History')}</h3>
                  </div>
                  <hr />
                  <div className="bg-white py-lg-1 row py-xs-5 overflow-auto" style={{ maxHeight: '600px' }}>
                    {contracts?.map(c => {
                      return (
                        <div key={c?._id} className="col-12">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title job-title">{c?.job?.title}</h5>
                              <div className="card-company-glassdoor">
                                <p className="card-company-name text-truncate ">{c?.job?.description}</p>
                              </div>
                              <div className="card-job-details mb-3">
                                <p className="card-company-location">
                                  <i className="fas fa-map-marker-alt"></i>
                                  {c?.job?.preferences?.locations?.map(l => (
                                    <span key={l} style={{ marginLeft: 2 }}>
                                      {locations?.find(s => s.code === l.toString())?.name} |
                                    </span>
                                  ))}
                                </p>
                                <p className="card-job-duration">
                                  <i className="fas fa-clock me-2"></i>
                                  {t('Start working from')} -
                                  <span style={{ marginLeft: 2 }}>{timeAgo(c?.startDate, t)}</span>
                                </p>

                                <p className="card-listing-date">
                                  <i className="fas fa-upload me-2"></i>
                                  {t('End date')} -
                                  <span style={{ marginLeft: 2 }}>{new Date(c?.endDate).toLocaleString()}</span>
                                </p>

                                <p className="card-salary-range">
                                  <i className="fas fa-wallet me-2"></i>
                                  {currencyFormatter(c?.agreeAmount)} / {t(`${c?.paymentType}`)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {user?.company?.length ? (
            <div className={`container-xxl container-fluid-sm bg-white ${noMargin ? '' : 'mb-3'} mt-5`}>
              <div className="row mt-3 px-4">
                <div className="row">
                  <div className="col d-flex justify-content-between ">
                    <h2 className="mb-3 mt-3 text-muted">{t('Employment history')}</h2>
                    {!clientRoute && (
                      <button
                        type="button"
                        className="btn btn-default me-2 d-flex justify-content-center border rounded-circle"
                        style={{
                          width: 30,
                          height: 30,
                          textAlign: 'center',
                          paddingTop: 3,
                          paddingBottom: 3,
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#editEmploymentHistory"
                      >
                        <div>
                          <i className="fas fa-plus" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                <hr />
                <div className="row">
                  {user?.company?.map((item, ix) => (
                    <div className="container p-3" key={ix}>
                      <h5>Title: {item.jobTitle}</h5>
                      <p className="mb-0 ">Company: {item.companyName}</p>
                      <p className="mb-2 ">{item.stillWork ? 'present' : ''}</p>
                    </div>
                  ))}
                  <div className="col-md-6 d-flex justify-content-end"></div>
                </div>
              </div>
            </div>
          ) : null}

          <div
            className="modal fade"
            id="editAvatar"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Change Avatar
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                  <form>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader ms-5"
                      defaultFileList={files ? [files] : []}
                      onPreview={handlePreview}
                      accept="image/*"
                      beforeUpload={file => {
                        const checkedFile = checkFileFunc(file)
                        console.log('checkedFile', checkedFile)
                        if (checkedFile) {
                          setFiles([file])
                        }
                        return false
                      }}
                      maxCount={1}
                    >
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Select new avatar</div>
                      </div>
                    </Upload>
                    <Modal
                      open={previewOpen}
                      style={{ zIndex: 100 }}
                      title={'Avatar'}
                      footer={null}
                      onCancel={handleCancel}
                    >
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-link border rounded-border "
                    data-bs-dismiss="modal"
                    style={{
                      color: '#6058c4',
                      backgroundColor: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateAvatar}
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-default border rounded-border"
                  >
                    {t('Save changes')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="editEmploymentHistory"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Edit Employment
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">
                        Company
                      </label>
                      <input
                        onChange={updateProfile}
                        name="EmpCompany"
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput1"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput2" className="form-label fw-bold">
                        Title
                      </label>
                      <input
                        onChange={updateProfile}
                        name="EmpTitle"
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput2"
                      />
                    </div>
                    <div className="input-group mb-3">
                      <div className="input-group-text ">
                        <input
                          onChange={updateProfile}
                          name="EmpStillWork"
                          className="form-check-input mt-0 "
                          type="checkbox"
                          value=""
                          aria-label="Checkbox for following text input"
                        />
                        I currently worked here
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-link border rounded-border "
                    data-bs-dismiss="modal"
                    style={{
                      color: '#6058c4',
                      backgroundColor: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={UpdateEditEmployment}
                    type="button"
                    className="btn btn-default border rounded-border"
                  >
                    Edit Employment{' '}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="modalProfileTitleAndDescription"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Edit Profile
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">
                        {t('Self-Introduce')}
                      </label>
                      <input
                        onChange={updateProfile}
                        name="title"
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput1"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="exampleFormControlTextarea1" className="form-label">
                        {t('Description')}
                      </label>
                      <textarea
                        onChange={updateProfile}
                        name="overview"
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows={5}
                        defaultValue={''}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-link border rounded-border "
                    data-bs-dismiss="modal"
                    style={{
                      color: '#6058c4',
                      backgroundColor: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={UpdateEditprofileTitleOverView}
                    type="button"
                    className="btn btn-default border rounded-border"
                    data-bs-dismiss="modal"
                  >
                    {t('Save changes')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="modalPortfolioWithImages"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add Portofolio Item
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput1" className="form-label fw-bold">
                        Item Title
                      </label>
                      <input
                        onChange={updateProfile}
                        name="imgTitle"
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput1"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="exampleFormControlInput2" className="form-label fw-bold">
                        Add Image
                      </label>
                      <input
                        onChange={updateProfile}
                        name="imageItself"
                        type="file"
                        className="form-control"
                        id="exampleFormControlInput2"
                      />
                    </div>
                  </form>
                  <div className="w-50 text-center mt-5">
                    {/* <progress className="w-100" value={progress} max="100" /> */}
                    <div
                      className="mb-3"
                      style={{ width: progress * 2, height: '5px', backgroundColor: '#12582D' }}
                    ></div>
                    {imgUrl ? (
                      <img src={imgUrl} />
                    ) : (
                      <i className="fas fa-user-circle fa-7x" style={{ color: '#A0A0A0' }}></i>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-link border rounded-border "
                    data-bs-dismiss="modal"
                    style={{
                      color: '#6058c4',
                      backgroundColor: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    Cancel
                  </button>
                  <Link
                    to="/profile"
                    onClick={UpdateEditPortofolio}
                    type="button"
                    className="btn btn-default border rounded-border"
                  >
                    Add{' '}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="modalAddSkills"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add Skills
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body ">
                  <form>
                    <div className="mb-3 "></div>
                  </form>
                </div>
                <div className="my-4 d-flex justify-content-center">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="skills"
                        label={t('Skills')}
                        rules={[{ required: true, message: 'Please choose the skills' }]}
                      >
                        <SkillPicker handleChange={addskills} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-link border rounded-border "
                    data-bs-dismiss="modal"
                    style={{
                      color: '#6058c4',
                      backgroundColor: 'white',
                      textDecoration: 'none',
                    }}
                  >
                    Cancel
                  </button>
                  <button onClick={addskills} type="button" className="btn btn-default border rounded-border">
                    Add{' '}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Card
            style={{ justifyContent: 'center' }}
            className={`container-xxl container-fluid-sm bg-white ${noMargin ? '' : 'mt-5  mb-3'}`}
          >
            <div>
              <CommentsList reviews={freelancer?.reviews} />
            </div>
          </Card>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Loader />
        </div>
      )}
    </div>
  )
}
