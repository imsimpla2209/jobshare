import { TwitterOutlined, FacebookOutlined, InstagramOutlined } from '@ant-design/icons'
import {
  Row,
  Col,
  Card,
  Switch,
  Button,
  Descriptions,
  List,
  Avatar,
  Rate,
  Space,
  Collapse,
  Table,
  Badge,
  Modal,
  Input,
  Popconfirm,
} from 'antd'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { getClientByOptions } from 'src/api/client-apis'
import { getFreelancerByOptions } from 'src/api/freelancer-apis'
import { EComplexityGet, EJobStatus, EUserType } from 'src/utils/enum'
import { currencyFormatter, pickName, randomDate } from 'src/utils/helperFuncs'
import defaultAvate from 'assets/img/icon-job.svg'
import jobsPoint from 'assets/img/logo.png'
import { IJobData } from 'src/Store/job.store'
import { Link } from 'react-router-dom'
import { useSubscription } from 'src/libs/global-state-hook'
import { locationStore } from 'src/Store/commom.store'
import Progress from 'src/Components/SharedComponents/Progress'
import { useTranslation } from 'react-i18next'
import FileDisplay from 'src/pages/ForumPages/ideas/idea-detail/file-display'
import { getContracts } from 'src/api/contract-apis'
import Title from 'antd/es/typography/Title'
import { deleteJob, forcedDeleteJob } from 'src/api/job-apis'
import { createNotify } from 'src/api/message-api'
import toast from 'react-hot-toast'
import { verifyJob } from 'src/api/admin-apis'

const pencil = [
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" key={0}>
    <path
      d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
      className="fill-gray-7"
    ></path>
    <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" className="fill-gray-7"></path>
  </svg>,
]

function monthDiff(d1, d2) {
  var months
  months = (d2.getFullYear() - d1.getFullYear()) * 12
  months -= d1.getMonth()
  months += d2.getMonth()
  return months <= 0 ? 0 : months
}

const columns = [
  {
    title: 'NO.',
    dataIndex: 'name',
    key: 'name',
    width: '4%',
  },
  {
    title: 'EPEXTED AMOUNT',
    dataIndex: 'function',
    key: 'function',
  },

  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
  },

  {
    title: 'COVER LETTER',
    key: 'active',
    dataIndex: 'active',
  },
  {
    title: 'CREATED DATE',
    key: 'JointDate',
    dataIndex: 'JointDate',
  },
]

const contractColumns = [
  {
    title: 'Overview',
    dataIndex: 'name',
    key: 'name',
    width: '4%',
  },
  {
    title: 'ACCEPTED AMOUNT',
    dataIndex: 'function',
    key: 'function',
  },

  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: 'DURATION',
    key: 'JointDate',
    dataIndex: 'JointDate',
  },
]

const JobInfo = ({ job }: { job: IJobData }) => {
  const locations = useSubscription(locationStore).state
  const { t, i18n } = useTranslation(['main'])
  const [contracts, setContracts] = useState<any>([])
  const [isNotifyModalOpen, openNotifyModal] = useState(false)
  const [notifyMsg, setNotifyMsg] = useState('')
  const [isDeleted, setDeleted] = useState(job?.isDeleted)
  useEffect(() => {
    getContracts({ job: job._id }).then(res => {
      setContracts(res.data?.results)
    })
  }, [job])

  return (
    <Row gutter={[24, 0]} style={{ background: !isDeleted ? '#f3edf5' : 'grey', paddingTop: 24 }}>
      <Col span={24} className="d-flex justify-content-end mb-3">
        <Button
          key="back"
          className="me-3"
          onClick={() => {
            openNotifyModal(true)
          }}
        >
          Notify Owner
        </Button>

        <Button key="submit" className="me-3" type="primary">
          Direct Message
        </Button>
        <Popconfirm
          title={'Are you sure you want to do this?'}
          onConfirm={() => {
            deleteJob(job?._id).then(() => {
              toast.success('Account Active changed')
              setDeleted(true)
            })
          }}
        >
          <Button key="back" className="me-3">
            Soft Delete
          </Button>
        </Popconfirm>
        <Popconfirm
          title={'Are you sure you want to do this?'}
          onConfirm={() => {
            forcedDeleteJob(job?._id).then(() => {
              toast.success('Account Active changed')
              setDeleted(true)
            })
          }}
        >
          <Button key="back" className="me-3">
            Force Delete
          </Button>
        </Popconfirm>

        {job?.currentStatus === EJobStatus.PENDING && (
          <Popconfirm
            title={'You sure this job is verified?'}
            onConfirm={() => {
              verifyJob(job?._id).then(() => {
                toast.success('This job is verified')
              })
            }}
          >
            <Button type="primary">Verify Job</Button>
          </Popconfirm>
        )}
      </Col>
      <Col span={24} md={8} className="mb-24 ">
        <Card
          bordered={false}
          className="header-solid h-full"
          title={<h6 className="font-semibold m-0">{t('Job Changes')}</h6>}
        >
          <ul className="list settings-list">
            <li>
              <h6 className="list-header text-sm text-muted">Status Logs</h6>
            </li>
            {job?.status?.map((s, ix) => (
              <li key={ix} style={{ border: '1px solid #ccc ', color: 'black', fontSize: 14, padding: 8 }}>
                <div style={{ textTransform: 'capitalize' }}>
                  <strong>Status:</strong> {s.status}
                </div>
                <div style={{ textTransform: 'capitalize' }}>
                  <strong>Comment:</strong> {s.comment}
                </div>
                <div style={{ textTransform: 'capitalize' }}>
                  <strong>Date Applied:</strong> {new Date(s.date).toLocaleString()}
                </div>
              </li>
            ))}
            <li>
              <h6 className="list-header text-sm text-muted">Proposals</h6>
            </li>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={getProposalsData(job?.proposals)}
                pagination={{}}
                className="ant-border-space"
              />
            </div>
            <li>
              <h6 className="list-header text-sm text-muted">Contracts</h6>
            </li>
            <div className="table-responsive">
              <Table
                columns={contractColumns}
                dataSource={getContractsData(contracts || [])}
                pagination={{}}
                className="ant-border-space"
              />
            </div>
          </ul>
        </Card>
      </Col>
      <Col span={24} md={8} className="mb-24">
        <Card
          bordered={false}
          title={<h6 className="font-semibold m-0">Overview</h6>}
          className="header-solid h-full card-profile-information"
          extra={<Button type="link">{pencil}</Button>}
          bodyStyle={{ paddingTop: 0, paddingBottom: 16, fontSize: 14 }}
        >
          <Descriptions title={<>Job Overview</>}>
            <Descriptions.Item label="Title" span={3} style={{ textTransform: 'capitalize' }}>
              {job?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Posted At" span={3} style={{ textTransform: 'capitalize' }}>
              {new Date(job?.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At" span={3} style={{ textTransform: 'capitalize' }}>
              {job?.updatedAt ? new Date(job?.updatedAt).toLocaleString() : 'N/a'}
            </Descriptions.Item>
            <Descriptions.Item label="Duration Type" span={3} style={{ textTransform: 'capitalize' }}>
              {job?.jobDuration}
            </Descriptions.Item>
            <Descriptions.Item label={'Budget 🪙'} span={3}>
              {' '}
              {currencyFormatter(job?.budget)}{' '}
            </Descriptions.Item>
            <Descriptions.Item label="Payment" span={3}>
              {currencyFormatter(job?.payment?.amount)} {'/'} {job?.payment?.type}
            </Descriptions.Item>
            <Descriptions.Item label="Owner Info" span={3}>
              Id: {job?.client?._id}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ color: 'black' }}>
            <strong>Questions List:</strong>
            {job?.questions?.map((q, index) => (
              <div key={index}>
                <strong>{index + 1}. </strong>
                {q}
              </div>
            ))}
          </div>
        </Card>
      </Col>
      <Col span={24} md={8} className="mb-24">
        <Card
          bordered={false}
          title={<h6 className="font-semibold m-0">Job Details</h6>}
          className="header-solid h-full card-profile-information"
          extra={<Button type="link">{pencil}</Button>}
          bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
        >
          <p className="text-dark"> {job?.description}. </p>
          <hr className="my-25" />
          <Descriptions>
            <Descriptions.Item label="Categories" span={3}>
              {job?.categories?.map((c, index) => (
                <div key={index} className="me-2">
                  {c?.name}
                </div>
              ))}
            </Descriptions.Item>

            <Descriptions.Item label="Online Complexity" span={3}>
              {t(EComplexityGet[job?.scope?.complexity])}
            </Descriptions.Item>
            <Descriptions.Item label="Duration" span={3}>
              {job?.scope?.duration || 'N/A'} months
            </Descriptions.Item>
            <Descriptions.Item label="Location" className="fw-bold text-muted" span={12}>
              {/* <span className="fw-bold text-muted" style={{ display: 'flex', marginTop: 2 }}> */}
              <i className="fas fa-map-marker-alt" />
              {job?.preferences?.locations
                ?.filter(l => locations?.find(s => s.code === l.toString())?.name)
                .map(l => (
                  <span key={l} style={{ marginLeft: 8 }}>
                    {locations?.find(s => s.code === l.toString())?.name}
                  </span>
                ))}
              {/* </span> */}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ color: 'black', marginBottom: 12 }}>
            <div>
              <strong>{t('Required Skills')}</strong>
            </div>
            {job?.reqSkills?.map((skill, index) => (
              <Space key={index} size={1} className="me-sm-5 " wrap={true}>
                {index + 1}. {pickName(skill?.skill, i18n.language)}
              </Space>
            ))}
          </div>
          <div className="mb-4">
            {job?.checkLists?.length ? (
              <Collapse
                style={{ background: '#d0bfff' }}
                size="small"
                items={job?.checkLists?.map((c, i) => ({
                  key: i,
                  label: `${t('Check Lists')} (${i + 1})`,
                  children: <p>{c}</p>,
                }))}
              />
            ) : (
              <p className="mx-1">{t('Unknown')}</p>
            )}
          </div>
          <FileDisplay files={job?.attachments}></FileDisplay>
        </Card>
      </Col>
      <Modal
        open={isNotifyModalOpen}
        title={t('Write your notification ?')}
        okText={t('Accept')}
        okType="danger"
        onOk={() => {
          createNotify({
            content: 'From Admin to your Job: ' + notifyMsg,
            to: job?.client?.user,
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
        <span className="text-muted">You want to notify its owner something?</span>
        <Input
          style={{ marginTop: 8 }}
          value={notifyMsg}
          autoFocus
          placeholder="Notification Message"
          onInput={e => setNotifyMsg((e.target as any).value)}
        />
      </Modal>
    </Row>
  )
}

export default JobInfo

const getProposalsData = proposals => {
  return proposals?.map((proposal, ix) => ({
    key: ix,
    name: (
      <>
        <Avatar.Group>
          <div className="avatar-info">
            <Title level={5}>{ix + 1}</Title>
          </div>
        </Avatar.Group>{' '}
      </>
    ),
    function: (
      <div className="author-info">
        <Title level={5} style={{ textTransform: 'capitalize' }}>
          {currencyFormatter(proposal?.expectedAmount)}
        </Title>
      </div>
    ),

    status: (
      <Badge
        count={proposal?.currentStatus}
        className="tag-primary"
        style={{ backgroundColor: '#52c41a', textTransform: 'capitalize' }}
      ></Badge>
    ),
    active: (
      <div className="author-info">
        <Title level={5} style={{ textTransform: 'capitalize' }} className="text-truncate">
          {proposal?.description}
        </Title>
      </div>
    ),
    JointDate: (
      <div className="ant-employed">
        <span>
          {proposal?.createdAt
            ? new Date(`${proposal?.createdAt}`).toLocaleString()
            : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}
        </span>
      </div>
    ),
  }))
}

const getContractsData = contractss => {
  return contractss?.map((contract, ix) => ({
    key: ix,
    name: (
      <>
        <Avatar.Group>
          <div className="avatar-info">
            <Title level={5} style={{ textTransform: 'capitalize' }}>
              {contract?.overview}
            </Title>
          </div>
        </Avatar.Group>{' '}
      </>
    ),
    function: (
      <div className="author-info">
        <Title level={5} style={{ textTransform: 'capitalize' }}>
          {currencyFormatter(contract?.agreeAmount)}/{contract?.paymentType}
        </Title>
      </div>
    ),

    status: (
      <Badge
        count={contract?.currentStatus}
        className="tag-primary"
        style={{ backgroundColor: '#52c41a', textTransform: 'capitalize' }}
      ></Badge>
    ),

    JointDate: (
      <div className="ant-employed">
        <span>{monthDiff(new Date(contract?.startDate), new Date(contract?.endDate))} months</span>
      </div>
    ),
  }))
}
