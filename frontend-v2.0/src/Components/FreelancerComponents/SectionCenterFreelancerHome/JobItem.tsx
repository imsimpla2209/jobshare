import { HeartFilled, HeartOutlined, ClockCircleFilled } from '@ant-design/icons'
import { Tooltip, Space, Row, Col } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import StarsRating from 'src/Components/SharedComponents/StarsRating/StarsRating'
import { freelancerStore } from 'src/Store/user.store'
import { updateFreelancer } from 'src/api/freelancer-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { timeAgo, currencyFormatter } from 'src/utils/helperFuncs'
import JobProposalsNumber from './JobProposalsNumber'
import { categoryStore, locationStore } from 'src/Store/commom.store'
import { useFreelancerTracking } from 'src/hooks/freelancer-tracking-hook'
import { ETrackingEvent } from 'src/Store/tracking.store'

export enum ESize {
  Big = 'big',
  Medium = 'medium',
  Small = 'small',
  SmallCard = 'smallcard',
}

export default function JobItem({ data, t, user, isRcmd = false, size = ESize.Medium }: any) {
  const [isLiked, setisliked] = useState(!user?.favoriteJobs.includes(data?._id))
  const { setState } = useSubscription(freelancerStore)
  const locations = useSubscription(locationStore).state
  const { state: catsData } = useSubscription(categoryStore)

  const { updateTrackingforJob } = useFreelancerTracking()

  const saveJob = id => {
    setisliked(!isLiked)
    if (!user?.favoriteJobs.includes(id)) {
      updateTrackingforJob(data, ETrackingEvent.APPLY, performance.now() - 150 * 1000)
      const favorJob = user?.favoriteJobs || []
      setState({ ...user, favoriteJobs: [...favorJob, id] })
      updateFreelancer(
        {
          favoriteJobs: [...favorJob, id],
        },
        user?._id
      ).then(() => {})
    } else {
      const favorJob = user?.favoriteJobs
      favorJob?.forEach((item, index) => {
        if (item === id) {
          favorJob?.splice(index, 1)
          updateFreelancer(
            {
              favoriteJobs: favorJob || [],
            },
            user?._id
          ).then(() => {
            setState({ ...user, favoriteJobs: favorJob || [] })
          })
        }
      })
    }
  }

  const basedOnSizeRender = () => {
    switch (size) {
      case ESize.Medium:
        return (
          <div
            className="card-job"
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
              background: 'white',
              borderRadius: 12,
              padding: 8,
              flex: 1,
              overflow: 'hidden',
              // height: '430px',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: 12,
                background: 'rgba(247, 228, 250, 0.8)',
                width: '100%',
                padding: 12,
                boxShadow: `rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset`,
                marginBottom: 4,
                height: '338px',
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
                  <span className="fw-bold me-1">{t('posted')}</span>
                  <Tooltip
                    title={new Date(`${data?.createdAt || 2023 - 11 - 24}`).toLocaleString('vi-VN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: '2-digit',
                      day: 'numeric',
                    })}
                  >
                    <span id="posting-time">{timeAgo(data?.createdAt || '2023-11-24', t)}</span>
                  </Tooltip>
                </div>
                <div key={data?._id}>
                  <Link
                    to={`/job/${data?._id}?isRcmd=${isRcmd}`}
                    className="advanced-search-link text-dark text-wrap text-truncate pe-4"
                    style={{ fontWeight: 500, fontSize: 22 }}
                  >
                    {data?.title}
                  </Link>
                </div>
              </div>

              <p
                className="text-wrap text-truncate text-dark mb-2"
                style={{ fontSize: 16, margin: '8px 0', height: 38 }}
              >
                {data?.description?.length > 60 ? data?.description?.slice(0, 60) + '...' : data?.description}
              </p>
              <Space size={'small'} wrap style={{ minHeight: '80px', marginBottom: 8 }} align="end">
                {data?.categories
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
                        padding: '6px 8px',
                        borderRadius: 12,
                        background: '#65B545',
                        color: 'white',
                      }}
                    >
                      {c?.name || Object.values(catsData || {})?.find(d => (d?._id || c?.id) === c)?.name}
                    </Link>
                  ))}
                {data?.jobDuration && (
                  <Link
                    to={`/search?duration=${data?.jobDuration}`}
                    key={`3232`}
                    className="advanced-search-link"
                    style={{
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      fontSize: 13,
                      border: '0.5px solid #ccc',
                      padding: '6px 8px',
                      borderRadius: 16,
                      background: 'rgba(77, 255, 249, 0.4)',

                      color: 'black',
                    }}
                  >
                    {data?.jobDuration}
                  </Link>
                )}
                {data?.type && (
                  <Link
                    to={`/search?type=${data?.type}`}
                    key={`6969`}
                    className="advanced-search-link"
                    style={{
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      fontSize: 13,
                      border: '0.5px solid #ccc',
                      padding: '6px 8px',
                      background: 'rgba(149, 240, 177, 0.4)',
                      borderRadius: 16,
                      color: 'black',
                    }}
                  >
                    {data?.type}
                  </Link>
                )}
              </Space>

              {data?.preferences?.locations?.length ? (
                <Row className="mt-2 mb-4">
                  <Space size={'small'} align="baseline" wrap>
                    <i className="fas fa-street-view" style={{ color: 'black' }}></i>
                    <Space split={'|'} style={{ fontSize: 14, fontWeight: 500 }}>
                      {data?.preferences?.locations
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
              <div className="card__overlay">
                <Row className="card__header">
                  <svg className="card__arc" xmlns="http://www.w3.org/2000/svg">
                    <path />
                  </svg>
                  <Col span={13} className="text-dark">
                    <div className="header">
                      <span className="icon up-icon" data-cy="fixed-price">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 14 14"
                          aria-hidden="true"
                          role="img"
                          width="15px"
                        >
                          <path d="M13.688.311L8.666 0 0 8.665 5.334 14 14 5.332 13.688.311zm-2.354 1.528a.827.827 0 11-.002 1.654.827.827 0 01.002-1.654zM6.441 9.892c-.384-.016-.761-.168-1.128-.455l-.73.729-.579-.578.73-.729a3.612 3.612 0 01-.498-.872 3.186 3.186 0 01-.223-.934l.965-.331c.018.339.094.672.229 1.002.133.325.297.586.488.777.164.164.32.264.473.295s.287-.009.4-.123a.422.422 0 00.131-.315c-.004-.123-.035-.249-.094-.381s-.146-.308-.27-.52a6.892 6.892 0 01-.39-.793 1.501 1.501 0 01-.086-.7c.028-.248.157-.486.383-.714.275-.273.596-.408.971-.402.369.008.74.149 1.109.423l.682-.682.578.577-.676.677c.176.224.326.461.446.707.121.25.205.495.252.734l-.965.354a3.638 3.638 0 00-.314-.84 2.369 2.369 0 00-.419-.616.863.863 0 00-.404-.253.344.344 0 00-.342.1.438.438 0 00-.109.458c.049.18.162.427.332.739.172.31.299.582.383.807.086.226.113.465.084.714-.03.252-.161.493-.393.723-.295.297-.635.436-1.016.422z"></path>
                        </svg>
                      </span>{' '}
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{currencyFormatter(data?.payment?.amount)}</span>
                    </div>{' '}
                    <small className="text-muted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t(`${data?.payment?.type}`)}</small>
                  </Col>
                  <Col span={11} className="border-0 text-dark">
                    <div className="header">
                      <span className="icon up-icon" data-cy="local">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-clock"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                        </svg>
                      </span>{' '}
                      <span style={{ fontSize: 14, fontWeight: 500 }}>
                        {data?.scope?.duration} {t('month(s)')}
                      </span>
                    </div>
                    <small className="text-muted">
                      <span className="d-none d-lg-inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t('Job Duration')}</span>{' '}
                    </small>
                  </Col>
                </Row>
                <div className="job-preference">
                  <div style={{ fontSize: '0.9em' }} className="fw-bold me-1 text-muted">
                    <span className="text-muted">
                      <span>Proposals: </span>
                      <span className="fw-bold " id="proposals-numbers">
                        <JobProposalsNumber jobID={data?.proposals?.length || 0} />
                      </span>
                    </span>
                  </div>
                  <strong style={{ fontSize: 11 }}>{t('About Client')}</strong>
                  <div style={{ fontSize: '0.85em' }} className="my-lg-1 mb-lg-2">
                    <span className="fw-bold" style={{ color: data?.client?.paymentVerified ? '#14bff4' : 'red' }}>
                      <i
                        className={`${
                          data?.client?.paymentVerified ? 'fas fa-check-circle' : 'far fa-times-circle'
                        } me-1`}
                        style={{ color: data?.client?.paymentVerified ? '#14bff4' : 'red' }}
                      />
                      {data?.client?.paymentVerified ? t('PaymentVerified') : t('Paymentunverified')}
                    </span>
                    <span className="text-muted">
                      <span className="mx-2">
                        <StarsRating clientReview={data?.client?.rating} index={1} />
                        <StarsRating clientReview={data?.client?.rating} index={2} />
                        <StarsRating clientReview={data?.client?.rating} index={3} />
                        <StarsRating clientReview={data?.client?.rating} index={4} />
                        <StarsRating clientReview={data?.client?.rating} index={5} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn-group float-sm-end mt-2" style={{ position: 'absolute', right: 18, top: 8 }}>
              <Tooltip title={t('Save to list')} placement="topRight" color={'#5e4275'}>
                <button
                  type="button"
                  className={`dropdown-toggle rounded-circle collapsed`}
                  style={{
                    background: user?.favoriteJobs?.includes(data._id || data?.id) ? '#ccc' : 'white',
                    border: user?.favoriteJobs?.includes(data._id || data?.id) ? '1px solid #8206ff' : '1px solid #ccc',
                    padding: '6px 8px',
                  }}
                  data-toggle="collapse"
                  data-target="#collapse"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                  onClick={e => saveJob(data._id || data?.id)}
                >
                  {user?.favoriteJobs?.includes(data._id || data?.id) ? (
                    <HeartFilled style={{ color: '#830afb' }} />
                  ) : (
                    <HeartOutlined />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>
        )
      case ESize.Small:
        return (
          <div
            className="card-job "
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
              background: 'white',
              borderRadius: 12,
              padding: 8,
              flex: 1,
              height: 'auto',
            }}
          >
            <div
              className="ag-courses-item_bg small-job-card"
              style={{
                borderRadius: 8,
                // background: 'rgba(255, 255, 255, 0.4)',
                width: '100%',
                padding: 12,
                boxShadow: `rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset`,
                marginBottom: 0,
              }}
            >
              <div
                style={{
                  minHeight: '50px',
                }}
              >
                <div className="text-muted" style={{ fontSize: 14, margin: '5px 0', padding: 4 }}>
                  <span>
                    <ClockCircleFilled />{' '}
                  </span>
                  <Tooltip
                    title={new Date(`${data?.createdAt || 2023 - 11 - 24}`).toLocaleString('vi-VN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: '2-digit',
                      day: 'numeric',
                    })}
                  >
                    <span id="posting-time">{timeAgo(data?.createdAt || '2023-11-24', t)}</span>
                  </Tooltip>
                </div>
                <div key={data?._id}>
                  <Link
                    to={`/job/${data?._id}?isRcmd=${isRcmd}`}
                    className="advanced-search-link text-dark text-wrap text-truncate pe-4"
                    style={{ fontWeight: 500, fontSize: 18 }}
                  >
                    {data?.title}
                  </Link>
                </div>
              </div>

              <p
                className="text-wrap text-truncate text-dark mb-2"
                style={{ fontSize: 14, margin: '2px 0', minHeight: 12, maxHeight: 40 }}
              >
                {data?.description?.length > 42 ? data?.description?.slice(0, 42) + '...' : data?.description}
              </p>
              <Space size={'small'} wrap style={{ minHeight: '32px', maxHeight: 40 }}>
                {data?.categories
                  ?.filter(c => !!c)
                  ?.map((c, ix) => (
                    <Link
                      to={`/search?categoryId=${c?.id || c}`}
                      key={c?.name || ix}
                      className="advanced-search-link"
                      style={{
                        fontWeight: 500,
                        fontSize: 13,
                        color: '#0E4623',
                      }}
                    >
                      {c?.name || Object.values(catsData || {})?.find(d => (d?._id || c?.id) === c)?.name}
                    </Link>
                  ))}
                {data?.jobDuration && (
                  <Link
                    to={`/search?duration=${data?.jobDuration}`}
                    key={`3232`}
                    className="advanced-search-link"
                    style={{
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      fontSize: 12,
                      color: 'black',
                    }}
                  >
                    {data?.jobDuration}
                  </Link>
                )}
                {data?.type && (
                  <Link
                    to={`/search?type=${data?.type}`}
                    key={`6969`}
                    className="advanced-search-link"
                    style={{
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      fontSize: 13,
                      color: 'black',
                    }}
                  >
                    {data?.type}
                  </Link>
                )}
              </Space>

              <Row className="mt-2">
                <Col span={12} className="text-dark">
                  <div className="header">
                    <span className="icon up-icon" data-cy="fixed-price">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                        role="img"
                        width="15px"
                      >
                        <path d="M13.688.311L8.666 0 0 8.665 5.334 14 14 5.332 13.688.311zm-2.354 1.528a.827.827 0 11-.002 1.654.827.827 0 01.002-1.654zM6.441 9.892c-.384-.016-.761-.168-1.128-.455l-.73.729-.579-.578.73-.729a3.612 3.612 0 01-.498-.872 3.186 3.186 0 01-.223-.934l.965-.331c.018.339.094.672.229 1.002.133.325.297.586.488.777.164.164.32.264.473.295s.287-.009.4-.123a.422.422 0 00.131-.315c-.004-.123-.035-.249-.094-.381s-.146-.308-.27-.52a6.892 6.892 0 01-.39-.793 1.501 1.501 0 01-.086-.7c.028-.248.157-.486.383-.714.275-.273.596-.408.971-.402.369.008.74.149 1.109.423l.682-.682.578.577-.676.677c.176.224.326.461.446.707.121.25.205.495.252.734l-.965.354a3.638 3.638 0 00-.314-.84 2.369 2.369 0 00-.419-.616.863.863 0 00-.404-.253.344.344 0 00-.342.1.438.438 0 00-.109.458c.049.18.162.427.332.739.172.31.299.582.383.807.086.226.113.465.084.714-.03.252-.161.493-.393.723-.295.297-.635.436-1.016.422z"></path>
                      </svg>
                    </span>{' '}
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{currencyFormatter(data?.payment?.amount)}</span>
                  </div>{' '}
                  <small className="text-muted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t(`${data?.payment?.type}`)}</small>
                </Col>
                <Col span={12} className="border-0 text-dark" style={{ alignItems: 'center' }}>
                  <div className="header">
                    <span className="icon up-icon" data-cy="local">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-clock"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                      </svg>
                    </span>{' '}
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {data?.scope?.duration} {t('month(s)')}
                    </span>
                  </div>
                  <small className="text-muted">
                    <span className="d-none d-lg-inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t('Job Duration')}</span>{' '}
                  </small>
                </Col>
              </Row>
              {data?.preferences?.locations?.length ? (
                <>
                  <Row className="mt-2">
                    <Space size={'small'} align="baseline" wrap>
                      <i className="fas fa-street-view" style={{ color: 'black' }}></i>
                      <Space size={'small'} split={'|'} style={{ fontSize: 13, fontWeight: 500 }}>
                        {data?.preferences?.locations
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
                  <small className="text-muted">
                    <span className="d-none d-lg-inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t('Job Locations')}</span>{' '}
                  </small>
                </>
              ) : null}
            </div>
            <div className="btn-group float-sm-end mt-2" style={{ position: 'absolute', right: 18, top: 8 }}>
              <Tooltip title={t('Save to list')} placement="topRight" color={'#5e4275'}>
                <button
                  type="button"
                  className={`dropdown-toggle rounded-circle collapsed`}
                  style={{
                    background: user?.favoriteJobs?.includes(data._id || data?.id) ? '#ccc' : 'white',
                    border: user?.favoriteJobs?.includes(data._id || data?.id) ? '1px solid #0E4623' : '1px solid #ccc',
                    padding: '6px 8px',
                  }}
                  data-toggle="collapse"
                  data-target="#collapse"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                  onClick={e => saveJob(data._id || data?.id)}
                >
                  {user?.favoriteJobs?.includes(data._id || data?.id) ? (
                    <HeartFilled style={{ color: '#0E4623' }} />
                  ) : (
                    <HeartOutlined />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>
        )
    }
  }

  return <div className="px-xl-1 px-1 mt-2 position-relative col me-2 mb-2">{basedOnSizeRender()}</div>
}
