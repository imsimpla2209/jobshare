import { HeartTwoTone, MessageTwoTone, StarTwoTone } from '@ant-design/icons'
import { Button, Flex, Input, List, Modal, Rate, Space, message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { clientStore, freelancerStore, userStore } from 'src/Store/user.store'
import { updateClient } from 'src/api/client-apis'
import { reviewFreelancer } from 'src/api/freelancer-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { Text } from '.'
import { createNotify } from 'src/api/message-api'

const IconText = ({ icon, text }: { icon: React.ReactElement; text: string | number }) => (
  <Space>
    {icon}
    {text}
  </Space>
)

export default function ContractsInJob({ contracts, setForceUpdate, loadingContract }: any) {
  const { t } = useTranslation(['main'])
  const {
    state: { favoriteFreelancers, id, name },
  } = useSubscription(clientStore)

  const [favFreelancers, setFavFreelancers] = useState(favoriteFreelancers)
  const [isModalOpen, setIsModalOpen] = useState('')
  const [freelancerUserId, setFreelancerUserId] = useState('')
  const [rate, setRate] = useState(0)
  const [review, setReview] = useState('')
  const [reviewing, setReviewing] = useState(false)

  const { state: loggedFreelancer } = useSubscription(freelancerStore)

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
    <>
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
      <List
        itemLayout="vertical"
        dataSource={contracts}
        loading={loadingContract}
        renderItem={(item, index) => {
          const { freelancer } = item as any
          console.log({ freelancer })
          return (
            <List.Item
              key={index}
              actions={loggedFreelancer?._id !== freelancer?._id ? [
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
                </Button>,
              ] : []}
            >
              <List.Item.Meta
                title={<Link to={`/freelancer-profile/${freelancer._id}`}>{freelancer.name}</Link>}
                description={freelancer.intro?.substring(0, 50) + '...'}
              />
            </List.Item>
          )
        }}
      />
    </>
  )
}
