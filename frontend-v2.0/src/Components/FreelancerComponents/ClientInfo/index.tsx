/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import StarsRating from './../../SharedComponents/StarsRating/StarsRating'
import { useSubscription } from 'src/libs/global-state-hook'
import { locationStore } from 'src/Store/commom.store'
import { currencyFormatter, randomDate } from 'src/utils/helperFuncs'

export default function ClientInfo({ client }) {
  const { t } = useTranslation(['main'])
  const locations = useSubscription(locationStore).state

  useEffect(() => {}, [])

  return (
    <div className="bg-white py-lg-4 px-4 border border-1 py-sm-3 py-xs-5">
      <h5>{t('ClientInfo')}</h5>
      <h6 className="fw-bold py-sm-3">
        <span className="fw-bold" style={{ color: client?.paymentVerified ? '#14bff4' : 'red' }}>
          <i
            className={`${client?.paymentVerified ? 'fas fa-check-circle' : 'far fa-times-circle'} me-1`}
            style={{ color: client?.paymentVerified ? '#14bff4' : 'red' }}
          />
          {client?.paymentVerified ? 'Account verified' : 'Account unverified'}
        </span>
      </h6>
      <p className="text-muted">
        <StarsRating clientReview={client?.rating} index={1} />
        <StarsRating clientReview={client?.rating} index={2} />
        <StarsRating clientReview={client?.rating} index={3} />
        <StarsRating clientReview={client?.rating} index={4} />
        <StarsRating clientReview={client?.rating} index={5} />
      </p>
      <div className="my-3">
        <div className="text-muted">{t('Location')}:</div>
        <div className="d-flex flex-wrap fw-bold">
          {client?.preferLocations?.map(l => (
            <span key={l} className="fw-bold me-4">
              <i className="fas fa-map-marker-alt me-2" />
              {locations?.find(s => s.code === l.toString())?.name} |
            </span>
          ))}
        </div>
      </div>
      <p>
        <span className="text-muted">Jobs posted: </span>
        <strong>{client?.jobs?.length}</strong>
      </p>
      {/* <p><span className="text-muted">Hired: </span><strong>{client?.closed}</strong></p> */}
      {/* <p><span className="text-muted">Hire rate: </span><strong>{client?.closed ? client?.closed * 100 / client?.allJobs : 0}%</strong></p> */}
      {/* <p><span className="text-muted">Open jobs: </span><strong>{client?.public}</strong></p> */}
      <p>
        <span className="text-muted">Spent: </span>
        <strong>{currencyFormatter(client?.spent)}</strong>
      </p>
      {/* <p><span className="text-muted">Active: </span><strong>{client?.hired}</strong></p> */}
      <p>
        <span className="text-muted">Member since: </span>
        <strong>
          {client?.createdAt || client?.updatedAt
            ? new Date(`${client?.createdAt}`).toLocaleString()
            : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}
        </strong>
      </p>
    </div>
  )
}
