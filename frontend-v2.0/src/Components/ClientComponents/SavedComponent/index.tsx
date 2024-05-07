import { CheckCircleTwoTone, HeartFilled, HeartOutlined, MinusCircleTwoTone } from '@ant-design/icons'
import { Button, Card, Divider, Image, Rate, Space, Tag } from 'antd'
import userIcon from 'assets/img/icon-user.svg'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Progress from 'src/Components/SharedComponents/Progress'
import { locationStore } from 'src/Store/commom.store'
import { clientStore } from 'src/Store/user.store'
import { updateClient } from 'src/api/client-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { currencyFormatter, pickName } from 'src/utils/helperFuncs'
import { Text } from '../ReviewProposalsCard'
import { Title } from 'src/pages/ClientPages/JobDetailsBeforeProposols'

export default function Saved({ freelancer }) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation(['main'])
  const lang = i18n.language
  const { state: locations } = useSubscription(locationStore)
  let {
    state: { favoriteFreelancers, id },
  } = useSubscription(clientStore)
  const [favFreelancers, setFavFreelancers] = useState(favoriteFreelancers)

  useEffect(() => {
    setFavFreelancers(favoriteFreelancers || [])
  }, [favoriteFreelancers])
  console.log(freelancer)
  return (
    <Card bodyStyle={{ padding: 16 }} style={{ width: '100%' }} className="card-hover">
      <Space
        direction="horizontal"
        size={16}
        className="w-100"
        align="start"
        style={{ justifyContent: 'space-between' }}
      >
        <Space
          direction="horizontal"
          size={16}
          className="w-100"
          align="start"
          onClick={() => navigate(`/freelancer-profile/${freelancer._id}`)}
        >
          <Space direction="vertical" align="center" size={16}>
            <Image
              preview={false}
              src={freelancer?.user?.avatar}
              fallback={userIcon}
              width={'200'}
              style={{ width: 200, borderRadius: 20 }}
            />
            <Divider style={{ margin: 0 }} />

            <div className="center w-100">
              <Tag color="#0099ff" style={{ fontSize: 20, padding: 8, borderRadius: '30px' }}>
                {freelancer?.user?.name}
              </Tag>
            </div>
            <Rate disabled defaultValue={freelancer?.rating || 0} />
          </Space>{' '}
          <Space direction="vertical" align="start" className="w-100" size={16}>
            <Text>
              <b>{t('Introduction')}: </b>
              <span className="text-muted"> {freelancer.intro}</span>
            </Text>
            <Text className="w-100 d-flex" style={{ gap: 8 }}>
              <b>{t('Location')}: </b>
              <span className="text-muted d-flex" style={{ gap: 8, flexWrap: 'wrap' }}>
                {freelancer?.currentLocations?.map((l, index) => (
                  <div key={l}>
                    {index !== 0 && '|'} {locations.find(loc => loc.code === l)?.name}
                  </div>
                ))}
              </span>
            </Text>
            {!freelancer?.expectedAmount || !freelancer?.expectedPaymentType ? null : (
              <Text>
                <b>{t('Expected payment amount')}: </b>
                <span className="text-muted fw-bold">
                  {currencyFormatter(freelancer?.expectedAmount || 0)} / {t(freelancer?.expectedPaymentType)}
                </span>
              </Text>
            )}

            {freelancer?.preferJobType?.length ? (
              <Text className="w-100 d-flex" style={{ gap: 8 }}>
                <b>{t('Prefer job type')}: </b>
                <span className="text-muted d-flex fw-bold" style={{ gap: 8, flexWrap: 'wrap' }}>
                  {freelancer.preferJobType.map((cat, index) => cat?.name).join(', ')}
                </span>
              </Text>
            ) : null}
            {freelancer?.skills?.filter(skill => skill?.skill)?.length ? (
              <>
                <Text strong>{t('Skills and experties')}:</Text>
                {freelancer?.skills?.map((skill, index) =>
                  skill?.skill ? (
                    <Space key={index} size={1} className="me-sm-5 " wrap={false}>
                      <Button className="btn text-light btn-sm rounded-pill cats mx-1 my-1">
                        {pickName(skill?.skill, lang)}:
                      </Button>
                      <Progress done={skill?.level} />
                    </Space>
                  ) : null
                )}
              </>
            ) : null}
          </Space>
        </Space>

        <Space>
          <Tag
            color={freelancer?.available ? '#26e977' : '#eb2f2f'}
            icon={
              freelancer?.available ? (
                <CheckCircleTwoTone twoToneColor={'#2feb4e'} />
              ) : (
                <MinusCircleTwoTone twoToneColor={'#eb2f2f'} />
              )
            }
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Title level={5} style={{ margin: 0, color: 'white' }}>
              {t(freelancer?.available ? 'Available' : 'Unavailable')}
            </Title>
          </Tag>

          <button
            type="button"
            className={`btn btn-light dropdown-toggle rounded-circle collapsed`}
            style={{
              cursor: 'pointer',
              background: favFreelancers?.includes(freelancer?.id || freelancer?._id) ? '#6f00f7' : '#e5d3f5',
              border: favFreelancers?.includes(freelancer?.id || freelancer?._id)
                ? '3px solid #4fffc2'
                : '1px solid #ccc',
            }}
            data-toggle="collapse"
            data-target="#collapse"
            aria-expanded="false"
            aria-controls="collapseTwo"
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
            {favFreelancers?.includes(freelancer?.id || freelancer?._id) ? (
              <HeartFilled style={{ color: '#59ffc5' }} />
            ) : (
              <HeartOutlined />
            )}
          </button>
        </Space>
      </Space>
    </Card>
  )
}
