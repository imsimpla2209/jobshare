import { CalendarOutlined, FieldTimeOutlined, NodeIndexOutlined, StarOutlined } from '@ant-design/icons'
import { Button, Col, ConfigProvider, Input, Row, Spin, Tag } from 'antd'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { locationStore } from 'src/Store/commom.store'
import { getJob } from 'src/api/job-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import formatTime from 'src/utils/formatTime'
import styled from 'styled-components'

export default function JobDetails() {
  const locations = useSubscription(locationStore).state

  const data = {
    title: 'Form Validation for Survey Website Project',
    profession: 'Front-End Development',
    time: 'Posted 39 minutes ago',
    location: 'Worldwide',
    description: `We're searching for a Front-end Developer with expertise in form validation to enhance our survey website's functionality. In this role, you'll collaborate with our team to define form requirements and then implement robust front-end validation solutions using HTML5, CSS3, and JavaScript. Your primary responsibilities will include developing, testing, and troubleshooting form validation to ensure data accuracy and a smooth user experience. You should have experience with JavaScript frameworks like React, be proficient in AJAX for real-time validation, and possess strong problem-solving skills. Effective communication is key as you'll work closely with the development team to sync data with the back-end and provide clear user feedback.`,
    information: [
      {
        title: 'Less than 30 hrs/week',
        des: 'Hourly',
        icon: <FieldTimeOutlined />,
      },
      {
        title: 'Less than a month',
        des: 'Project Length',
        icon: <CalendarOutlined />,
      },
      {
        title: 'Entry level',
        des: 'I am looking for freelancers with the lowest rates',
        icon: <NodeIndexOutlined />,
      },
      {
        title: '$20.00',
        des: 'Hourly',
        icon: <FieldTimeOutlined />,
      },
    ],
    projectType: ' One-time project',
    tag: ['JavaScript', 'PHP', 'HTML', 'CSS'],
    activity: {
      Proposals: ' 5 to 10',
      Interviewing: '0',
      Invites: '0',
      Unanswered: '0',
    },
    evaluate: {
      star: 5,
      reviews: 145,
    },
    country: 'United Kingdom',
  }
  const starArr = []

  for (let i = 1; i <= data.evaluate.star; i++) {
    starArr.push(i)
  }

  const { t } = useTranslation(['main'])
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleGetJob = async () => {
    setLoading(true)
    await getJob(id)
      .then(res => setJob(res.data))
      .finally(() => setLoading(false))
  }
  console.log(job)
  useEffect(() => {
    handleGetJob()
  }, [id])

  if (loading) return <Spin />

  return (
    <Row style={{ paddingTop: 130 }}>
      <Col span={18}>
        <div style={{ padding: '24px', borderRight: '1px solid', borderBottom: '1px solid', borderColor: '#d5e1d5' }}>
          <h2 style={{ paddingBottom: '16px' }}>{job.title}</h2>
          <a href="" style={{ textDecoration: 'underline', color: '#108a00' }}>
            {data.profession}
          </a>
          <div style={{ opacity: '0.6', paddingBottom: '8px' }}>{formatTime(job.createdAt)}</div>
          <div>{data.location}</div>
        </div>
        <div style={{ padding: '24px', borderRight: '1px solid', borderBottom: '1px solid', borderColor: '#d5e1d5' }}>
          <div>{job.description}</div>
        </div>
        <div style={{ padding: '24px', borderRight: '1px solid', borderBottom: '1px solid', borderColor: '#d5e1d5' }}>
          <Row gutter={16}>
            {data.information.map((item, index) => (
              <Col span={8} key={index} style={{ paddingTop: '16px' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ paddingRight: '16px' }}>{item.icon}</div>
                  <div>
                    <div>{item.title}</div>
                    <div style={{ opacity: '0.6', paddingBottom: '8px' }}>{item.des}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <div style={{ padding: '24px', borderRight: '1px solid', borderBottom: '1px solid', borderColor: '#d5e1d5' }}>
          <div>Project Type:{data.projectType}</div>
        </div>
        {job.reqSkills.length && (
          <div style={{ padding: '24px', borderRight: '1px solid', borderBottom: '1px solid', borderColor: '#d5e1d5' }}>
            <h3>Skills and Expertise</h3>
            {job.reqSkills.map(item => (
              <a href="">
                <StyleTag>{item.skill.name}</StyleTag>
              </a>
            ))}
          </div>
        )}
        <div style={{ padding: '24px', borderRight: '1px solid', borderColor: '#d5e1d5' }}>
          <h3>Activity on this job</h3>
          <div>Proposals: {data.activity.Proposals}</div>
          <div>Interviewing:{data.activity.Interviewing}</div>
          <div>Invites sent: {data.activity.Invites}</div>
          <div>Unanswered invites: {data.activity.Unanswered}</div>
          <h2 style={{ paddingTop: '32px' }}>Upgrade your membership to see the bid range </h2>
        </div>
      </Col>
      <Col span={6}>
        <div style={{ padding: '24px', borderBottom: '1px solid', borderColor: '#d5e1d5' }}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#9aaa97',
                borderRadius: 100,
                colorBgContainer: '#e4ebe4',
                // colorBorder:'#9aaa97',
              },
            }}
          >
            <Button block style={{ width: '100%' }}>
              {t('Apply Now')}
            </Button>
          </ConfigProvider>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#9aaa97',
                borderRadius: 100,
                colorBgContainer: '#ffffff',
                // colorBorder:'#9aaa97',
              },
            }}
          >
            <Button block style={{ width: '100%', marginTop: '16px' }}>
              {t('Save Job')}
            </Button>
          </ConfigProvider>
        </div>
        <div style={{ padding: '24px', borderBottom: '1px solid #d5e1d5', borderColor: '#d5e1d5' }}>
          <h3>{t('About the client')}</h3>
          <div>Payment method verified</div>
          {starArr.map(item => (
            <StarOutlined style={{ color: '#108a00' }} />
          ))}
          <div style={{ paddingBottom: '16px' }}>
            {data.evaluate.star} of {data.evaluate.reviews} reviews{' '}
          </div>
          <>
            <div style={{ fontWeight: 500 }}>United Kingdom</div>
            <div style={{ opacity: '0.6', paddingBottom: '8px' }}>London 8:55 am</div>
          </>
          <>
            <div style={{ fontWeight: 500 }}>216 jobs posted</div>
            <div style={{ opacity: '0.6', paddingBottom: '8px' }}>94% hire rate, 2 open jobs</div>
          </>
          <>
            <div style={{ fontWeight: 500 }}>$5.7K total spent</div>
            <div style={{ opacity: '0.6', paddingBottom: '8px' }}>204 hires, 3 active</div>
          </>
          <>
            <div style={{ fontWeight: 500 }}>$14.98 /hr avg hourly rate paid</div>
            <div style={{ opacity: '0.6', paddingBottom: '8px' }}>68 hours</div>
          </>
          <div style={{ opacity: '0.6', paddingBottom: '8px' }}>Member since Jul 13, 2022</div>
        </div>
        <div style={{ padding: '24px', borderColor: '#d5e1d5' }}>
          <h3>Job link</h3>
          <Input placeholder="Basic usage" value={'https://www.upwork.com/jobs/~01e1a389d6104fd45f'} />
          <div style={{ color: '#108a00', paddingTop: '12px' }}>Copy link</div>
        </div>
      </Col>
    </Row>
  )
}

const StyleTag = styled(Tag)`
  background-color: #e4ebe3;
  height: auto !important;
  text-align: center;
  border-radius: 12px;
  color: #011e00;
  text-decoration: underline;
`
