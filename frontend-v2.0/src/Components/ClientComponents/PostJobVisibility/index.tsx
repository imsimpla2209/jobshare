/* eslint-disable jsx-a11y/alt-text */
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import upwork from '../../../assets/img/TLpZ1jf.png'
import { postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'
import { EUserVisibility } from 'src/utils/enum'
import { InputNumber } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useSubscription } from 'src/libs/global-state-hook'

export default function PostJobVisibility({ setBtns, btns }) {
  const { setStep } = useContext(StepContext)
  const {
    state: {
      visibility,
      preferences: { nOEmployee },
    },
  } = useSubscription(postJobSubscribtion, ['visibility', 'preferences'])

  const [job, setJob] = useState<{ jobVisibility: EUserVisibility; freelancerNeed: number }>({
    jobVisibility: visibility ? EUserVisibility.ANYONE : EUserVisibility.VERIFIED_USER,
    freelancerNeed: nOEmployee || 1,
  })
  const { t } = useTranslation(['main'])

  const getData = e => {
    const val = e.target.value
    const name = e.target.name
    switch (name) {
      case 'visibility':
        job.jobVisibility = val
        setJob({ ...job, jobVisibility: job.jobVisibility })
        break

      default:
        break
    }
  }

  const handleFreelancerNeed = num => {
    setJob({ ...job, freelancerNeed: num })
  }

  const addData = () => {
    postJobSubscribtion.updateState({
      visibility: job.jobVisibility === EUserVisibility.ANYONE,
      preferences: { ...postJobSubscribtion.state.preferences, nOEmployee: job.freelancerNeed },
    })
    setBtns({ ...btns, budget: false })
    setStep('budget')
  }

  return (
    <>
      <section className=" bg-white border rounded  pt-4">
        <div className="border-bottom ps-4">
          <h4>{t('Visibility')}</h4>
          <p>{t('Step 5 of 7')}</p>
        </div>
        <div className="px-4 mt-3">
          <p className="fw-bold mt-2">{t('Who can see your job?')}</p>
          <div className="my-4 d-flex justify-content-center" onInput={getData}>
            <label className="border border-success rounded p-3 text-center w-50 " style={{ marginRight: 16 }}>
              <input
                type="radio"
                className="float-end"
                name="visibility"
                value={EUserVisibility.ANYONE}
                defaultChecked={job.jobVisibility === EUserVisibility.ANYONE}
              />
              <div>
                <i className="fas fa-user mt-4"></i>
              </div>
              <h6 className="my-3">{t('Anyone')}</h6>
              <small className="fw-normal">
                {t(
                  ' Looking for someone relativelyFreelancers and agencies using JobShare and public search engines can find this job.'
                )}
              </small>
            </label>
            <label className="border border-success rounded p-3 text-center w-50">
              <input
                type="radio"
                className="float-end"
                name="visibility"
                value={EUserVisibility.VERIFIED_USER}
                defaultChecked={job.jobVisibility === EUserVisibility.VERIFIED_USER}
              />
              <div className="w-50 mx-auto">
                <img className="bg-dark w-25 rounded-circle mt-4" src={upwork} />
              </div>
              <h6 className="my-3">{t('Only JobShare freelancer')}</h6>
              <small className="fw-normal">{t('Only JobShare users can find this job.')}</small>
            </label>
          </div>
        </div>
        <div className="px-4 mt-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="fw-bold mt-2">{t('How many people do you need for this job?')}</p>
          <InputNumber
            addonBefore={<UserOutlined />}
            style={{ width: '30%' }}
            onInput={handleFreelancerNeed}
            value={job.freelancerNeed}
          />
        </div>
      </section>

      <section className="bg-white border rounded mt-3">
        <div className="ps-4 my-3">
          <button className="btn" onClick={() => setStep('expertise')}>
            <span className="btn border text-success me-4 px-5">{t('Back')}</span>
          </button>
          <button className={`btn ${!job.jobVisibility || !job.freelancerNeed ? 'disabled' : ''}`}>
            <span className="btn bg-jobsicker px-5" onClick={addData}>
              {t('Next')}
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
