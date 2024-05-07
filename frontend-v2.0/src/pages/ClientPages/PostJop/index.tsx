import { AlertFilled, DollarTwoTone, EditOutlined, HomeOutlined } from '@ant-design/icons'
import PostJobAside from 'Components/ClientComponents/PostJobAside'
import PostJobGetStarted, { postJobSubscribtion } from 'Components/ClientComponents/PostJobGetStarted'
import { Breadcrumb, Card, Modal, Row, message } from 'antd'
import { createContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import PostJobBudget from 'src/Components/ClientComponents/PostJobBudget'
import PostJobDescription from 'src/Components/ClientComponents/PostJobDescription'
import PostJobDetails from 'src/Components/ClientComponents/PostJobDetails'
import PostJobExpertise from 'src/Components/ClientComponents/PostJobExpertise'
import PostJobReview from 'src/Components/ClientComponents/PostJobReview'
import PostJobTitle from 'src/Components/ClientComponents/PostJobTitle'
import PostJobVisibility from 'src/Components/ClientComponents/PostJobVisibility'
import { Title } from '../JobDetailsBeforeProposols'
import { EComplexity, EJobStatus, EJobType, ELevel, EPaymenType, SICKPOINTS_PER_POST } from 'src/utils/enum'
import { useSubscription } from 'src/libs/global-state-hook'
import { clientStore, userStore } from 'src/Store/user.store'
import VerifyPaymentModal from 'src/Components/ClientComponents/HomeLayout/VerifyPaymentModal'
import { getJob } from 'src/api/job-apis'
import Loader from 'src/Components/SharedComponents/Loader/Loader'

export const StepContext = createContext({ step: 'started', setStep: val => {}, isEdit: false })

export default function PostJob({ isEdit = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation(['main'])
  const [step, setStep] = useState('started')
  const [showWarning, setShowWarning] = useState(false)
  const { state: user } = useSubscription(userStore)
  const [btns, setBtns] = useState({
    started: false,
    title: true,
    description: true,
    details: true,
    expertise: true,
    visibility: true,
    budget: true,
    review: true,
  })
  const { state: client } = useSubscription(clientStore)
  const [openVerifyModal, setOpenVerifyModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      getJob(id)
        .then(res => {
          const job = res.data

          const notAllowEdit = job.status.find(({ status }) =>
            [EJobStatus.CANCELLED, EJobStatus.CLOSED, EJobStatus.COMPLETED, EJobStatus.INPROGRESS].includes(status)
          )

          if (notAllowEdit) {
            return navigate(`/job-details/${id}`)
          }
          if (job?.categories?.length) {
            job['categories'] = job.categories.map(cat => cat?._id)
          }
          if (job?.reqSkills?.length) {
            job['reqSkills'] = job.reqSkills.map(s => ({ level: s.level, skill: s.skill._id }))
          }

          postJobSubscribtion.updateState({
            title: job?.title || '',
            description: job.description || '',
            categories: job.categories || [],
            type: job.type || EJobType.ONE_TIME_PROJECT,
            payment: { amount: job.payment.amount || 100, type: job.payment.type || EPaymenType.PERHOURS },
            scope: { complexity: job.scope.complexity || EComplexity.EASY, duration: job.scope.duration || 1 },
            budget: job.budget || 1,
            experienceLevel: job.experienceLevel || [ELevel.BEGINNER],
            reqSkills: job.reqSkills || [],
            checkLists: job.checkLists || [],
            attachments: job.attachments || [],
            tags: job.tags || [],
            questions: job.questions || [],
            preferences: {
              nOEmployee: job.preferences.nOEmployee || 1,
              locations: job.preferences.locations || [],
            },
            visibility: job.visibility || true,
            jobDuration: job.jobDuration || 'short-term',
          })
          setBtns({
            started: false,
            title: false,
            description: false,
            details: false,
            expertise: false,
            visibility: false,
            budget: false,
            review: false,
          })
        })
        .catch(err => {
          console.log(err)
          message.error('Failed to load this job!')
          navigate('/')
        })
        .finally(() => setLoading(false))

      return
    }
    if (!client?.paymentVerified) {
      setOpenVerifyModal(true)
    } else {
      setOpenVerifyModal(false)
    }

    // navigate('/create-profile')
    if (user.jobsPoints < SICKPOINTS_PER_POST) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }, [])

  if (loading)
    return (
      <div className="d-flex" style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Loader />
      </div>
    )

  return (
    <StepContext.Provider value={{ step, setStep, isEdit }}>
      <VerifyPaymentModal open={openVerifyModal} handleClose={() => setOpenVerifyModal(false)} />

      {showWarning && !openVerifyModal && !isEdit ? (
        <Modal
          open={true}
          title={
            <Title level={5} style={{ color: '#eb2f96' }}>
              <AlertFilled color="#eb2f96" style={{ marginRight: 8 }} />
              Not enough jobsPoints to create a job
            </Title>
          }
          onOk={() => navigate('/buyconnects')}
          onCancel={() => navigate('/')}
          cancelText={t('Back to Home')}
          okText={t('Buy now')}
        >
          <p>
            You need to have at least {SICKPOINTS_PER_POST} <DollarTwoTone twoToneColor="#eb2f96" /> jobsPoints to post
            a job.
          </p>
        </Modal>
      ) : null}

      <section className="sec-bg-cn p-4" style={{ minHeight: '100vh' }}>
        <div className="container">
          <Row style={{ padding: '20px 0px' }}>
            <Card style={{ width: '100%' }}>
              <Breadcrumb
                items={[
                  {
                    path: isEdit ? `/job-details/${id}` : '/',
                    title: (
                      <>
                        <HomeOutlined />
                        <span className="fw-bold">{isEdit ? t('Job details') : t('Home')}</span>
                      </>
                    ),
                  },
                  {
                    title: (
                      <>
                        <EditOutlined />
                        <span className="fw-bold">{isEdit ? t('Edit job') : t('Post Job')}</span>
                      </>
                    ),
                  },
                ]}
              />
            </Card>
          </Row>
          <div className="row">
            <div className="col-lg-3">
              <PostJobAside btns={btns} />
            </div>
            <div className="col-lg-9">
              {step === 'started' && <PostJobGetStarted setBtns={setBtns} btns={btns} isEdit={isEdit} />}
              {step === 'title' && <PostJobTitle setBtns={setBtns} btns={btns} />}
              {step === 'description' && <PostJobDescription setBtns={setBtns} btns={btns} />}
              {step === 'details' && <PostJobDetails setBtns={setBtns} btns={btns} />}
              {step === 'expertise' && <PostJobExpertise setBtns={setBtns} btns={btns} />}
              {step === 'visibility' && <PostJobVisibility setBtns={setBtns} btns={btns} />}
              {step === 'budget' && <PostJobBudget setBtns={setBtns} btns={btns} />}
              {step === 'review' && <PostJobReview />}
            </div>
          </div>
        </div>
      </section>
    </StepContext.Provider>
  )
}
