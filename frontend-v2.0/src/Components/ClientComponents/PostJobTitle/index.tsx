import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CategoriesPicker from 'src/Components/SharedComponents/CategoriesPicker'
import { useSubscription } from 'src/libs/global-state-hook'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'

export default function PostJobTitle({ setBtns, btns }) {
  const { setStep } = useContext(StepContext)
  const {
    state: { title, categories },
  } = useSubscription(postJobSubscribtion, ['title', 'categories'])
  const [job, setJob] = useState({ jobTitle: title || '', jobCategory: categories || [] })
  const { t } = useTranslation(['main'])

  const getData = e => {
    const val = e.target.value
    const name = e.target.name

    switch (name) {
      case 'JobCategory':
        job.jobCategory = val
        setJob({ ...job, jobCategory: job.jobCategory })
        break
      case 'jobTitle':
        job.jobTitle = val
        setJob({ ...job, jobTitle: job.jobTitle })
        break
      default:
        break
    }
  }

  const handleCategoryChange = val => {
    setJob({ ...job, jobCategory: val.map(item => item.value) })
  }

  const addData = () => {
    postJobSubscribtion.updateState({
      title: job.jobTitle,
      categories: job.jobCategory,
    })
    setBtns({ ...btns, description: false })
    setStep('description')
  }

  return (
    <>
      <section className=" bg-white border rounded pt-4">
        <div className="border-bottom ps-4">
          <h4>{t('Title')}</h4>
          <p>{t('Step 1 of 7')}</p>
        </div>
        <div className="ps-4 mt-3">
          <p className="fw-bold">
            {t('Enter the name of your job post')} <span className="text-danger">*</span>
          </p>
          <input className="form-control w-75 shadow-none" name="jobTitle" onInput={getData} value={job.jobTitle} />
          {job.jobTitle.length < 4 && job.jobTitle !== '' ? (
            <p className="text-danger fw-bold mt-2">
              <i className="fas fa-exclamation-circle me-2"></i>
              {t('Title should be more than 3 characters')}
            </p>
          ) : (
            ''
          )}
          {job.jobTitle.split(' ').length < 3 && job.jobTitle !== '' ? (
            <p className="text-danger fw-bold mt-2">
              <i className="fas fa-exclamation-circle me-2"></i>
              {t('Title should be more than 2 words')}
            </p>
          ) : (
            ''
          )}
          {job.jobTitle === job.jobTitle.toUpperCase() && job.jobTitle !== '' ? (
            <p className="text-danger fw-bold">
              <i className="fas fa-exclamation-circle me-2"></i>
              {t('Title should not be all uppercase letters')}
            </p>
          ) : (
            ''
          )}
          <p className="fw-bold mt-2">{t('Here are some good examples:')}</p>
          <ul style={{ listStyle: 'disc' }}>
            <li>{t('CAD designer to create a 3D model of a residential building')}</li>
            <li>{t('Need a design for a new company logo')}</li>
          </ul>
        </div>
      </section>

      <section className=" bg-white border rounded mt-3 pt-4">
        <div className="border-bottom ps-4 pb-4">
          <h4>{t('Job Category')}</h4>
          <p className="w-75">
            {t(
              "Let's categorize your job, which helps us personalize your job details and match your job to relevant freelancers and agencies."
            )}
          </p>

          <CategoriesPicker
            reset={false}
            handleChange={handleCategoryChange}
            istakeValue={true}
            data={job.jobCategory}
          ></CategoriesPicker>
        </div>
        <div className="ps-4 my-3">
          <button className="btn">
            <span className="btn border text-success me-4 px-5" onClick={() => setStep('started')}>
              {t('Back')}
            </span>
          </button>
          <button className={`btn ${job.jobTitle === '' || !job.jobCategory?.length ? 'disabled' : ''}`}>
            <span className="btn bg-jobsicker px-5" onClick={addData}>
              {t('Next')}
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
