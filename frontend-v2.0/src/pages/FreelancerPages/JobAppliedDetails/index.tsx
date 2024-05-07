/* eslint-disable react-hooks/exhaustive-deps */
import { MessageTwoTone, StarTwoTone } from '@ant-design/icons'
import { Button, Card, Flex, Input, Modal, Rate, Space, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { userStore } from 'src/Store/user.store'
import { reviewClient } from 'src/api/client-apis'
import { getContracts } from 'src/api/contract-apis'
import { getJob } from 'src/api/job-apis'
import { createNotify } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import ContractsInJob from 'src/pages/ClientPages/JobDetailsBeforeProposols/ContractsInJob'
import { EStatus } from 'src/utils/enum'
import JobDescriptionJobDetails from '../../../Components/FreelancerComponents/JobDescriptionJobDetails'

export const { Title, Paragraph, Text } = Typography

const IconText = ({ icon, text }: { icon: React.ReactElement; text: string | number }) => (
  <Space>
    {icon}
    {text}
  </Space>
)

export default function JobAppliedDetails() {
  const { id } = useParams()
  const [jobData, setJobData] = useState<any>({})
  const [contracts, setContracts] = useState([])
  const [forceUpdate, setForceUpdate] = useState(0)
  const [loadingContract, setloadingContract] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rate, setRate] = useState(0)
  const [review, setReview] = useState('')
  const [reviewing, setReviewing] = useState(false)

  const { state: user } = useSubscription(userStore)

  useEffect(() => {
    getJob(id).then(res => {
      setJobData(res.data)
    })
    getContracts({
      client: jobData?.client?._id,
      job: id,
      currentStatus: EStatus.ACCEPTED,
    }).then(res => setContracts(res.data.results))
  }, [])

  const handleReview = () => {
    setReviewing(true)
    reviewClient({ creator: id, content: review, rating: rate }, jobData?.client?._id)
      .then(res => {
        setReviewing(false)
        createNotify({
          to: jobData?.client?.user,
          path: '/profile/me',
          content: `${user?.name} have reviewed you`,
        })
        setForceUpdate(forceUpdate + 1)
        handleCancel()
      })
      .catch(err => message.error('❌❌❌ Failed to review Client', err))
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const { t } = useTranslation(['main'])

  return (
    <div className="container-md container-fluid-sm my-lg-4 my-sm-4 py-xs-5">
      <div className="d-lg-block">
        <div className="row my-lg-4 px-0 mx-0 d-lg-block d-none py-xs-5">
          <h3 style={{ color: "white" }}>{t('Job details')}</h3>
        </div>
        <div className="row ">
          <JobDescriptionJobDetails job={jobData} />
          <div className="col-lg-3 col-xs-3 d-flex flex-column">
            <Card>
              <h5 className="fw-bold " style={{ margin: 0 }}>
                {t('ClientInfo')}
              </h5>

              <Paragraph className="mt-3" style={{ color: 'black' }}>
                <ul>
                  <li>
                    <span style={{ marginRight: 10 }}>{t('Client name')}:</span>
                    <span>
                      <Link to={`/client-info/${jobData?.client?._id}`}>{jobData?.client?.name}</Link>
                    </span>
                  </li>
                  <li>
                    <span className="text-muted" style={{ marginRight: 10 }}>
                      {jobData?.client?.intro}
                    </span>
                  </li>
                </ul>
              </Paragraph>

              <Space split={'|'} size={'large'}>
                <Button type="link" size="small">
                  <IconText
                    icon={<StarTwoTone twoToneColor="#ebd22f" />}
                    text={Number(jobData?.client?.rating).toFixed(1) || 0}
                    key="list-vertical-star-o"
                  />
                </Button>
                
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setIsModalOpen(true)
                  }}
                >
                  <IconText
                    icon={<MessageTwoTone twoToneColor="#2fbceb" />}
                    text={jobData?.client?.reviews?.length || 0}
                    key="list-vertical-message"
                  />
                </Button>
              </Space>
            </Card>

            {contracts?.length ? (
              <Card className="mt-3" title={t('Freelancers joined this job')} bodyStyle={{ padding: '0px 16px' }}>
                <ContractsInJob
                  contracts={contracts}
                  setForceUpdate={setForceUpdate}
                  loadingContract={loadingContract}
                />
              </Card>
            ) : null}
          </div>
          {/* <RightSidebarJobDetails job={jobData} /> */}
        </div>
        <Modal
          title={t('Add a review')}
          open={!!isModalOpen}
          onOk={handleReview}
          onCancel={handleCancel}
          okText={'Review'}
          okButtonProps={{ disabled: !review || reviewing }}
        >
          <Flex vertical justify="start" align="start" gap={16}>
            <Text>{t('Your rating')}</Text>
            <Rate value={rate} onChange={setRate} />
            <Input.TextArea
              required
              allowClear
              defaultValue={''}
              placeholder={t('Write your review here')}
              onInput={e => setReview((e.target as any).value)}
            />
          </Flex>
        </Modal>
      </div>
    </div>
  )
}
