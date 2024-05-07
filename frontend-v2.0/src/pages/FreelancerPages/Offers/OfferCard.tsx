/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Divider, Image, Popconfirm, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { acceptMessageRoom, rejectMessageRoom } from 'src/api/message-api'
import { getProposal } from 'src/api/proposal-apis'
import { EStatus } from 'src/utils/enum'
import { formatDay, pickName } from 'src/utils/helperFuncs'
import acceptimg from '../../../assets/img/accept.png'
import archiveimg from '../../../assets/img/archive.png'
import pendingimg from '../../../assets/img/pending.png'
import rejectimg from '../../../assets/img/reject.png'
import sentimg from '../../../assets/img/sent.png'
const { Text } = Typography

export default function OfferCard({ invitation, getOffers, user, onRefresh }) {
  const [decide, setDecide] = useState<any>()
  const [proposal, setProposal] = useState()
  const { t, i18n } = useTranslation(['main'])

  useEffect(() => {
    getProposal(invitation.content?.proposal).then(res => {
      setProposal(res.data)
    })
  }, [invitation])

  const accept = () => {
    if (invitation?._id) {
      acceptMessageRoom(invitation?._id).then(() => {
        onRefresh()
        return setDecide(EStatus.ACCEPTED)
      })
    }
  }

  const decline = () => {
    if (invitation?._id) {
      rejectMessageRoom(invitation?._id).then(() => {
        onRefresh()
        return setDecide(EStatus.REJECTED)
      })
    }
  }

  return (
    <div
      className="col-11 mx-auto bg-gray border border-gray rounded ps-3 pe-5 pt-2 pb-5 mb-4 text-center"
      style={{
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', textAlign: 'center', color: '#0E4623', fontSize: 24 }}>
        {t('Invitation')} {t('Message')}
      </div>
      {invitation && (
        <>
          {invitation?.currentStatus === EStatus.ACCEPTED && (
            <img
              src={acceptimg}
              alt="ok"
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                zIndex: 10,
              }}
            />
          )}
          {invitation?.currentStatus === EStatus.REJECTED && (
            <img
              src={rejectimg}
              alt="ok"
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                zIndex: 10,
              }}
            />
          )}
          {invitation?.currentStatus === EStatus.PENDING && (
            <img
              src={pendingimg}
              alt="ok"
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                zIndex: 10,
              }}
            />
          )}
          {invitation?.currentStatus === EStatus.ARCHIVE && (
            <img
              src={archiveimg}
              alt="ok"
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                zIndex: 10,
              }}
            />
          )}
          {invitation?.currentStatus === EStatus.ARCHIVE && (
            <img
              src={archiveimg}
              alt="ok"
              style={{
                position: 'absolute',
                top: 4,
                left: 4,
                zIndex: 10,
              }}
            />
          )}
          {user?.id === invitation?.from && (
            <img
              src={sentimg}
              alt="ok"
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                zIndex: 10,
              }}
            />
          )}
          <div className="d-flex justify-content-around">
            {invitation?.content?.fromUser && (
              <Card className="d-xl-flex d-none" bodyStyle={{ padding: 16 }}>
                <Space direction="vertical" size={10}>
                  <Image
                    height={120}
                    src={invitation?.content?.fromUser?.avatar}
                    fallback="https://i2-prod.manchestereveningnews.co.uk/sport/football/article27536776.ece/ALTERNATES/s1200c/1_GettyImages-1615425379.jpg"
                  />
                </Space>
              </Card>
            )}
            <div>
              <p>
                <strong>{t('Request to message')}: </strong>
                {pickName(invitation?.content?.content, i18n.language)}
              </p>
              <Space direction="vertical" size={3}>
                <Divider style={{ margin: 0 }} />
                <Text>
                  <b>{t('Name')}: </b>
                  {invitation?.content?.fromUser?.name}
                </Text>
                <Text>
                  <b>DOB: </b>
                  {formatDay(invitation?.content?.fromUser?.dob)}
                </Text>
                <Text>
                  <b>Phone: </b>
                  {invitation?.content?.fromUser?.phone || 'None'}
                </Text>
                <Text>
                  <b>Email: </b>
                  {invitation?.content?.fromUser?.email}
                </Text>
                <Divider style={{ margin: 0 }} />
              </Space>
              {invitation?.currentStatus === EStatus.PENDING && (
                <p>
                  <strong>{t('End date')}: </strong>
                  {new Date(Number(invitation?.dueDate)).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          {invitation?.currentStatus === EStatus.PENDING && (
            <>
              <Popconfirm title="Confirm" description="Are you sure?" onConfirm={accept} okText="Yes" cancelText="No">
                <button className="btn bg-jobsicker me-1">{t('Accept')}</button>
              </Popconfirm>
              <Popconfirm title="Confirm" description="Are you sure?" onConfirm={decline} okText="Yes" cancelText="No">
                <button className="btn btn-danger ms-1">{t('Reject')}</button>
              </Popconfirm>
            </>
          )}
        </>
      )}
    </div>
  )
}
