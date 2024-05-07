import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from 'src/libs/global-state-hook'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { EJobType } from 'src/utils/enum'
import { postJobSubscribtion } from '../PostJobGetStarted'
import { Paragraph } from '../PostJobReview'
import './style.css'

export default function PostJobDetails({ setBtns, btns }) {
  const {
    state: { type, checkLists },
  } = useSubscription(postJobSubscribtion, ['type', 'checkLists'])

  const { setStep } = useContext(StepContext)
  const [job, setJob] = useState<{ type: EJobType }>({ type: type || null })
  const { t } = useTranslation(['main'])
  const [inputVal, setInputVal] = useState('')
  const [checklist, setchecklist] = useState(checkLists || [])

  const addChecklist = () => {
    checklist.push(inputVal)
    setchecklist(checklist)
    setInputVal('')
  }

  const getData = e => {
    const val = e.target.value
    const name = e.target.name
    switch (name) {
      case 'checklist':
        setInputVal(val)
        break
      default:
        setJob({ type: val })

        break
    }
  }

  const addData = () => {
    postJobSubscribtion.updateState({
      type: job.type,
      checkLists: checklist,
    })
    setBtns({ ...btns, expertise: false })
    setStep('expertise')
  }

  return (
    <>
      <section className=" bg-white border rounded  pt-4">
        <div className="border-bottom ps-4">
          <h4>{t('Details')}</h4>
          <p>{t('Step 3 of 7')}</p>
        </div>
        <div className="px-4 mt-3 mb-4">
          <p className="fw-bold mt-2">{t('What type of project do you have?')}</p>
          <div className="my-4 d-flex justify-content-between" onInput={getData}>
            <label className="border border-success rounded p-3 text-center">
              <input
                type="radio"
                className="float-end"
                name="type"
                onInput={e => setJob({ type: (e.target as any).value })}
                value={EJobType.ONE_TIME_PROJECT}
                defaultChecked={job.type === EJobType.ONE_TIME_PROJECT}
              />
              <div>
                <i className="fas fa-briefcase"></i>
              </div>
              <h6 className="my-3">{t('One-time project')}</h6>
              <div>{t('Find the right skills for a short-term need.')}</div>
            </label>
            <label className="border border-success rounded p-3 text-center mx-3">
              <input
                type="radio"
                className="float-end"
                name="type"
                onInput={e => setJob({ type: (e.target as any).value })}
                value={EJobType.ONGOING_PROJECT}
                defaultChecked={job.type === EJobType.ONGOING_PROJECT}
              />
              <div>
                <i className="fas fa-list-alt"></i>
              </div>
              <h6 className="my-3">{t('Ongoing project')}</h6>
              {t('Find a skilled resource for an extended engagement.')}
            </label>
            <label className="border border-success rounded p-3 text-center">
              <input
                type="radio"
                className="float-end"
                name="type"
                onInput={e => setJob({ type: (e.target as any).value })}
                value={EJobType.COMPLEX_PROJECTS}
                defaultChecked={job.type === EJobType.COMPLEX_PROJECTS}
              />
              <div>
                <i className="fas fa-th-large"></i>
              </div>
              <h6 className="my-3">{t('Complex project')}</h6>
              <div>{t('Find specialized experts and agencies for large projects.')}</div>
            </label>
          </div>

          <p className="fw-bold">{t('Enter the checklist of your job post?')}</p>
          <div className="my-4 d-flex justify-content-between">
            <input
              className="form-control w-75 shadow-none"
              type="text"
              name="checklist"
              value={inputVal}
              onChange={getData}
            />
            <button className="btn bg-jobsicker px-5" disabled={!inputVal} onClick={addChecklist}>
              Add
            </button>
            <div className="my-4 d-flex justify-content-between"></div>
          </div>
          <Paragraph>
            <ul>
              {checklist.map((item, index) => (
                <li key={index}>
                  <span className="text-muted fw-bold">{item}</span>
                </li>
              ))}
            </ul>
          </Paragraph>
        </div>
      </section>

      <section className="bg-white border rounded mt-3">
        <div className="ps-4 my-3">
          <button className="btn" onClick={() => setStep('description')}>
            <span className="btn border text-success me-4 px-5">{t('Back')}</span>
          </button>
          <button className={`btn ${!job.type && 'disabled'}`}>
            <span className="btn bg-jobsicker px-5" onClick={addData}>
              {t('Next')}
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
