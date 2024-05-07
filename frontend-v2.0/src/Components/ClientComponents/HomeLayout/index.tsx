/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircleTwoTone, DollarTwoTone, FormOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Input,
  List,
  Modal,
  Pagination,
  Radio,
  Rate,
  Result,
  Row,
  Space,
} from 'antd'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { clientStore, userStore } from 'src/Store/user.store'
import { filterFreelancers, getFreelancerByOptions, getRcmdFreelancers } from 'src/api/freelancer-apis'
import { getJobs } from 'src/api/job-apis'
import { createSubscription, useSubscription } from 'src/libs/global-state-hook'
import { Title } from 'src/pages/ClientPages/JobDetailsBeforeProposols'
import { EJobStatus } from 'src/utils/enum'
import img from '../../../assets/img/icon-user.svg'
import j1 from '../../../assets/svg/jobs1.svg'
import j2 from '../../../assets/svg/jobs2.svg'
import j3 from '../../../assets/svg/jobs3.svg'
import j4 from '../../../assets/svg/jobs4.svg'
import Loader from '../../SharedComponents/Loader/Loader'
import ClientJobCard from '../ClientJobCard'
import { Text } from '../ReviewProposalsCard'
import './HomeLayout.css'
import VerifyPaymentModal from './VerifyPaymentModal'
import { createNotify } from 'src/api/message-api'

export const openModalInviteClient = createSubscription({ open: '' })

export default function HomeLayout() {
  const {
    state: { open },
  } = useSubscription(openModalInviteClient)
  const { t, i18n } = useTranslation(['main'])
  const lang = i18n.language
  const client = useSubscription(clientStore).state
  const user = useSubscription(userStore).state
  const [jobs, setJobs] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchKey, setSearchKey] = useState('')
  const [jobStatus, setJobStatus] = useState(EJobStatus.OPEN)

  const {
    state: { favoriteFreelancers, id, name },
  } = useSubscription(clientStore)

  const [freelancer, setFreelancer] = useState<any>(null)
  const [loadingModal, setLoadingModal] = useState(false)
  const [freelancerTitle, setFreelancerName] = useState('')
  const [mySavedFreelancer, setmySavedFreelancer] = useState([])
  const [sending, setSending] = useState(false)

  const handleInviteFreelancer = async () => {
    setSending(true)
    createNotify({
      content: `${client?.name} want to invite you into this job: ${freelancerTitle}`,
      to: freelancer?._id,
      path: `/job/${open}`,
    })
      .then(res => {
        toast.success('Invite successfull')
        openModalInviteClient.updateState({ open: false })
      })
      .catch(err => {
        toast.error(err.message)
      })
      .finally(() => setSending(false))
  }

  useEffect(() => {
    setLoadingModal(true)
    if (!open) return
    filterFreelancers(
      {
        id: favoriteFreelancers,
      },
      { limit: 20 }
    )
      .then(res => {
        setmySavedFreelancer(res?.data?.results?.map(f => f.user))
      })
      .catch(err => {
        toast.error('something went wrong, ', err)
      })
      .finally(() => setLoadingModal(false))
  }, [searchKey, open])

  useEffect(() => {
    const root = document.body.querySelector('#root') as HTMLElement
    if (!!open) {
      root.style.height = '100vh'
      root.style.overflow = 'hidden'
    } else {
      root.style.height = '100vh'
      root.style.overflow = ''
    }

    return () => {
      root.style.height = '100vh'
      root.style.overflow = ''
    }
  }, [!!open])

  useEffect(() => {
    if (client?._id || client?.id) {
      handleGetData()
    }
  }, [client, searchKey, jobStatus])

  const handleGetData = (p?: number | undefined, ps?: number | undefined) => {
    setLoading(true)
    getJobs({
      client: client?._id || client?.id,
      page: p || page,
      limit: ps || 10,
      searchText: searchKey || ' ',
      currentStatus: [jobStatus],
    })
      .then(res => {
        setJobs(res?.data?.results)
        setTotal(res?.data?.totalResults)
      })
      .catch(err => {
        toast.error('something went wrong, ', err)
      })
      .finally(() => setLoading(false))
  }

  const handleChangePageJob = useCallback(
    (p: number) => {
      if (p === page) return
      setPage(p)
      handleGetData(p)
    },
    [handleGetData, page]
  )

  const handleSearch = e => {
    setSearchKey(e.target.value)
  }

  return (
    <>
      {user?.name ? (
        <Row style={{ padding: '20px' }}>
          <Modal
            destroyOnClose
            title={t('Invite your favourite freelancer')}
            open={!!open}
            okText={t('Invite')}
            onCancel={() => openModalInviteClient.updateState({ open: false })}
            okButtonProps={{ disabled: !freelancer || sending, loading: sending }}
            onOk={handleInviteFreelancer}
          >
            <Input
              placeholder="Search freelancers here..."
              className="mt-3"
              value={searchKey}
              onInput={e => setSearchKey((e.target as any).value)}
            ></Input>
            <Divider style={{ marginBottom: 0 }}></Divider>
            <List
              style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'scroll' }}
              loading={loadingModal}
              itemLayout="horizontal"
              dataSource={mySavedFreelancer}
              renderItem={free => (
                <List.Item key={free._id}>
                  <Radio
                    onChange={e => {
                      setFreelancer(free)
                      setFreelancerName(free.name)
                    }}
                    checked={freelancer?._id === free?._id}
                  >
                    <Title level={5} style={{ margin: 0 }} className="text-muted">
                      {free.name}
                    </Title>
                  </Radio>
                </List.Item>
              )}
            />
          </Modal>
          <div className="row px-5 ">
            <Row style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 20px 20px 0px' }}>
              <h4>
                Welcome <strong>{user.name}</strong> ❤️❤️❤️
              </h4>

              <Link
                to="/post-job"
                style={{
                  padding: 4,
                  color: 'white',
                  width: 250,
                  background: 'linear-gradient(92.88deg, #12582D 9.16%, #316027 43.89%, #1F8346 64.72%)',
                }}
                className="btn bg-upwork"
              >
                {t('Post a job')}
              </Link>
            </Row>
            <Row>
              <Col span={16}>
                <Card className="mb-2">
                  <h4 className="d-inline-block">
                    {t('My posted jobs')} {`(${total})`}
                  </h4>
                  <Link to="/all-job-posts" className="float-sm-end mt-0">
                    {t('All Job Posts')}
                  </Link>
                </Card>
                <Radio.Group
                  value={jobStatus}
                  onChange={e => setJobStatus(e.target.value)}
                  buttonStyle="solid"
                  size="large"
                  style={{ marginBottom: 8 }}
                >
                  <Radio.Button value={EJobStatus.OPEN}>OPEN</Radio.Button>
                  <Radio.Button value={EJobStatus.PENDING}>PENDING</Radio.Button>
                  <Radio.Button value={EJobStatus.INPROGRESS}>IN PROGRESS</Radio.Button>
                  <Radio.Button value={EJobStatus.CANCELLED}>ARCHIVE</Radio.Button>
                  <Radio.Button value={EJobStatus.COMPLETED}>COMPLETED</Radio.Button>
                </Radio.Group>
                {jobs ? (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <ConfigProvider
                        theme={{
                          components: {
                            Select: {
                              optionFontSize: 16,
                              optionSelectedBg: '#a2eaf2',
                              optionLineHeight: 0.7,
                            },
                          },
                        }}
                      >
                        <Input
                          onInput={handleSearch}
                          size="large"
                          placeholder={t('Search For Jobs')}
                          value={searchKey}
                        />
                      </ConfigProvider>
                    </div>
                    {!loading ? (
                      jobs?.length ? (
                        jobs.map((item, index) => (
                          <div key={index}>
                            <ClientJobCard item={item} client={client} lang={lang} />
                          </div>
                        ))
                      ) : (
                        <Card style={{ marginBottom: 20 }}>
                          <Result
                            status="404"
                            title="No posted jobs found"
                            extra={
                              <Link
                                to="/post-job"
                                style={{
                                  padding: 4,
                                  color: 'white',
                                  width: 250,
                                  background:
                                    'linear-gradient(92.88deg, #12582D 9.16%, #316027 43.89%, #1F8346 64.72%)',
                                }}
                                className="btn bg-upwork"
                              >
                                {t('Post a job')}
                              </Link>
                            }
                          />
                        </Card>
                      )
                    ) : (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
                        <Loader />
                      </div>
                    )}

                    <Card>
                      <Pagination
                        total={total}
                        pageSize={10}
                        current={page}
                        showSizeChanger={false}
                        responsive
                        onChange={p => handleChangePageJob(p)}
                        showTotal={total => `Total ${total} jobs`}
                      />
                    </Card>
                  </>
                ) : (
                  <div className="list-group-item">
                    <div className="row align-items-center">
                      <div className="col-lg-9 p-lg-3">No posts yet</div>
                    </div>
                  </div>
                )}
              </Col>

              <RightLayout />
            </Row>
          </div>
        </Row>
      ) : (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Loader />
        </div>
      )}
    </>
  )
}

const RightLayout = () => {
  const { state: user } = useSubscription(userStore)
  const { state: client } = useSubscription(clientStore)
  const [openVerifyModal, setOpenVerifyModal] = useState(false)
  const { t } = useTranslation(['main'])
  return (
    <Col span={8} style={{ paddingLeft: 20 }}>
      <VerifyPaymentModal open={openVerifyModal} handleClose={() => setOpenVerifyModal(false)} />
      <div className="col d-none d-lg-block" style={{ marginBottom: 16 }}>
        <div
          style={{
            background: 'white',
            border: '1.4px solid #ccc',
            height: 'auto',
            borderRadius: '12px',
            padding: 8,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <img
              src={user?.avatar ? user?.avatar : img}
              alt=""
              className="rounded-circle d-inline border"
              width="50px"
              height="50px"
            />
            <h5
              className="d-inline ps-1 text-wrap"
              style={{
                wordBreak: 'break-all',
              }}
            >{`@${user.name}.`}</h5>
          </div>
          <Space className="my-lg-1 w-100" align="center" style={{ justifyContent: 'center' }}>
            <Button type="primary" icon={<i className="fas fa-eye me-2" />}>
              <Link to={`/settings`}>{t('View Profile')}</Link>
            </Button>
            {client?.paymentVerified ? (
              <>
                <Button
                  className="text-success"
                  type="text"
                  icon={<CheckCircleTwoTone className="me-2" twoToneColor="#52c41a" />}
                >
                  {t('Account verified')}
                </Button>
              </>
            ) : (
              <Button
                className="text-success"
                type="dashed"
                icon={<FormOutlined />}
                onClick={() => setOpenVerifyModal(true)}
              >
                {t('Verify payment')}
              </Button>
            )}
          </Space>

          <div style={{ background: '#f9f9f9', borderRadius: 20, padding: 20, margin: 20 }}>
            <Title level={5}>
              <DollarTwoTone spin twoToneColor="#eb2f96" style={{ marginRight: 8 }} />
              {t('Avalable jobsPoints')}: {user.jobsPoints}
            </Title>
            <Button type="default">
              <Link to="/buyconnects">{t('Buy jobsPoints')}</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card title={t('Top feedback')}>
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://t4.ftcdn.net/jpg/03/26/98/51/360_F_326985142_1aaKcEjMQW6ULp6oI9MYuv8lN9f8sFmj.jpg"
                className="d-block w-100"
                alt=""
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <Rate value={5} disabled />
                <Text className="text-muted">This app is very useful. I found a lot of jobs here.</Text>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="https://img.freepik.com/free-photo/close-up-young-successful-man-smiling-camera-standing-casual-outfit-against-blue-background_1258-66609.jpg"
                className="d-block w-100"
                alt="..."
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <Rate value={5} disabled />
                <Text className="text-muted">This app is very useful. I found a lot of jobs here.</Text>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?cs=srgb&dl=pexels-nathan-cowley-1300402.jpg&fm=jpg"
                className="d-block w-100"
                alt="..."
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <Rate value={5} disabled />
                <Text className="text-muted">This app is very useful. I found a lot of jobs here.</Text>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </Card>

      <Card className="mt-3" bodyStyle={{ padding: 0 }} title={t('How it works')}>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex" style={{ gap: 24, paddingTop: 16 }}>
            <div className="col-4">
              <img src={j1} width="150em" />
            </div>
            <div className="col-6">
              <div className="media-body">
                <h4 className="m-0-top-bottom">{t('1. Post a job to get free quotes')}</h4>
                <p className="m-xs-top-bottom">
                  {t(
                    'Write a clear, detailed description of your job to share with qualified clients. Start receiving proposals in less than 24 hours'
                  )}
                  .
                </p>
              </div>
            </div>
          </li>
          <li className="list-group-item d-flex" style={{ gap: 24, paddingTop: 16 }}>
            <div className="col-4">
              <img src={j2} width="150em" />
            </div>
            <div className="col-6">
              <div className="media-body">
                <h4 className="m-0-top-bottom">{t('2. Evaluate clients and hire')}</h4>
                <p className="m-xs-top-bottom">
                  {t(
                    'Review proposals or invite qualified clients to your project. Quickly chat live or video call with favorites, and offer a contract to the best match.'
                  )}
                </p>
              </div>
            </div>
          </li>
          <li className="list-group-item d-flex" style={{ gap: 24, paddingTop: 16 }}>
            <div className="col-4">
              <img src={j3} width="150em" />
            </div>
            <div className="col-6">
              <div className="media-body">
                <h4 className="m-0-top-bottom">{t('3. Work together')}</h4>
                <p className="m-xs-top-bottom">
                  {t('Use')} <b>{t('JobShare Messages')}</b>{' '}
                  {t('to securely chat, share files, and collaborate on projects.')}
                </p>
              </div>
            </div>
          </li>{' '}
          <li className="list-group-item d-flex" style={{ gap: 24, paddingTop: 16 }}>
            <div className="col-4">
              <img src={j4} width="150em" />
            </div>
            <div className="col-6">
              <div className="media-body">
                <h4 className="m-0-top-bottom">{t('4. Pay and invoice through JobShare')}</h4>
                <p className="m-xs-top-bottom">
                  {t('Get invoices and make payments after reviewing time billed or approving milestones. With')}
                  <a>{t('JobShare Payment Protection')}</a>, {t('only pay for work you authorize')} .
                </p>
              </div>
            </div>
          </li>{' '}
        </ul>
        <div className="card-body">
          <h4 className="card-link">{t('Question?')}</h4>
          <p>
            {t('Visit')} <a className="card-link">{t('help center')}</a> {t('to contact')}
          </p>
        </div>
      </Card>
    </Col>
  )
}
