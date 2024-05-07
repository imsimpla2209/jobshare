/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import StarsRating from 'src/Components/SharedComponents/StarsRating/StarsRating'
import { locationStore } from 'src/Store/commom.store'
import { useSubscription } from 'src/libs/global-state-hook'
import img from '../../../assets/img/icon-user.svg'
import { currencyFormatter, randomDate } from 'src/utils/helperFuncs'
// import './styles.css'
import { Button, Card } from 'react-bootstrap'
import { Avatar, Space } from 'antd'
import { Link } from 'react-router-dom'
import { freelancerStore } from 'src/Store/user.store'
import { updateFreelancer } from 'src/api/freelancer-apis'

const ClientCard = ({ client, total, clientId }: any) => {
  const locations = useSubscription(locationStore).state
  const { t } = useTranslation(['main'])
  const freelancer = useSubscription(freelancerStore).state
  const setFreelancer = useSubscription(freelancerStore).setState

  const [cardState, setCardState] = useState<any>(
    freelancer?.favoriteClients?.includes(clientId)
      ? {
          friends: total,
          icon: 'cancel',
          text: 'Unfollow',
          btnStyle: {
            color: 'maroon',
            cursor: 'normal',
            animation: 'spin 200ms ease-in-out',
          },
        }
      : {
          friends: total,
          icon: 'add_circle',
          text: 'Follow',
          btnStyle: {
            color: 'limegreen',
            cursor: 'pointer',
            animation: 'spinBack 200ms ease-in-out',
          },
        }
  )

  const follow = e => {
    e.preventDefault()
    let currentIcon = cardState.icon
    let currentText = cardState.text
    let currentFriends = cardState.friends
    if (currentIcon === 'add_circle' && currentText === 'Follow') {
      updateFreelancer(
        { favoriteClients: freelancer.favoriteClients ? [...freelancer.favoriteClients, clientId] : [clientId] },
        freelancer._id
      ).then(res => {
        setFreelancer(res.data)
      })
      setCardState({
        friends: currentFriends + 1,
        icon: 'cancel',
        text: 'Unfollow',
        btnStyle: {
          color: 'maroon',
          cursor: 'normal',
          animation: 'spin 200ms ease-in-out',
        },
      })
    } else {
      updateFreelancer(
        { favoriteClients: freelancer.favoriteClients?.filter(c => c !== clientId) },
        freelancer._id
      ).then(res => {
        setFreelancer(res.data)
      })
      setCardState({
        friends: currentFriends - 1,
        icon: 'add_circle',
        text: 'Follow',
        btnStyle: {
          color: 'limegreen',
          cursor: 'pointer',
          animation: 'spinBack 200ms ease-in-out',
        },
      })
    }
  }

  const renderLocations = () => {
    return client?.preferLocations?.map(l => (
      <span key={l} className="fw-bold me-1">
        {locations?.find(s => s.code === l.toString())?.name} |
      </span>
    ))
  }

  return (
    <Card className="shadow">
      <Card.Body className="w-100" style={{ width: '100%' }}>
        <div className="d-flex align-items-center w-100" style={{ width: '100%' }}>
          <Avatar
            src={client?.user?.avatar ? client?.user?.avatar : img}
            alt=""
            style={{
              width: '140px',
              height: '140px',
            }}
            className="rounded-circle me-3 "
          />
          <div className="w-100">
            <h2 className="mb-1">{client?.name || client?.user?.name}</h2>
            <h6 className={`fw-bold mb-3 text-${client?.paymentVerified ? 'primary' : 'danger'}`}>
              <i className={`${client?.paymentVerified ? 'fas' : 'far'} fa-check-circle me-1`} />
              {client?.paymentVerified ? t('Paymentverified') : t('Paymentunverified')}
            </h6>
            <div className="text-muted mb-3 me-3 ">{client?.intro}</div>
            <div className="mb-2 d-flex flex-column flex-md-row flex-wrap align-items-center">
              <div className="text-muted mb-3 d-flex flex-wrap">
                <i className="fas fa-map-marker-alt me-2" />
                {renderLocations()}
              </div>
            </div>
            <p className="text-muted mb-0 text-end w-100">
              <span className="fw-bold me-2">{t('Member since')}: </span>
              <strong>
                {client?.createdAt || client?.updatedAt
                  ? new Date(`${client?.createdAt}`).toLocaleString()
                  : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}
              </strong>
            </p>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="bg-light d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <i className="material-icons me-2"></i>
          <div>
            <span className="activity-name">Followers</span>
            <span className="fw-bold ms-2">{cardState.friends}</span>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <i className="bi bi-cash-stack me-2"></i>
          <div>
            <span className="activity-name">{t('Spent')}:</span>
            <span className="fw-bold ms-2">{currencyFormatter(client?.spent)}</span>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <i className="bi bi-duffle me-2"></i>
          <div>
            <span className="activity-name">{t('Posted Jobs')}:</span>
            <span className="fw-bold ms-2">{total || client?.jobs?.length}</span>
          </div>
        </div>
        <Button variant="outline-primary" onClick={follow}>
          {cardState.text}
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default ClientCard
