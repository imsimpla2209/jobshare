/* eslint-disable react/jsx-no-duplicate-props */
import {
  EditOutlined,
  HeartTwoTone,
  HomeOutlined,
  MessageTwoTone,
  StarTwoTone,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Image, Input, Modal, Rate, Row, Space, message } from 'antd'
import userIcon from 'assets/img/icon-user.svg'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clientStore } from 'src/Store/user.store'
import { updateClient } from 'src/api/client-apis'
import { getContracts } from 'src/api/contract-apis'
import { reviewFreelancer } from 'src/api/freelancer-apis'
import { createNotify } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { EStatus } from 'src/utils/enum'
import { Text, Title } from '../JobDetailsBeforeProposols'
import { useNavigate } from 'react-router-dom'
import Loader from 'src/Components/SharedComponents/Loader/Loader'

const IconText = ({ icon, text }) => (
  <Space>
    {icon}
    {text}
  </Space>
)

export default function MyHires() {
  const { t } = useTranslation(['main'])
  const navigate = useNavigate()
  const [freelancerList, setFreelancerList] = useState([])
  const {
    state: { id: clientId },
  } = useSubscription(clientStore, ['id'])

  const {
    state: { favoriteFreelancers, id, name },
  } = useSubscription(clientStore)

  const [favFreelancers, setFavFreelancers] = useState(favoriteFreelancers)
  const [isModalOpen, setIsModalOpen] = useState('')
  const [freelancerUserId, setFreelancerUserId] = useState('')
  const [rate, setRate] = useState(0)
  const [review, setReview] = useState('')
  const [reviewing, setReviewing] = useState(false)
  const [forceUpdate, setForceUpdate] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (clientId) {
      setLoading(true)

      getContracts({ client: clientId, currentStatus: EStatus.ACCEPTED })
        .then(res => {
          const uniqListFreelancers = []
          if (res.data.results?.length) {
            res.data.results.forEach(({ freelancer }) => {
              if (!uniqListFreelancers.find(f => f._id === freelancer._id)) {
                uniqListFreelancers.push(freelancer)
              }
            })
          }
          setFreelancerList(uniqListFreelancers)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [clientId, forceUpdate])

  //   console.log(contracts)

  useEffect(() => {
    setFavFreelancers(favoriteFreelancers || [])
  }, [favoriteFreelancers])

  const handleReview = () => {
    setReviewing(true)
    reviewFreelancer({ creator: id, content: review, rating: rate }, isModalOpen)
      .then(res => {
        setReviewing(false)
        createNotify({
          to: freelancerUserId,
          path: '/profile/me',
          content: `${name} have reviewed you`,
        })
        setForceUpdate({})
        handleCancel()
      })
      .catch(err => message.error('❌❌❌ Failed to review freelancer', err))
  }

  const handleCancel = () => {
    setIsModalOpen('')
    setFreelancerUserId('')
  }

  return (
    <div style={{ padding: 20 }}>
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

      <Row style={{ padding: '20px 0px' }}>
        <Card style={{ width: '100%' }}>
          <Breadcrumb
            items={[
              {
                path: '/',
                title: (
                  <Space>
                    <HomeOutlined />
                    <span className="fw-bold">{t('Home')}</span>
                  </Space>
                ),
              },
              {
                title: (
                  <Space>
                    <UsergroupAddOutlined />
                    <span className="fw-bold">{t('My hires')}</span>
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </Row>

      {!loading ? (
        <Row gutter={[16, 16]} className="mt-3">
          {freelancerList.map(freelancer => (
            <Col span={6}>
              <Card
                className="card-hover"
                cover={<Image preview={false} src={freelancer?.user?.avatar} fallback={userIcon} height={300} />}
                actions={[
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setFreelancerUserId(freelancer.user)
                      setIsModalOpen(freelancer?.id || freelancer?._id)
                    }}
                  >
                    <IconText
                      icon={<StarTwoTone twoToneColor="#ebd22f" />}
                      text={Number(freelancer?.rating).toFixed(1) || 0}
                      key="list-vertical-star-o"
                    />
                  </Button>,
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setFreelancerUserId(freelancer.user)
                      setIsModalOpen(freelancer?.id || freelancer?._id)
                    }}
                  >
                    <IconText
                      icon={<MessageTwoTone twoToneColor="#2fbceb" />}
                      text={freelancer?.reviews?.length || 0}
                      key="list-vertical-message"
                    />
                  </Button>,
                  <span style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                    <Button
                      style={{
                        borderRadius: '50%',
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                      }}
                      type={favFreelancers?.includes(freelancer?.id || freelancer?._id) ? 'primary' : 'default'}
                      size="small"
                      onClick={e => {
                        if (favFreelancers?.includes(freelancer?.id || freelancer?._id)) {
                          setFavFreelancers(favFreelancers.filter(item => item !== (freelancer?.id || freelancer?._id)))
                        } else {
                          setFavFreelancers([...favFreelancers, freelancer?.id || freelancer?._id])
                        }
                        updateClient(
                          {
                            favoriteFreelancers: favFreelancers?.includes(freelancer?.id || freelancer?._id)
                              ? favFreelancers.filter(item => item !== (freelancer?.id || freelancer?._id))
                              : [...favFreelancers, freelancer?.id || freelancer?._id],
                          },
                          id
                        )
                      }}
                    >
                      <IconText
                        icon={
                          <HeartTwoTone
                            twoToneColor={
                              favFreelancers?.includes(freelancer?.id || freelancer?._id) ? '#eb2f96' : '#aeaeae'
                            }
                          />
                        }
                        text={''}
                        key="list-vertical-like-o"
                      />
                    </Button>
                  </span>,
                ]}
              >
                <div
                  onClick={() => {
                    navigate(`/freelancer-profile/${freelancer._id}`)
                  }}
                >
                  <Card.Meta title={freelancer?.name} description={freelancer.intro} />
                  <Rate disabled defaultValue={freelancer?.rating || 0} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Loader />
      )}
    </div>
  )
}
