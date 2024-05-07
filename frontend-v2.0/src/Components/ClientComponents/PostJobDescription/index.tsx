import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './style.css'
/* eslint-disable jsx-a11y/alt-text */
import { DefaultUpload } from 'src/Components/CommonComponents/upload/upload'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'
import LocationPicker from 'src/Components/SharedComponents/LocationPicker'
import { useSubscription } from 'src/libs/global-state-hook'

export default function Postdescription({ setBtns, btns }) {
  const { setStep } = useContext(StepContext)
  const {
    state: {
      description: stateDescription,
      attachments,
      tags,
      questions,
      preferences: { locations: stateLocations },
    },
  } = useSubscription(postJobSubscribtion, ['description', 'attachments', 'tags', 'questions', 'preferences'])

  const { t } = useTranslation(['main'])

  let [description, setDescription] = useState(stateDescription || '')
  let [files, setFiles] = useState(attachments || [])
  const [inputVal, setInputVal] = useState('')
  const [inputQuestion, setInputQuestion] = useState('')
  const [tagList, settagList] = useState(tags || [])
  const [questionList, setquestionList] = useState(questions || [])
  const [locations, setLocations] = useState(stateLocations || [])

  const getData = e => {
    const val = e.target.value
    const name = e.target.name
    switch (name) {
      case 'jobTags':
        setInputVal(val)
        break
      case 'jobQuestions':
        setInputQuestion(val)
        break
      default:
        break
    }
  }

  const addQuestions = () => {
    questionList.push(inputQuestion)
    setquestionList(questionList)
    setInputQuestion('')
  }

  const addTags = () => {
    tagList.push(inputVal)
    settagList(tagList)
    setInputVal('')
  }

  const normFile = (fileList: any) => {
    // handle event file changes in upload and dragger components
    setFiles(fileList)
    return fileList
  }

  const handleChangeDescription = e => {
    const val = e.target.value
    setDescription(val)
  }

  const addData = () => {
    postJobSubscribtion.updateState({
      description,
      attachments: files,
      tags: tagList,
      questions: questionList,
      preferences: { ...postJobSubscribtion.state.preferences, locations },
    })
    setBtns({ ...btns, details: false })
    setStep('details')
  }

  const onChangeLocation = (locs: string[]) => {
    console.log(locs)
    setLocations(locs)
  }

  return (
    <section className=" bg-white border rounded pt-4">
      <div className="border-bottom ps-4">
        <h4>{t('Description')}</h4>
        <p>{t('Step 2 of 7')}</p>
      </div>
      <div className="ps-4 mt-3">
        <p className="fw-bold mt-2">A good description includes:</p>
        <ul style={{ listStyle: 'disc' }}>
          <li>{t('What the deliverable is')}</li>
          <li>{t("Type of freelancer or agency you're looking for")}</li>
          <li>{t('Anything unique about the project, team, or your company')}</li>
        </ul>
      </div>
      <div className="ps-4 pt-2 pe-4">
        <textarea
          className="form-control shadow-none"
          name="description"
          rows={8}
          onInput={handleChangeDescription}
          value={description}
        ></textarea>
        <span className="float-end">{t('0/5000 characters (minimum 50)')}</span>
      </div>

      <div className="mx-4 mt-5 py-2 pb-4">
        <div className="attachments-cn">
          <p className="pt-2 px-5 text-center">
            Drag or{' '}
            <label htmlFor="file" className="upw-c-cn me-1" style={{ cursor: 'pointer' }}>
              {t('upload')}
            </label>
            {t('Additional project files (optional)')}
            <DefaultUpload normFile={normFile} files={files}></DefaultUpload>
          </p>
        </div>
        <p className="my-3">
          {t('You may attach up to 10 files under the size of')} <strong>25MB</strong>{' '}
          {t(
            `each. Include work samples or other documents to support your application. Do not attach your résumé — your JobShare profile is automatically forwarded tothe client with your proposal.`
          )}
        </p>

        <p className="fw-bold">{t('Enter the tags for your job')}</p>
        <div className="my-3 d-flex justify-content-between">
          <input
            className="form-control w-75 shadow-none"
            type="text"
            name="jobTags"
            value={inputVal}
            onChange={getData}
            placeholder="Enter tags here..."
          />
          <button className="btn bg-jobsicker px-5" disabled={!inputVal} onClick={addTags}>
            Add
          </button>
        </div>
        {tagList.map((item, index) => (
          <div className="chip mb-3 ms" key="index">
            <span>{item}</span>
          </div>
        ))}

        <p className="fw-bold">{t('Enter the questions that you want to ask freelancers')}</p>
        <div className="my-3 d-flex justify-content-between">
          <input
            className="form-control w-75 shadow-none"
            type="text"
            name="jobQuestions"
            value={inputQuestion}
            onChange={getData}
            placeholder="Enter questions here..."
          />
          <button className="btn bg-jobsicker px-5" disabled={!inputQuestion} onClick={addQuestions}>
            Add
          </button>
        </div>
        {questionList.map((item, index) => (
          <div className="chip mb-3 ms" key="index">
            <span>{item}</span>
          </div>
        ))}

        <p className="fw-bold">{t('Add locations')}</p>
        <LocationPicker handleChange={onChangeLocation} data={stateLocations} />
      </div>

      <div className="ps-4 my-3 pt-4 pb-3 pt-3 border-top">
        <button className="btn" onClick={() => setStep('title')}>
          <span className="btn border text-success me-4 px-5">{t('Back')}</span>
        </button>
        <button className={`btn ${(description === '' || !locations?.length) && 'disabled'}`}>
          <span className="btn bg-jobsicker px-5" onClick={addData}>
            {t('Next')}
          </span>
        </button>
      </div>
    </section>
  )
}
