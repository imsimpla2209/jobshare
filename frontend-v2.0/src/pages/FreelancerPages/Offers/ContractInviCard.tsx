/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Popconfirm, Row } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProposalCard from 'src/Components/FreelancerComponents/ProposalCard'
import { acceptContract, getContract, rejectContract } from 'src/api/contract-apis'
import { getProposal } from 'src/api/proposal-apis'
import { EStatus } from 'src/utils/enum'
import { currencyFormatter, pickName } from 'src/utils/helperFuncs'
import acceptimg from '../../../assets/img/accept.png'
import rejectimg from '../../../assets/img/reject.png'
import archiveimg from '../../../assets/img/archive.png'
import sentimg from '../../../assets/img/sent.png'
import pendingimg from '../../../assets/img/pending.png'

export default function ContractInviCard({ invitation, getOffers, user, onRefresh, setTab }) {
  const [decide, setDecide] = useState<any>()
  const [contract, setContract] = useState<any>()
  const [proposal, setProposal] = useState<any>()
  const { t, i18n } = useTranslation(['main'])

  useEffect(() => {
    getContract(invitation.content?.contractID).then(res => {
      setContract(res.data)
    })
    getProposal(invitation.content?.proposal).then(res => {
      setProposal(res.data)
    })
  }, [invitation])

  const accept = () => {
    if (contract?._id && invitation?._id) {
      acceptContract(contract?._id, invitation?._id)
        .then(() => {
          setTab(EStatus.ACCEPTED)
          return setDecide(EStatus.ACCEPTED)
        })
        .catch(err => {
          console.log('ERROR, cannot accept', err)
        })
    }
  }

  const decline = () => {
    if (contract?._id && invitation?._id) {
      rejectContract(contract?._id, invitation?._id)
        .then(() => {
          setTab(EStatus.REJECTED)
          return setDecide(EStatus.REJECTED)
        })
        .catch(err => {
          console.log('ERROR, cannot reject', err)
        })
    }
  }

  return (
    <div
      className="col-11 mx-auto border border-gray rounded ps-3 pe-5 pt-2 pb-5 mb-4 text-center"
      style={{
        background: '#f1e3ff',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', textAlign: 'center', color: '#0E4623', fontSize: 24 }}>
        {t('Invitation')} {t('Contract')}
      </div>
      {invitation && contract && (
        <div>
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
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xl={12} xs={24}>
              <p>
                <strong>
                  {t('Contract')} {t('Title')}:{' '}
                </strong>
                {invitation?.content?.job?.title}
              </p>
              <p>
                <strong>
                  {t('Description')} {t('Invitation')}:{' '}
                </strong>
                {pickName(invitation?.content?.content, i18n.language)}
              </p>
              <p>
                <strong>
                  {t('Contract')} {t('Budget')}:{' '}
                </strong>
                {currencyFormatter(invitation?.content?.job?.budget)}
              </p>
              <p>
                <strong>{t('Contract')} Payment Type: </strong>
                {t(`${invitation?.content?.job?.payment?.type}`)}
              </p>
              <p>
                <strong>{t('Agree Amount')}: </strong>
                {t(`${currencyFormatter(contract?.agreeAmount)}`)}
              </p>
              <p>
                <strong>
                  {t('Contract')} {t('End date')}:{' '}
                </strong>
                {new Date(invitation?.dueDate).toLocaleString()}
              </p>
              <p>
                <strong>
                  {t('Posted Date')} - {t('Invitation')}:{' '}
                </strong>
                {new Date(invitation?.createdAt).toLocaleString()}
              </p>
            </Col>
            <Col
              xl={12}
              style={{ padding: 8, border: '1px solid #ccc', borderRadius: 8, marginBottom: 8, background: 'white' }}
            >
              <ProposalCard proposal={proposal} job={proposal?.job!} ind={1} isInMSG={true}></ProposalCard>
            </Col>
          </Row>
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
        </div>
      )}
    </div>
  )
}
