import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { EStep } from 'src/pages/FreelancerPages/CreateProfile'

export default function CreateProfileAside({ profileStep, step }) {
  const { t } = useTranslation(['main'])
  return (
    <aside>
      <ul>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 1}>
            <Link
              to="/create-profile"
              onClick={() => profileStep({ step: EStep.CATEGORY })}
              className={`d-flex justify-content-between ${step >= 1 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fa-list-alt mx-4"></i>
                {t('Categories')}
              </span>
              <i className={`fas fa-check-circle ${step < 1 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 2}>
            <Link
              to="/create-profile"
              onClick={() => profileStep({ step: EStep.EXPERTISELEVEL })}
              className={`d-flex justify-content-between ${step >= 2 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fa-signal mx-4"></i>
                {t('Expertise')}
              </span>
              <i className={`fas fa-check-circle ${step < 2 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 3}>
            <Link
              to="/create-profile"
              onClick={() => profileStep({ step: EStep.EDUANDEMP })}
              className={`d-flex justify-content-between ${step >= 3 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fa-school mx-4"></i>Edu & Emp
              </span>
              <i className={`fas fa-check-circle ${step < 3 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 4}>
            <Link
              onClick={() => profileStep({ step: EStep.LANGUAGE })}
              to="/create-profile"
              className={`d-flex justify-content-between ${step >= 4 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fa-language mx-4"></i>
                {t('Languages')}
              </span>
              <i className={`fas fa-check-circle ${step < 4 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 5}>
            <Link
              to="/create-profile"
              onClick={() => profileStep({ step: EStep.HOURLYRATE })}
              className={`d-flex justify-content-between ${step >= 5 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fa-search-dollar mx-4"></i>
                {t('Expected Amount')}
              </span>
              <i className={`fas fa-check-circle ${step < 5 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 6}>
            <Link
              to="/create-profile"
              onClick={() => profileStep({ step: EStep.TITLEANDOVERVIEW })}
              className={`d-flex justify-content-between ${step >= 6 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fa-id-card mx-4"></i>Title & Overview
              </span>
              <i className={`fas fa-check-circle ${step < 6 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 7}>
            <Link
              to="/create-profile"
              onClick={() => profileStep({ step: EStep.PROFILEPHOTO })}
              className={`d-flex justify-content-between ${step >= 7 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fas fa-camera mx-4"></i>Profile Photo
              </span>
              <i className={`fas fa-check-circle ${step < 7 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 8}>
            <Link
              to="/create-profile"
              onClick={() => profileStep({ step: EStep.LOCATION })}
              className={`d-flex justify-content-between ${step >= 8 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fa-map-marker-alt mx-4"></i>
                {t('Location')}
              </span>
              <i className={`fas fa-check-circle ${step < 8 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
        <li className="py-1 my-2">
          <button className="btn w-100" disabled={step < 9}>
            <Link
              to="/create-profile"
              onClick={() => profileStep({ step: EStep.PHONENUMBER })}
              className={`d-flex justify-content-between ${step >= 9 && 'border-start border-4 border-success'}`}
            >
              <span className="text-dark">
                <i className="fas fa-phone-alt mx-4"></i>
                {t('Phone')}
              </span>
              <i className={`fas fa-check-circle ${step < 9 && 'text-dark'}`}></i>
            </Link>
          </button>
        </li>
      </ul>
    </aside>
  )
}
