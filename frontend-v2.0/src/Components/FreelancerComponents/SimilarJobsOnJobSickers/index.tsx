/* eslint-disable jsx-a11y/anchor-is-valid */

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Card, Carousel, Col, Grid, Row, Space } from 'antd'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getSimilarJobs } from 'src/api/job-apis'
import { currencyFormatter, randomDate } from 'src/utils/helperFuncs'
import useWindowSize from 'src/utils/useWindowSize'

export const SampleNextArrow = props => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{
        ...style,
        color: 'white',
        fontSize: '15px',
        lineHeight: '0.93',
        background: '#00000031',
        padding: 1,
        borderRadius: 4,
        alignItems: 'center',
        display: 'flex',
      }}
      onClick={onClick}
    >
      {/* <RightOutlined /> */}
    </div>
  )
}

export const SamplePrevArrow = props => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{
        ...style,
        color: 'white',
        fontSize: '15px',
        lineHeight: '0.93',
        background: '#00000031',
        borderRadius: 4,
        padding: 1,
        alignItems: 'center',
        display: 'flex',
      }}
      onClick={onClick}
    >
      {/* <LeftOutlined /> */}
    </div>
  )
}

export const settings = {
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
}

const JobItem = ({ data, t }: any) => {
  return (
    <div className="px-xl-3 px-1 mt-2">
      <Card
        style={{
          height: 220,
        }}
      >
        <div
          style={{
            height: 80,
          }}
        >
          <div key={data?._id}>
            <a href={`/#/job/${data?._id}`} className="advanced-search-link" style={{ fontWeight: 600, fontSize: 17 }}>
              {data?.title}
            </a>
          </div>
          <p className="text-muted text-wrap text-wrap" style={{}}>
            {data?.createdAt
              ? new Date(data?.createdAt).toLocaleString()
              : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}
          </p>
        </div>
        <p
          className="text-wrap text-wrap"
          style={{
            height: 50,
          }}
        >
          {data?.description?.slice(0, 80)}...
        </p>
        <div
          className="text-dark"
          style={{
            justifyContent: 'baseline',
            alignItems: 'baseline',
            display: 'flex',
          }}
        >
          <div className="header">
            <span className="icon up-icon" data-cy="fixed-price">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" aria-hidden="true" role="img" width="15px">
                <path d="M13.688.311L8.666 0 0 8.665 5.334 14 14 5.332 13.688.311zm-2.354 1.528a.827.827 0 11-.002 1.654.827.827 0 01.002-1.654zM6.441 9.892c-.384-.016-.761-.168-1.128-.455l-.73.729-.579-.578.73-.729a3.612 3.612 0 01-.498-.872 3.186 3.186 0 01-.223-.934l.965-.331c.018.339.094.672.229 1.002.133.325.297.586.488.777.164.164.32.264.473.295s.287-.009.4-.123a.422.422 0 00.131-.315c-.004-.123-.035-.249-.094-.381s-.146-.308-.27-.52a6.892 6.892 0 01-.39-.793 1.501 1.501 0 01-.086-.7c.028-.248.157-.486.383-.714.275-.273.596-.408.971-.402.369.008.74.149 1.109.423l.682-.682.578.577-.676.677c.176.224.326.461.446.707.121.25.205.495.252.734l-.965.354a3.638 3.638 0 00-.314-.84 2.369 2.369 0 00-.419-.616.863.863 0 00-.404-.253.344.344 0 00-.342.1.438.438 0 00-.109.458c.049.18.162.427.332.739.172.31.299.582.383.807.086.226.113.465.084.714-.03.252-.161.493-.393.723-.295.297-.635.436-1.016.422z"></path>
              </svg>
            </span>{' '}
            <strong>{currencyFormatter(data?.payment?.amount)}</strong>
          </div>{' '}
          <small className="text-muted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t(`${data?.payment?.type}`)}</small>
        </div>
      </Card>
    </div>
  )
}

export default function SimilarJobsOnJobShare({ id }: any) {
  const size = useWindowSize()
  const { t } = useTranslation(['main'])
  const [similarJobs, setSimilarJobs] = React.useState<any>([])

  useEffect(() => {
    getSimilarJobs(id, { limit: 8 })
      .then(res => {
        setSimilarJobs(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [id])

  return (
    <div className="mb-4 mt-4">
      {similarJobs?.length ? (
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
          <h4 className="fw-bold py-3" style={{ margin: 0, color: 'white' }}>
            {t('Similar Jobs on JobShare')}
          </h4>
        </Row>
      ) : null}
      {size > 1000 ? (
        <Row justify="center" className="mt-3">
          <Col span={23}>
            <Carousel arrows autoplay autoplaySpeed={2000} slidesToShow={3} {...settings} style={{ width: '100%' }}>
              {similarJobs?.map((s, ix) => (
                <div key={s._id}>
                  <JobItem data={s} t={t} />
                </div>
              ))}
            </Carousel>
          </Col>
        </Row>
      ) : (
        <div className="mt-4">
          {similarJobs?.map(s => (
            <div key={s._id}>
              <JobItem data={s} t={t} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
