import { SearchOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Card, Col, Input, Modal, Radio, Row, Space, Table, Typography } from 'antd'

import defaultAvate from 'assets/img/icon-job.svg'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import JobInfo from 'src/Components/AdminComponents/Modal/JobInfo'
import { IJobData } from 'src/Store/job.store'
import { getAllJobsforAdmin, getJobs } from 'src/api/job-apis'
import { EComplexityGet } from 'src/utils/enum'
import { currencyFormatter, getStatusColor, randomDate } from 'src/utils/helperFuncs'

const { Title } = Typography

const columns = [
  {
    title: 'OVERVIEW',
    dataIndex: 'name',
    key: 'name',
    width: '17%',
  },
  {
    title: 'Payment',
    dataIndex: 'function',
    key: 'function',
  },

  {
    title: 'STATUS',
    key: 'status',
    dataIndex: 'status',
  },

  {
    title: 'SCOPE',
    key: 'active',
    dataIndex: 'active',
  },
  {
    title: 'CREATED DATE',
    key: 'JointDate',
    dataIndex: 'JointDate',
  },
]

function JobTables() {
  const [jobs, setJobs] = useState([])
  const [filterJobs, setFilterJobs] = useState([])
  const [seletecJob, setSelectedJob] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const { t } = useTranslation(['main'])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSeach] = useState('')

  useEffect(() => {
    setLoading(true)
    getAllJobsforAdmin()
      .then(res => {
        setJobs(res.data)
        setFilterJobs(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const openJobDetailModal = job => {
    setSelectedJob(job)
    setOpenModal(true)
  }

  const getJobsData = jobs => {
    return jobs
      ?.filter(
        j =>
          j?.title?.toLowerCase()?.includes(search) ||
          j?.description?.toLowerCase()?.includes(search) ||
          j?.reqSkills?.find(
            j => j?.skill?.name?.toLowerCase()?.includes(search) || j?.skill?.name_vi?.toLowerCase()?.includes(search)
          ) ||
          j?.categories?.find(j => j?.name?.toLowerCase()?.includes(search)) ||
          j?.checkLists?.find(j => j?.toLowerCase()?.includes(search)) ||
          j?.questions?.find(j => j?.toLowerCase()?.includes(search)) ||
          j?.jobDuration?.toLowerCase()?.includes(search) ||
          j?.budget?.toString()?.toLowerCase()?.includes(search) ||
          j?.tags?.find(j => j?.toLowerCase()?.includes(search)) ||
          j?.payment?.type?.toLowerCase()?.includes(search)
      )
      ?.map((job, ix) => ({
        key: ix,
        name: (
          <>
            <Avatar.Group>
              <div className="avatar-info">
                <Title level={5}>{job.title}</Title>
                <p className="text-truncate">Needed employee: {job?.preferences?.nOEmployee || 1}</p>
                <p>{job?.jobDuration}</p>
              </div>
            </Avatar.Group>{' '}
          </>
        ),
        function: (
          <div className="author-info">
            <Title level={5} style={{ textTransform: 'capitalize' }}>
              {job?.payment?.type}/{currencyFormatter(job?.payment?.amount)}
            </Title>
            <p style={{ textTransform: 'capitalize' }}>Budget: {currencyFormatter(job?.budget)}</p>
          </div>
        ),

        status: (
          <Badge
            count={job?.currentStatus}
            className="tag-primary"
            style={{ backgroundColor: getStatusColor(job?.currentStatus), textTransform: 'capitalize' }}
          ></Badge>
        ),
        active: (
          <div className="author-info">
            <Title level={5} style={{ textTransform: 'capitalize' }}>
              {t(EComplexityGet[job?.scope?.complexity])}
            </Title>
            <p style={{ textTransform: 'capitalize' }}>{job?.scope?.duration || 'N/A'} Months</p>
            <p style={{ textTransform: 'capitalize' }}>{job?.proposals?.length || 0} Applied Proposals</p>
          </div>
        ),
        JointDate: (
          <div className="ant-employed">
            <span>
              {job?.createdAt
                ? new Date(`${job?.createdAt}`).toLocaleString()
                : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}
            </span>
            <Button type="primary" shape="round" onClick={() => openJobDetailModal(job)}>
              Detail
            </Button>
          </div>
        ),
      }))
  }

  const onChangeJobsFilter = e => {
    setFilter(e.target.value)
    console.log(e.target.value)
    return e?.target?.value === 'all'
      ? setFilterJobs(jobs)
      : setFilterJobs(jobs?.filter(job => job?.currentStatus === e?.target?.value))
  }

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Jobs Management Table"
            extra={
              <Space>
                <Input
                  className="header-search"
                  placeholder="Search by name, types, skill, budget, description, etc..."
                  prefix={<SearchOutlined />}
                  value={search}
                  onInput={(e: any) => setSeach(e?.target?.value)}
                />
                <Radio.Group onChange={onChangeJobsFilter} value={filter}>
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="pending">Pending</Radio.Button>
                  <Radio.Button value="open">Open</Radio.Button>
                  <Radio.Button value="inProgress">In Progress</Radio.Button>
                  <Radio.Button value="completed">Completed</Radio.Button>
                  <Radio.Button value="closed">Closed</Radio.Button>
                  <Radio.Button value="cancelled">Cancelled</Radio.Button>
                </Radio.Group>
              </Space>
            }
          >
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={getJobsData(filterJobs)}
                pagination={{}}
                className="ant-border-space"
                loading={loading}
              />
            </div>
          </Card>
          <Modal
            open={openModal}
            title="Job Details"
            onCancel={() => {
              setOpenModal(false)
              setSelectedJob({})
            }}
            width={1250}
            footer={[]}
          >
            <JobInfo job={seletecJob as IJobData} />
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default JobTables
