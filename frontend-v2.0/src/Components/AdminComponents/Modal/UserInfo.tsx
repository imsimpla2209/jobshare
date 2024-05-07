/* eslint-disable jsx-a11y/anchor-is-valid */
import { FacebookOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  Modal,
  Popconfirm,
  Progress,
  Rate,
  Row,
  Space,
  Switch,
} from 'antd'
import defaultAvate from 'assets/img/icon-user.svg'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { locationStore } from 'src/Store/commom.store'
import { changeActiveUser } from 'src/api/admin-apis'
import { verifyClient } from 'src/api/client-apis'
import { verifyFreelancer } from 'src/api/freelancer-apis'
import { createNotify } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { EComplexityGet, EUserType } from 'src/utils/enum'
import { currencyFormatter, pickName } from 'src/utils/helperFuncs'

const pencil = [
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" key={0}>
    <path
      d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
      className="fill-gray-7"
    ></path>
    <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" className="fill-gray-7"></path>
  </svg>,
]

const UserInfo = ({ user, type }: any) => {
  const { t, i18n } = useTranslation(['main'])
  const locations = useSubscription(locationStore).state
  const [verified, setVerified] = useState(
    type === EUserType.FREELANCER ? user?.isProfileVerified : user?.paymentVerified
  )
  const [isNotifyModalOpen, openNotifyModal] = useState(false)
  const [notifyMsg, setNotifyMsg] = useState('')
  const [isActive, setActive] = useState(user?.user?.isActive)

  useEffect(() => {
    setVerified(type === EUserType.FREELANCER ? user?.isProfileVerified : user?.paymentVerified)
    setActive(user?.user?.isActive)
  }, [user, type])

  return (
    <Row gutter={[24, 0]} style={{ background: '#f3edf5', paddingTop: 24 }}>
      {type !== EUserType.ADMIN ? (
        <Col span={24} className="d-flex p-2 justify-content-end">
          <Button
            key="back"
            onClick={() => {
              openNotifyModal(true)
            }}
          >
            Notify
          </Button>

          <Button key="submit" type="primary">
            Direct Message
          </Button>
          {verified ? null : (
            <Popconfirm
              title={'Are you sure you want to verify this profile?'}
              onConfirm={() => {
                type === EUserType.FREELANCER
                  ? verifyFreelancer(user.id).then(() => {
                      toast.success('Profile Verified')
                      setVerified(true)
                    })
                  : verifyClient(user.id).then(() => {
                      toast.success('Profile Verified')
                      setVerified(true)
                    })
              }}
            >
              <Button type="primary">Verify Profile</Button>
            </Popconfirm>
          )}
          <Popconfirm
            title={'Are you sure you want to do this?'}
            onConfirm={() => {
              changeActiveUser(user?.user?.id).then(() => {
                toast.success('Account Active changed')
                setActive(!isActive)
                setVerified(true)
              })
            }}
          >
            <Button key="submit" type="dashed" danger={isActive}>
              {isActive ? 'DeActive' : 'ReActive'}
            </Button>
          </Popconfirm>
        </Col>
      ) : (
        <Col span={24} className="d-flex p-2 justify-content-end">
          <Button
            key="back"
            onClick={() => {
              openNotifyModal(true)
            }}
          >
            Notify
          </Button>
          ,
          <Button key="submit" type="primary">
            Direct Message
          </Button>
          ,
          <Popconfirm
            title={'Are you sure you want to do this?'}
            onConfirm={() => {
              changeActiveUser(user?.id).then(() => {
                toast.success('Account Active changed')
                setActive(!user?.isActive)
                setVerified(true)
              })
            }}
          >
            <Button key="submit" type="dashed" danger={isActive}>
              {user?.isActive ? 'DeActive' : 'ReActive'}
            </Button>
          </Popconfirm>
        </Col>
      )}
      {type !== EUserType.ADMIN && (
        <>
          <Col span={24} md={8} className="mb-24 ">
            <Card
              bordered={false}
              className="header-solid h-full"
              title={<h6 className="font-semibold m-0">{t('Platform Setting')}</h6>}
            >
              <ul className="list settings-list">
                <li>
                  <h6 className="list-header text-sm text-muted">ACCOUNT ABILITY</h6>
                </li>
                <li>
                  <Switch defaultChecked />
                  <span>Active</span>
                </li>
                <li>
                  <Switch />
                  <span>Email Receive</span>
                </li>
                <li>
                  <Switch defaultChecked />
                  <span>Apply For Jobs</span>
                </li>
                <li>
                  <Switch defaultChecked />
                  <span>Invite Message</span>
                </li>
                <li>
                  <h6 className="list-header text-sm text-muted m-0">APPLICATION</h6>
                </li>
                <li>
                  <Switch defaultChecked />
                  <span>2FA Verification</span>
                </li>
                <li>
                  <Switch defaultChecked />
                  <span>System Notifications</span>
                </li>
                <li>
                  <Switch defaultChecked />
                  <span>Tracking Behaviour</span>
                </li>
              </ul>
            </Card>
          </Col>
          <Col span={24} md={8} className="mb-24">
            <Card
              bordered={false}
              title={<h6 className="font-semibold m-0">Profile Information</h6>}
              className="header-solid h-full card-profile-information"
              extra={<Button type="link">{pencil}</Button>}
              bodyStyle={{ paddingTop: 0, paddingBottom: 16, fontSize: 14 }}
            >
              <Descriptions
                title={
                  <>
                    <Avatar shape="square" size={100} src={user?.user?.avatar || defaultAvate}></Avatar>{' '}
                    <span style={{ textTransform: 'capitalize' }}>{user?.user?.name}</span>
                  </>
                }
              >
                <Descriptions.Item label="Joint Date" span={3} style={{ textTransform: 'capitalize' }}>
                  {new Date(user?.user?.createdAt).toLocaleString('vi-VN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: '2-digit',
                    day: 'numeric',
                  })}
                </Descriptions.Item>
                <Descriptions.Item label="User Name" span={3} style={{ textTransform: 'capitalize' }}>
                  {user?.user?.username}
                </Descriptions.Item>
                <Descriptions.Item label="Role" span={3} style={{ textTransform: 'capitalize' }}>
                  {user?.user?.role}
                </Descriptions.Item>
                <Descriptions.Item label="Citizen ID" span={3} style={{ textTransform: 'capitalize' }}>
                  {user?.user?.nationalId || t('Unknown')}
                </Descriptions.Item>
                <Descriptions.Item label="Mobile" span={3}>
                  {user?.user?.phone || 'No Phone'} -{' '}
                  <span className="text-muted ms-1">
                    {user?.user?.isPhoneVerified ? ` ${t('Verified')}✅` : `${t('Not Verified')} ⛔`}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={3}>
                  {user?.user?.email || 'No Email'} -{' '}
                  <span className="text-muted ms-1">
                    {user?.user?.isEmailVerified ? ` ${t('Verified')}✅` : `${t('Not Verified')} ⛔`}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label={'Balance 💳'} span={3}>
                  {' '}
                  {currencyFormatter(user?.user?.balance)}{' '}
                </Descriptions.Item>
                <Descriptions.Item label={'Job Points'} span={3}>
                  {' '}
                  {user?.user?.jobsPoints || 0}
                </Descriptions.Item>
                <Descriptions.Item label={'Plan'} span={3}>
                  {' '}
                  {user?.user?.plan || 'Free'}
                </Descriptions.Item>
                <Descriptions.Item label="Social" span={3}>
                  <a href="#" className="mx-5 px-5">
                    {<TwitterOutlined />}
                  </a>
                  <a href="#" className="mx-5 px-5">
                    {<FacebookOutlined style={{ color: '#344e86' }} />}
                  </a>
                  <a href="#" className="mx-5 px-5">
                    {<InstagramOutlined style={{ color: '#e1306c' }} />}
                  </a>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={24} md={8} className="mb-24">
            {type === EUserType.FREELANCER ? (
              <Card
                bordered={false}
                title={<h6 className="font-semibold m-0">{user?.lastLoginAs} Profile</h6>}
                className="header-solid h-full card-profile-information"
                extra={<Button type="link">{pencil}</Button>}
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
              >
                <p className="text-dark">
                  {' '}
                  {user?.intro ||
                    `Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer
            is no. If two equally difficult paths, choose the one more painful
            in the short term (pain avoidance is creating an illusion of
            equality)`}
                  .{' '}
                </p>
                <hr className="my-25" />
                <Descriptions>
                  <Descriptions.Item label="Skills" span={3}>
                    {user?.skills?.map((skill, index) => (
                      <Space key={index} size={1} className="me-2 " wrap={true}>
                        {index + 1}. {pickName(skill?.skill, i18n.language)}
                      </Space>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Prefer Job Types" span={3}>
                    {user?.preferJobType?.map((c, index) => (
                      <Space key={index} size={1} className="me-2" wrap={true}>
                        {c?.name}
                      </Space>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of WIP Jobs" span={3}>
                    {user?.jobsDone?.number || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Expected Salary" span={3}>
                    {currencyFormatter(user?.expectedAmount)} \ {t(user?.expectedPaymentType)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location" span={3}>
                    {user?.currentLocations
                      ?.filter(l => locations?.find(s => s.code === l.toString())?.name)
                      .map(l => (
                        <span key={l} style={{ marginLeft: 8 }}>
                          {locations?.find(s => s.code === l.toString())?.name}
                        </span>
                      ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Online Expertise Level" span={3}>
                    {t(EComplexityGet[user?.expertiseLevel])}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rating" span={3}>
                    <Rate disabled={true} value={user.rating} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Profile Verified" span={3}>
                    {user?.isProfileVerified ? ` ${t('Verified')}✅` : `${t('Not Verified')} ⛔`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Profile Submited" span={3}>
                    {user?.isSubmitProfile ? ` ${t('Submitted')}✅` : `${t('Not Submited')} ⛔`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Profile Completion" span={3}>
                    <Progress percent={user?.profileCompletion || 0}></Progress>
                  </Descriptions.Item>
                  <Descriptions.Item label="English Profiency" span={3}>
                    {user?.englishProficiency}
                  </Descriptions.Item>
                </Descriptions>
                <div className="mt-4 border  rounded-2 p-2" style={{ color: 'black', fontSize: 14 }}>
                  <div>
                    <strong>{t('Education')}</strong>
                  </div>
                  <div>
                    <strong>- School: </strong>
                    {user?.education?.school || t('Unknown')}
                  </div>
                  <div>
                    <strong>- Major: </strong>
                    {user?.education?.areaOfStudy || t('Unknown')}
                  </div>
                  <div>
                    <strong>- Degree: </strong>
                    {user?.education?.degree || t('Unknown')}
                  </div>
                  <div>
                    <strong>- Graduation Year: </strong>
                    {user?.education?.gradYear
                      ? new Date(user?.education?.gradYear).toLocaleString('vi-VN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: '2-digit',
                          day: 'numeric',
                        })
                      : t('Unknown')}
                  </div>
                </div>
                <div className="mt-4" style={{ color: 'black', fontSize: 14 }}>
                  <div>
                    <strong>{t('History Works')}</strong>
                  </div>
                  {user?.historyWork?.map((e, ix) => (
                    <div className="border rounded p-2" key={ix}>
                      <strong>{ix + 1}. </strong>
                      <span>{e?.jobName}</span> -<span>{e?.jobTitle}</span> -
                      {e?.stillWork ? <span>Still Work</span> : null}
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card
                bordered={false}
                title={<h6 className="font-semibold m-0">{user?.lastLoginAs} Profile</h6>}
                className="header-solid h-full card-profile-information"
                extra={<Button type="link">{pencil}</Button>}
                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
              >
                <p className="text-dark"> {user?.intro}</p>
                <hr className="my-25" />
                <Descriptions>
                  <Descriptions.Item label="Finding Skills" span={3}>
                    {user?.findingSkills?.map((skill, index) => (
                      <Space key={index} size={1} className="me-2 " wrap={true}>
                        {index + 1}. {pickName(skill?.skill, i18n.language)}
                      </Space>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Prefer Job Types" span={3}>
                    {user?.preferJobType?.map((c, index) => (
                      <Space key={index} size={1} className="me-2" wrap={true}>
                        {index + 1}. {c?.name}
                      </Space>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Jobs" span={3}>
                    {user?.jobs?.length || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Location" span={3}>
                    {user?.preferLocations
                      ?.filter(l => locations?.find(s => s.code === l.toString())?.name)
                      .map(l => (
                        <span key={l} style={{ marginLeft: 8 }}>
                          {locations?.find(s => s.code === l.toString())?.name}
                        </span>
                      ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Online Expertise Level" span={3}>
                    {t(EComplexityGet[user?.expertiseLevel])}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rating" span={3}>
                    <Rate disabled={true} value={user.rating} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Profile Verified" span={3}>
                    {user?.paymentVerified ? ` ${t('Verified')}✅` : `${t('Not Verified')} ⛔`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Profile Submited" span={3}>
                    {user?.isSubmitProfile ? ` ${t('Submitted')}✅` : `${t('Not Submited')} ⛔`}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </Col>
        </>
      )}
      <Modal
        open={isNotifyModalOpen}
        title={t('Write your notification ?')}
        okText={t('Accept')}
        okType="danger"
        onOk={() => {
          createNotify({
            content: 'From Admin: ' + notifyMsg,
            to: user?.user?.id,
            image:
              'https://cdni.iconscout.com/illustration/premium/thumb/forgot-login-password-5800309-4861087.png?f=webp',
          })
            .then(res => {
              toast.success('Sent Notify Success')
              openNotifyModal(false)
            })
            .catch(err => {
              toast.error(err.message)
            })
            .finally(() => {
              setNotifyMsg('')
            })
        }}
        onCancel={() => {
          openNotifyModal(false)
          setNotifyMsg('')
        }}
      >
        <span className="text-muted">You want to notify this user something?</span>
        <Input
          style={{ marginTop: 8 }}
          value={notifyMsg}
          autoFocus
          placeholder="Something you want to remind the user"
          onInput={e => setNotifyMsg((e.target as any).value)}
        />
      </Modal>
    </Row>
  )
}

export default UserInfo
