import { useState } from 'react'

import { Avatar, Button, Card, Col, Descriptions, InputNumber, Modal, Radio, Row, Switch, Upload, message } from 'antd'

import { VerticalAlignTopOutlined } from '@ant-design/icons'

import BgProfile from 'pages/AdminPages/assets/images/bg-profile.jpg'
import profilavatar from 'pages/AdminPages/assets/images/face-1.jpg'
import { useTranslation } from 'react-i18next'
import { appInfoStore } from 'src/Store/commom.store'
import { userStore } from 'src/Store/user.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { currencyFormatter } from 'src/utils/helperFuncs'
import { updateAppInfo } from 'src/api/admin-apis'
import toast from 'react-hot-toast'

function Profile() {
  const [imageURL, setImageURL] = useState('')
  const [, setLoading] = useState(false)
  const { t } = useTranslation(['main'])
  const { state, setState } = useSubscription(userStore)
  const { state: appInfo, setState: setAppInfo } = useSubscription(appInfoStore)
  const [editSickData, setEditSickData] = useState<any>(appInfo)

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(false)
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        setLoading(false)
        setImageURL('')
      })
    }
  }

  const pencil = [
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" key={0}>
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" className="fill-gray-7"></path>
    </svg>,
  ]

  const uploadButton = (
    <div className="ant-upload-text font-semibold text-dark">
      {<VerticalAlignTopOutlined style={{ width: 20, color: '#000' }} />}
      <div>Upload New Project</div>
    </div>
  )

  const [openEditSick, setOpenEditSick] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('Content of the modal')

  const showModal = () => {
    setOpenEditSick(true)
  }

  const handleOk = () => {
    setModalText('Please wait...')
    setConfirmLoading(true)
    updateAppInfo(editSickData)
      .then(() => {
        toast.success('Updated successfully')
      })
      .finally(() => {
        setOpenEditSick(false)
        setConfirmLoading(false)
      })
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpenEditSick(false)
  }

  return (
    <>
      <div className="profile-nav-bg" style={{ backgroundImage: 'url(' + BgProfile + ')' }}></div>

      <Card
        className="card-profile-head"
        bodyStyle={{ display: 'none' }}
        title={
          <Row justify="space-between" align="middle" gutter={[24, 0]}>
            <Col span={24} md={12} className="col-info">
              <Avatar.Group>
                <Avatar size={74} shape="square" src={state.avatar || profilavatar} />

                <div className="avatar-info">
                  <h4 className="font-semibold m-0">{state.name}</h4>
                  <p>CEO / Co-Founder</p>
                </div>
              </Avatar.Group>
            </Col>
            <Col
              span={24}
              md={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Radio.Group defaultValue="a">
                <Radio.Button value="a">General</Radio.Button>
                <Radio.Button value="b">TEAMS</Radio.Button>
                <Radio.Button value="c">PROJECTS</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        }
      ></Card>

      <Row gutter={[24, 0]}>
        <Col span={24} md={8} className="mb-24 ">
          <Card
            bordered={false}
            className="header-solid h-full"
            title={<h6 className="font-semibold m-0">{t('Platform Setting')}</h6>}
          >
            <ul className="list settings-list">
              <li>
                <h6 className="list-header text-sm text-muted">ACCOUNT</h6>
              </li>
              <li>
                <Switch defaultChecked />

                <span>Email me when someone follows me</span>
              </li>
              <li>
                <Switch />
                <span>Email me when someone answers me</span>
              </li>
              <li>
                <Switch defaultChecked />
                <span>Email me when someone mentions me</span>
              </li>
              <li>
                <h6 className="list-header text-sm text-muted m-0">APPLICATION</h6>
              </li>
              <li>
                <Switch defaultChecked />
                <span>New launches and projects</span>
              </li>
              <li>
                <Switch defaultChecked />
                <span>Monthly product updates</span>
              </li>
              <li>
                <Switch defaultChecked />
                <span>Subscribe to newsletter</span>
              </li>
            </ul>
          </Card>
        </Col>
        <Col span={24} md={8} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">jobsPoints</h6>}
            className="header-solid h-full card-profile-information"
            extra={
              <Button type="link" onClick={showModal}>
                {pencil}
              </Button>
            }
            bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
          >
            <p className="text-dark"> Manage the Job Points. </p>
            <p>
              <strong>Current Price/Per:</strong> {currencyFormatter(appInfo.pointsCost)}
            </p>
            <hr className="my-25" />
            <Descriptions title="Current jobsPoints Info for Freelancers" className="my-25">
              <Descriptions.Item label="Submit Proposal Cost" span={3}>
                {appInfo.freelancerSicks.proposalCost} Points
              </Descriptions.Item>
              <Descriptions.Item label="Withdraw Return" span={3}>
                {appInfo.freelancerSicks.withdrawReturn} Points
              </Descriptions.Item>
              <Descriptions.Item label="Invite Message Cost" span={3}>
                {appInfo.freelancerSicks.inviteMsg} Points
              </Descriptions.Item>
              <Descriptions.Item label="Update Proposal Cost" span={3}>
                {appInfo.freelancerSicks.updateProposalCost} Points
              </Descriptions.Item>
            </Descriptions>
            <hr className="my-25" />

            <Descriptions title="Current jobsPoints Info for Clients">
              <Descriptions.Item label="Post Job Cost" span={3}>
                {appInfo.clientSicks.postJob} Points
              </Descriptions.Item>
              <Descriptions.Item label="Update Job Cost" span={3}>
                {appInfo.clientSicks.updateJob} Points
              </Descriptions.Item>
              <Descriptions.Item label="Create Contract Cost" span={3}>
                {appInfo.clientSicks.createContract} Points
              </Descriptions.Item>
              <Descriptions.Item label="Delete Job Cost(only if the job already had proposals)" span={12}>
                {appInfo.clientSicks.deleteJob} Points
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Card
        bordered={false}
        className="header-solid mb-24"
        title={
          <>
            <h6 className="font-semibold">Terms/Attachments</h6>
          </>
        }
      >
        <Row gutter={[24, 24]}>
          {/* {project.map((p, index) => (
            <Col span={24} md={12} xl={6} key={index}>
              <Card bordered={false} className="card-project" cover={<img alt="example" src={p.img} />}>
                <div className="card-tag">{p.titlesub}</div>
                <h5>{p.title}</h5>
                <p>{p.disciption}</p>
                <Row gutter={[6, 0]} className="card-footer">
                  <Col span={12}>
                    <Button htmlType="button">VIEW PROJECT</Button>
                  </Col>
                  <Col span={12} className="text-right">
                    <Avatar.Group className="avatar-chips">
                      <Avatar size="small" src={profilavatar} />
                      <Avatar size="small" src={convesionImg} />
                      <Avatar size="small" src={convesionImg2} />
                      <Avatar size="small" src={convesionImg3} />
                    </Avatar.Group>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))} */}
          <Col span={24} md={12} xl={6}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader projects-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageURL ? <img src={imageURL} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Col>
        </Row>
      </Card>
      <Modal
        title="Edit jobsPoints data"
        open={openEditSick}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Card
          bordered={false}
          title={<h6 className="font-semibold m-0">jobsPoints</h6>}
          className="header-solid h-full card-profile-information"
          bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
        >
          <p className="text-dark"> Manage the Job Points. </p>
          <p>
            <strong>Current Price/Per:</strong>{' '}
            <InputNumber
              onChange={v => setEditSickData({ ...editSickData, pointsCost: v })}
              defaultValue={appInfo.pointsCost}
              prefix="VND"
              style={{ width: '100%' }}
            />{' '}
          </p>
          <hr className="my-25" />
          <Descriptions title="Current jobsPoints Info for Freelancers" className="my-25">
            <Descriptions.Item label="Submit Proposal Cost" span={3}>
              <InputNumber
                onChange={v =>
                  setEditSickData({
                    ...editSickData,
                    freelancerSicks: {
                      ...editSickData.freelancerSicks,
                      proposalCost: v,
                    },
                  })
                }
                addonAfter="Points"
                defaultValue={appInfo.freelancerSicks.proposalCost}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Withdraw Return" span={3}>
              <InputNumber
                onChange={v =>
                  setEditSickData({
                    ...editSickData,
                    freelancerSicks: {
                      ...editSickData.freelancerSicks,
                      withdrawReturn: v,
                    },
                  })
                }
                addonAfter="Points"
                defaultValue={appInfo.freelancerSicks.withdrawReturn}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Invite Message Cost" span={3}>
              <InputNumber
                onChange={v =>
                  setEditSickData({
                    ...editSickData,
                    freelancerSicks: {
                      ...editSickData.freelancerSicks,
                      inviteMsg: v,
                    },
                  })
                }
                addonAfter="Points"
                defaultValue={appInfo.freelancerSicks.inviteMsg}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Update Proposal Cost" span={3}>
              <InputNumber
                onChange={v =>
                  setEditSickData({
                    ...editSickData,
                    freelancerSicks: {
                      ...editSickData.freelancerSicks,
                      updateProposalCost: v,
                    },
                  })
                }
                addonAfter="Points"
                defaultValue={appInfo.freelancerSicks.updateProposalCost}
              />
            </Descriptions.Item>
          </Descriptions>
          <hr className="my-25" />

          <Descriptions title="Current jobsPoints Info for Clients">
            <Descriptions.Item label="Post Job Cost" span={3}>
              <InputNumber
                onChange={v =>
                  setEditSickData({
                    ...editSickData,
                    clientSicks: {
                      ...editSickData.freelancerSicks,
                      postJob: v,
                    },
                  })
                }
                addonAfter="Points"
                defaultValue={appInfo.clientSicks.postJob}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Update Job Cost" span={3}>
              <InputNumber
                onChange={v =>
                  setEditSickData({
                    ...editSickData,
                    clientSicks: {
                      ...editSickData.freelancerSicks,
                      updateJob: v,
                    },
                  })
                }
                addonAfter="Points"
                defaultValue={appInfo.clientSicks.updateJob}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Create Contract Cost" span={3}>
              <InputNumber
                onChange={v =>
                  setEditSickData({
                    ...editSickData,
                    clientSicks: {
                      ...editSickData.freelancerSicks,
                      createContract: v,
                    },
                  })
                }
                addonAfter="Points"
                defaultValue={appInfo.clientSicks.createContract}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Delete Job Cost(only if the job already had proposals)" span={12}>
              <></>
            </Descriptions.Item>
          </Descriptions>
          <InputNumber
            onChange={v =>
              setEditSickData({
                ...editSickData,
                clientSicks: {
                  ...editSickData.freelancerSicks,
                  deleteJob: v,
                },
              })
            }
            addonAfter="Points"
            defaultValue={appInfo.clientSicks.deleteJob}
          />
        </Card>
      </Modal>
    </>
  )
}

export default Profile
