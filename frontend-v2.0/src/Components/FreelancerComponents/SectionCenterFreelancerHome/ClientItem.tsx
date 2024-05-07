import { Avatar, Col, Image, Row, Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { locationStore } from 'src/Store/commom.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { currencyFormatter, pickName, timeAgo } from 'src/utils/helperFuncs'
import defaultImg from 'src/assets/img/icon-user.svg'
import { ClockCircleFilled, StarFilled, StarOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import StarsRating from 'src/Components/SharedComponents/StarsRating/StarsRating'
import JobProposalsNumber from './JobProposalsNumber'
import { freelancerStore } from 'src/Store/user.store'
import { useState } from 'react'
import { updateFreelancer } from 'src/api/freelancer-apis'

export const ClientItem = ({ clientData, isRcmd }) => {
  const { client } = clientData

  const { state: locations } = useSubscription(locationStore)
  const { t, i18n } = useTranslation(['main'])
  console.log(client)
  const lang = i18n.language
  const { state: freelancer, setState: setFreelancer } = useSubscription(freelancerStore)
  const [isFollowed, setFollow] = useState(freelancer?.favoriteClients?.includes(clientData?._id))

  const follow = e => {
    e.preventDefault()
    if (!freelancer?.favoriteClients?.includes(clientData?._id)) {
      updateFreelancer(
        {
          favoriteClients: freelancer.favoriteClients
            ? [...freelancer.favoriteClients, clientData?._id]
            : [clientData?._id],
        },
        freelancer._id
      ).then(res => {
        setFollow(true)
      })
    } else {
      updateFreelancer(
        { favoriteClients: freelancer.favoriteClients?.filter(c => c !== clientData?._id) },
        freelancer._id
      ).then(res => {
        setFollow(false)
      })
    }
  }

  return (
    <div className="px-xl-1 px-1 mt-2 position-relative col me-2 mb-2">
      <div
        className="card-job client-card"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          // background: '#ccc',

          borderRadius: 12,
          // padding: 8,
          flex: 1,
          overflow: 'hidden',
          // height: '430px',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.5)',
            // backdropFilter: 'blur(15px)',
            boxShadow: '0 15px 25px rgba(0, 0, 0, 0.1)',
            width: '100%',
            padding: 12,
            // boxShadow: `rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset`,
            marginBottom: 4,
            height: 'auto',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              minHeight: '80px',
            }}
          >
            <div className="text-muted" style={{ fontSize: 14, margin: '5px 0' }}>
              <span>
                <ClockCircleFilled />{' '}
              </span>
              <span className="fw-bold me-1">{t('Member since')}</span>
              <Tooltip
                title={new Date(`${clientData?.createdAt || 2023 - 11 - 24}`).toLocaleString('vi-VN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: '2-digit',
                  day: 'numeric',
                })}
              >
                <span id="posting-time">{timeAgo(clientData?.createdAt || '2023-11-24', t)}</span>
              </Tooltip>
            </div>
            <Space
              align="center"
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                display: 'flex',
                height: 200,
                marginTop: 20,
              }}
            >
              <Avatar
                style={{
                  height: 170,
                  width: 170,
                }}
                src={clientData?.user?.avatar || defaultImg}
              />
            </Space>
            <div key={clientData?._id} className="text-center mt-2">
              <Link
                to={`/client-info/${clientData?._id}?isRcmd=${isRcmd}`}
                className=" advanced-search-link text-dark text-wrap text-truncate pe-4"
                style={{ fontWeight: 500, fontSize: 22 }}
              >
                {clientData?.user?.name?.split(' ')?.[0] === 'null' ?  'Unknown Client' : clientData?.user?.name}
              </Link>
            </div>
          </div>

          <p
            className="text-wrap text-truncate text-dark mb-2 text-center"
            style={{ fontSize: 16, margin: '8px 0', height: 38 }}
          >
            {clientData?.intro?.length > 60 ? clientData?.intro?.slice(0, 60) + '...' : clientData?.intro}
          </p>
          <Space size={'small'} wrap style={{ minHeight: '80px', marginBottom: 8 }} align="end">
            {clientData?.preferJobType
              ?.filter(c => !!c)
              ?.map((c, ix) => (
                <Link
                  to={`/search?categoryId=${c?.id || c}`}
                  key={c?.name || ix}
                  className="advanced-search-link"
                  style={{
                    fontWeight: 500,
                    fontSize: 13,
                    border: '0.5px solid #ccc',
                    padding: '6px 2px',
                    borderRadius: 4,
                    background: 'rgba(86, 75, 93, 0.9)',
                    color: 'white',
                  }}
                >
                  {c?.name}
                </Link>
              ))}
          </Space>
          <div>
            <h6 className="text-muted mt-2 mb-5">{t('Prefered Job Types')}</h6>
          </div>
          <div
            className="card__overlay"
            style={{
              borderRadius: 16,
            }}
          >
            <Row
              className="card__header"
              style={{
                borderRadius: 16,
              }}
            >
              <Col span={24} className="border-0 text-dark">
                {clientData?.preferLocations?.length ? (
                  <Row className="mb-2">
                    <Space size={'small'} align="baseline" wrap>
                      <i className="fas fa-street-view" style={{ color: 'black' }}></i>
                      <Space split={'|'} style={{ fontSize: 14, fontWeight: 500 }}>
                        {clientData?.preferLocations
                          ?.slice(0, 3)
                          ?.map(l =>
                            locations?.find(loc => loc.code === l)?.name ? (
                              <div key={l}>{locations.find(loc => loc.code === l)?.name}</div>
                            ) : null
                          )}
                      </Space>
                      {/* {data?.preferences?.locations?.length > 3 && ' ...'} */}
                    </Space>
                  </Row>
                ) : null}
              </Col>
            </Row>
            <div className="job-preference">
              <div>
                {clientData?.findingSkills?.length > 0 && <h6 className="text-muted mt-2">{t('Finding Skills')}</h6>}
              </div>
              <Space size={'small'} wrap style={{ minHeight: '0', marginBottom: 8 }} align="end">
                {clientData?.findingSkills
                  ?.filter(c => !!c)
                  ?.map((c, ix) => (
                    <Link
                      to={`/search?categoryId=${c?.id || c}`}
                      key={c?.name || ix}
                      className="advanced-search-link"
                      style={{
                        fontWeight: 500,
                        fontSize: 13,
                        border: '0.5px solid #ccc',
                        padding: '6px 2px',
                        borderRadius: 4,
                        background: 'rgba(81, 38, 107, 0.9)',
                        color: 'white',
                      }}
                    >
                      {pickName(c, lang)}
                    </Link>
                  ))}
              </Space>
              <div style={{ fontSize: '0.9em' }} className="fw-bold me-1 text-muted">
                <span className="text-muted">
                  <span>Total Jobs: </span>
                  <span className="fw-bold " id="proposals-numbers">
                    <JobProposalsNumber jobID={clientData?.jobs?.length || 0} />
                  </span>
                </span>
              </div>
              <strong style={{ fontSize: 11 }}>{t('About Client')}</strong>
              <div style={{ fontSize: '0.85em' }} className="my-lg-1 mb-lg-2">
                <span className="fw-bold" style={{ color: clientData?.paymentVerified ? '#14bff4' : 'red' }}>
                  <i
                    className={`${clientData?.paymentVerified ? 'fas fa-check-circle' : 'far fa-times-circle'} me-1`}
                    style={{ color: clientData?.paymentVerified ? '#14bff4' : 'red' }}
                  />
                  {clientData?.paymentVerified ? t('PaymentVerified') : t('Paymentunverified')}
                </span>
                <span className="text-muted">
                  <span className="mx-2">
                    <StarsRating clientReview={clientData?.rating} index={1} />
                    <StarsRating clientReview={clientData?.rating} index={2} />
                    <StarsRating clientReview={clientData?.rating} index={3} />
                    <StarsRating clientReview={clientData?.rating} index={4} />
                    <StarsRating clientReview={clientData?.rating} index={5} />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-group float-sm-end mt-2" style={{ position: 'absolute', right: 18, top: 8 }}>
          <Tooltip title={t('Follow this Client')} placement="topRight" color={'#5e4275'}>
            <button
              type="button"
              className={`dropdown-toggle rounded-circle collapsed`}
              style={{
                background: 'white',
                border: isFollowed ? '1px solid #0E4623' : '1px solid #ccc',
                padding: '6px 8px',
              }}
              data-toggle="collapse"
              data-target="#collapse"
              aria-expanded="false"
              aria-controls="collapseTwo"
              onClick={follow}
            >
              {isFollowed ? <StarFilled style={{ color: '#942bfd' }} /> : <StarOutlined />}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
