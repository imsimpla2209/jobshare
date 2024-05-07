/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import img from '../../../assets/img/icon-user.svg'
import { Button, Col, Progress, Row, Space, Tooltip } from 'antd'
import { CheckCircleTwoTone, DollarTwoTone, FormOutlined } from '@ant-design/icons'
import Title from 'antd/es/typography/Title'
import logo from '../../../assets/img/logo1.jpg'
import proposal from '../../../assets/img/pending.png'
import jobIC from '../../../assets/img/working.png'

export default function RightSidebarFreelancerHome({ lang, user, freelancer }) {
  const { t } = useTranslation(['main'])
  const navigate = useNavigate()
  useEffect(() => {}, [])

  return (
    <Row className="d-none d-lg-block mb-4" gutter={4}>
      <Col span={24} style={{ paddingLeft: 20 }}>
        <div className="col d-none d-lg-block" style={{ marginBottom: 16 }}>
          <div
            style={{
              background: 'white',
              border: '1.4px solid #ccc',
              height: 'auto',
              borderRadius: '12px',
              padding: 8,
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <img
                src={user?.avatar ? user?.avatar : img}
                alt=""
                className="rounded-circle d-inline border"
                width="50px"
                height="50px"
              />
              <h5
                className="d-inline ps-1 text-wrap"
                style={{
                  wordBreak: 'break-all',
                }}
              >{`@${user.name}.`}</h5>
            </div>
            <Space className=" w-100" align="center" style={{ justifyContent: 'center', alignItems: 'baseline' }}>
              <Button onClick={() => navigate(`/profile/me`)} type="primary" icon={<i className="fas fa-eye me-2" />}>
                {t('View Profile')}
              </Button>
              <div>
                {freelancer?.isProfileVerified ? (
                  <p className="text-success text-center">
                    <CheckCircleTwoTone className="me-2" />
                    {t('Profile Verified')}
                  </p>
                ) : (
                  <>
                    {!freelancer?.isSubmitProfile ? (
                      <Link to={`/create-profile`} className="advanced-search-link">
                        <FormOutlined />
                        <span> {t('CompleteProfile')}</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/create-profile?isReview=${freelancer?.isSubmitProfile}`}
                        className="advanced-search-link"
                      >
                        <FormOutlined />
                        <span> {t('Review profile')}</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </Space>
            <div style={{ width: 'auto', display: 'flex', justifyContent: 'center' }}>
              <Progress
                className="w-75"
                percent={freelancer?.profileCompletion || 0}
                status="active"
                strokeColor={{ from: '#803ade', to: '#fc2389' }}
              />
            </div>
            <Space
              size="small"
              style={{
                background: '#f9f9f9',
                justifyContent: 'space-between',
                borderRadius: 20,
                padding: 12,
                margin: '2px 4px',
                width: '100%',
              }}
              wrap
              content="between"
            >
              <Tooltip title={'Click to ' + t('Buy jobsPoints')} placement="topRight">
                <Button
                  type="text"
                  onClick={() => navigate('/buyConnects')}
                  className=""
                  icon={<img alt="sick" src={logo} style={{ marginRight: 6 }} height={20} />}
                >
                  {user.jobsPoints} Points
                </Button>
              </Tooltip>

              <Button
                className=""
                type="text"
                onClick={() => navigate('/proposals')}
                icon={<img alt="sick" src={proposal} style={{ marginRight: 0 }} height={22} />}
              >
                {freelancer?.proposals?.length} {t('Proposals')}
              </Button>
              <Button
                type="text"
                onClick={() => navigate('/my-jobs')}
                icon={<img alt="sick" src={jobIC} style={{ marginRight: 0 }} height={22} />}
              >
                {freelancer?.jobs?.length} {t('Jobs')}
              </Button>
            </Space>
          </div>
        </div>
      </Col>
    </Row>
  )
}
