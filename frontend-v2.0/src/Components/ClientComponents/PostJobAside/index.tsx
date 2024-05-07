/* eslint-disable jsx-a11y/anchor-is-valid */
import { Card } from 'antd'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import './PostJobAside.css'
export default function PostJobAside({ btns }) {
  const { setStep } = useContext(StepContext)
  const { t } = useTranslation(['main'])
  return (
    <aside>
      <Card bodyStyle={{ padding: 10 }}>
        <div className="py-1 my-2">
          <button className="btn w-100" disabled={btns.started} onClick={() => setStep('started')}>
            <a
              className={`d-flex justify-content-between ${!btns.started && 'border-start border-4 border-success'}`}
              style={{ alignItems: 'center' }}
            >
              <span className="text-dark">
                <i className="fas fa-shapes mx-4"></i>
                {t('Started')}
              </span>
              <i className={`fas fa-check-circle ${btns.started && 'text-dark'}`}></i>
            </a>
          </button>
        </div>
        <div className="py-1 my-2">
          <button className="btn w-100" disabled={btns.title} onClick={() => setStep('title')}>
            <a
              className={`d-flex justify-content-between ${!btns.title && 'border-start border-4 border-success'}`}
              style={{ alignItems: 'center' }}
            >
              <span className="text-dark">
                <i className="fas fa-pencil-alt mx-4"></i>
                {t('Title')}
              </span>
              <i className={`fas fa-check-circle ${btns.title && 'text-dark'}`}></i>
            </a>
          </button>
        </div>
        <div className="py-1 my-2">
          <button className="btn w-100" disabled={btns.description} onClick={() => setStep('description')}>
            <a
              className={`d-flex justify-content-between ${
                !btns.description && 'border-start border-4 border-success'
              }`}
              style={{ alignItems: 'center' }}
            >
              <span className="text-dark">
                <i className="fas fa-edit mx-4"></i>
                {t('Description')}
              </span>
              <i className={`fas fa-check-circle ${btns.description && 'text-dark'}`}></i>
            </a>
          </button>
        </div>
        <div className="py-1 my-2">
          <button className="btn w-100" disabled={btns.details} onClick={() => setStep('details')}>
            <a
              className={`d-flex justify-content-between ${!btns.details && 'border-start border-4 border-success'}`}
              style={{ alignItems: 'center' }}
            >
              <span className="text-dark">
                <i className="fas fa-list-alt mx-4"></i>
                {t('Details')}
              </span>
              <i className={`fas fa-check-circle ${btns.details && 'text-dark'}`}></i>
            </a>
          </button>
        </div>
        <div className="py-1 my-2">
          <button className="btn w-100" disabled={btns.expertise} onClick={() => setStep('expertise')}>
            <a
              className={`d-flex justify-content-between ${!btns.expertise && 'border-start border-4 border-success'}`}
              style={{ alignItems: 'center' }}
            >
              <span className="text-dark">
                <i className="fas fa-tools mx-4"></i>
                {t('Expertise')}
              </span>
              <i className={`fas fa-check-circle ${btns.expertise && 'text-dark'}`}></i>
            </a>
          </button>
        </div>
        <div className="py-1 my-2">
          <button className="btn w-100" disabled={btns.visibility} onClick={() => setStep('visibility')}>
            <a
              className={`d-flex justify-content-between ${!btns.visibility && 'border-start border-4 border-success'}`}
              style={{ alignItems: 'center' }}
            >
              <span className="text-dark">
                <i className="fas fa-user-clock mx-4"></i>
                {t('Visibility')}
              </span>
              <i className={`fas fa-check-circle ${btns.visibility && 'text-dark'}`}></i>
            </a>
          </button>
        </div>
        <div className="py-1 my-2">
          <button className="btn w-100" disabled={btns.budget} onClick={() => setStep('budget')}>
            <a
              className={`d-flex justify-content-between ${!btns.budget && 'border-start border-4 border-success'}`}
              style={{ alignItems: 'center' }}
            >
              <span className="text-dark">
                <i className="fas fa-search-dollar mx-4"></i>
                {t('Budget')}
              </span>
              <i className={`fas fa-check-circle ${btns.budget && 'text-dark'}`}></i>
            </a>
          </button>
        </div>
        <div className="py-1 my-2">
          <button className="btn w-100" disabled={btns.review} onClick={() => setStep('review')}>
            <a
              className={`d-flex justify-content-between ${!btns.review && 'border-start border-4 border-success'}`}
              style={{ alignItems: 'center' }}
            >
              <span className="text-dark">
                <i className="fas fa-check mx-4"></i>
                {t('Review')}
              </span>
              <i className={`fas fa-check-circle ${btns.review && 'text-dark'}`}></i>
            </a>
          </button>
        </div>
      </Card>
    </aside>
  )
}
