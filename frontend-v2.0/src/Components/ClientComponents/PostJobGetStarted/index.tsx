/* eslint-disable react-hooks/exhaustive-deps */
import { DollarCircleTwoTone, FrownOutlined, SmileOutlined } from '@ant-design/icons'
import { InputNumber, Slider } from 'antd'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { appInfoStore } from 'src/Store/commom.store'
import { userStore } from 'src/Store/user.store'
import { createSubscription, useSubscription } from 'src/libs/global-state-hook'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { ICreateJobBody } from 'src/types/job'
import { EComplexity, EJobType, ELevel, EPaymenType, SICKPOINTS_PER_POST } from 'src/utils/enum'

export const defaultPostJobState: ICreateJobBody = {
  client: '',
  title: '',
  description: '',
  categories: [],
  type: EJobType.ONE_TIME_PROJECT,
  payment: { amount: 100, type: EPaymenType.PERHOURS },
  scope: { complexity: EComplexity.EASY, duration: 1 },
  budget: 1,
  experienceLevel: [ELevel.BEGINNER],
  reqSkills: [],
  checkLists: [],
  attachments: [],
  tags: [],
  questions: [],
  preferences: {
    nOEmployee: 1,
    locations: [],
  },
  visibility: true,
  jobDuration: 'short-term',
}

export const postJobSubscribtion = createSubscription<ICreateJobBody>(defaultPostJobState)

const complexityOptions = [
  {
    label: 'Easy',
    value: EComplexity.EASY,
  },
  {
    label: 'Medium',
    value: EComplexity.MEDIUM,
  },
  {
    label: 'Hard',
    value: EComplexity.HARD,
  },
  {
    label: 'Hell',
    value: EComplexity.HELL,
  },
]

export default function PostJobGetStarted({ setBtns, btns, isEdit }) {
  const {
    state: {
      jobDuration,
      scope: { duration, complexity },
    },
  } = useSubscription(postJobSubscribtion, ['jobDuration', 'scope'])
  const [value, setValue] = useState(complexity || 0)

  const { state: appInfo } = useSubscription(appInfoStore)
  const { state: user } = useSubscription(userStore)

  const mid = Number((3 / 2).toFixed(5))
  const preColorCls = value >= mid ? '' : 'icon-wrapper-active'
  const nextColorCls = value >= mid ? 'icon-wrapper-active' : ''

  const { setStep } = useContext(StepContext)
  const [start, setStart] = useState(false)
  const { t } = useTranslation(['main'])
  const [job, setJob] = useState({ jobDuration: jobDuration || '' })
  const [durationLength, setDurationLength] = useState(duration || 1)

  const createJob = () => {
    setStart(true)
  }

  const getData = ({ target }) => {
    job.jobDuration = target.value
    setJob({ ...job, jobDuration: job.jobDuration })
  }

  const addData = () => {
    postJobSubscribtion.updateState({
      jobDuration: job.jobDuration,
      scope: {
        duration: durationLength,
        complexity: value,
      },
    })
    setBtns({ ...btns, title: false })
    setStep('title')
  }

  return (
    <section className=" bg-white border rounded pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>{t('Getting started')}</h4>
      </div>
      {!start && !isEdit ? (
        <div className="ps-4 my-3">
          <span className="fw-bold mb-3" style={{ display: 'block' }}>
            {t('When you post a job, your jobsPoints will be decreased by')}
            {` ${appInfo?.clientSicks?.postJob || SICKPOINTS_PER_POST} `}
            <DollarCircleTwoTone twoToneColor="#eb2f96" />
          </span>

          <button
            className="btn bg-jobsicker"
            disabled={user?.jobsPoints < (appInfo?.clientSicks?.postJob || SICKPOINTS_PER_POST)}
            onClick={createJob}
          >
            {t('Get Start')}
          </button>
        </div>
      ) : (
        <>
          <div className="mx-4 mt-4">
            <span className="fw-bold">{t('What would you like to do?')}</span>
            <div className=" w-75 my-4 ms-4 d-flex justify-content-between" onInput={getData}>
              <label className="border border-success rounded p-3 text-center">
                <input
                  type="radio"
                  className="float-end"
                  name="short-long-job"
                  value="short-term"
                  defaultChecked={job.jobDuration === 'short-term'}
                />
                <div>
                  <i className="far fa-clock"></i>
                </div>
                <h5 className="my-3">{t('Short-term or part-time work')}</h5>
                <div>{t('Less than 30 hrs/week')}</div>
                <div>{t('Less than 3 months')}</div>
              </label>
              <label className="border border-success rounded p-3 text-center">
                <input
                  type="radio"
                  className="float-end"
                  name="short-long-job"
                  value="long-term"
                  defaultChecked={job.jobDuration === 'long-term'}
                />
                <div>
                  <i className="far fa-calendar-plus"></i>
                </div>
                <h5 className="my-3">{t('Designated, longer term work')}</h5>
                <div>{t('More than 30 hrs/week')}</div>
                <div>{t('3+ months')}</div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="fw-bold">{t('Duration (in months) of your job is:')}</span>
              <InputNumber min={0} value={durationLength} onChange={val => setDurationLength(val)} />
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="fw-bold">{t('Complexity of your job is:')}</span>

              <FrownOutlined className={preColorCls} />
              <Slider
                style={{ minWidth: '40%' }}
                min={0}
                max={3}
                onChange={setValue}
                value={value}
                tooltip={{ formatter: val => `${complexityOptions.find(item => item.value === val).label}` }}
              />
              <SmileOutlined className={nextColorCls} />
            </div>
          </div>
          <div className="ps-4 my-3">
            <button className="btn">
              <Link className="btn border text-success me-4 px-5 fw-bold" to="/home">
                {t('Cancel')}
              </Link>
            </button>
            <button className={`btn ${job.jobDuration === '' ? 'disabled' : ''}`}>
              <span className="btn bg-jobsicker px-5" onClick={addData}>
                {t('Continue')}
              </span>
            </button>
          </div>
        </>
      )}
    </section>
  )
}
