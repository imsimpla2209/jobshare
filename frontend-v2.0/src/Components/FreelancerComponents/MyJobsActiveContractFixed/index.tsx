/* eslint-disable jsx-a11y/alt-text */

import React from 'react'
import { Link } from 'react-router-dom'
import './styles.css'
import { useSubscription } from 'src/libs/global-state-hook'
import { locationStore } from 'src/Store/commom.store'
import { useTranslation } from 'react-i18next'
import { currencyFormatter, timeAgo } from 'src/utils/helperFuncs'
import workingimg from '../../../assets/img/working.png'

export default function MyJobsActiveContractFixed({ myJob }: any) {
  const locations = useSubscription(locationStore).state
  const { t } = useTranslation(['main'])

  return (
    // Card Start -->
    <div className="card">
      {/* Put Image Here --> */}
      <div className="card-body">

        <div className="card-company-fit">


          <div style={{
            borderRadius: '50%',
            height: '64px',
            width: '64px',
          }}>
            {/* Avatar image --> */}
            <img
              src={workingimg}
              style={{
                borderRadius: '10%',
                height: '100%',
                width: '100%',
              }}
            />
          </div>

          <div className="card-vote-on-job">
            {/* <div className="card-favorite-icon">
              <i className="far fa-thumbs-up"></i>
            </div>
            <div className="card-hide-icon">
              <i className="far fa-thumbs-down"></i>
            </div> */}
          </div>

        </div>

        <h5 className="card-title job-title">{myJob?.job?.title}</h5>

        <div className="card-company-glassdoor">
          <p className="card-company-name text-truncate ">{myJob?.job?.description}</p>
          <p className="glassdoor-rating"> </p>
        </div>

        {/* Company Rating --> */}
        <div className="card-job-details mb-3">
          <p className="card-company-location">
            <i className="fas fa-map-marker-alt"></i>
            {
              myJob?.job?.preferences?.locations.map(l => (
                <span key={l} style={{ marginLeft: 2 }}>
                  {locations?.find(s => s.code === l.toString())?.name} |
                </span>
              ))
            }
          </p>


          <p className="card-role-type">
            <i className="fas fa-briefcase"></i>
            Contract
          </p>


          <p className="card-job-duration">
            <i className="fas fa-clock"></i>
            {t("Start working from")} -
            <span style={{ marginLeft: 2 }}>{timeAgo(myJob?.startDate, t)}</span>
          </p>

          <p className="card-listing-date">
            <i className="fas fa-upload"></i>
            {t("End date")} -
            <span style={{ marginLeft: 2 }}>{new Date(myJob?.endDate).toLocaleString()}</span>
          </p>

          <p className="card-salary-range">
            <i className="fas fa-wallet"></i>
            {currencyFormatter(myJob?.agreeAmount)} / {t(`${myJob?.paymentType}`)}
          </p>

        </div>

        <strong style={{  }}>{t("Check Lists")}</strong>

        <div className="skills-container">
          {myJob?.job?.checkLists?.map(cl => (
            <dl key={cl} style={{
              alignItems: 'center',
              display: 'flex',

              justifyContent: 'space-between',

              borderBottom: `1px solid rgba(0, 0, 0, 0.3)`,

              margin: '0px',
              padding: '8px 0px',
            }}
            >

              <dt>{cl}</dt>

              <dd>{t("In Progress")}</dd>
            </dl>
          ))}
        </div>
        {/* <div className="card-job-summary">
          <p className="card-text">IT Applications Developers III will lead the design, implmentation and support of internal application. They are also responsible for maintaining the application as well as verifying the accuracy ...</p>
        </div> */}

        <Link to={`/job/applied/${myJob?.job?._id || myJob?.job?.id}`} target="_blank" className="me-4 btn btn-primary" rel="noreferrer">
          {/* <i className="fab fa-github"></i> */}
          {/* <i className="fab fa-linkedin-in"></i> --> */}
          {t("View job posting")}
        </Link>

        <Link to={`/messages?proposalId=${myJob?.proposal}`} className="btn btn-success" rel="noreferrer">
          <i className="fas fa-door-open me-2"></i>
          {/* <i className="fab fa-linkedin-in"></i> --> */}
          {t("Go to messaging")}
        </Link>
        {/* --> */}
      </div>
    </div >
  )
}
