/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { CheckCircleTwoTone } from '@ant-design/icons'
import { Button, Input, Modal, Space, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Link, useNavigate } from 'react-router-dom'
import { locationStore } from 'src/Store/commom.store'
import { userStore } from 'src/Store/user.store'
import { getFreelancers } from 'src/api/freelancer-apis'
import { getSkills } from 'src/api/job-apis'
import { checkMessageRoom } from 'src/api/message-api'
import { getAllProposalInJob, updateStatusProposal } from 'src/api/proposal-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import img from '../../../assets/img/icon-user.svg'
import Loader from './../../SharedComponents/Loader/Loader'
import ReviewProposalsPageHeader from './../ReviewProposalsPageHeader'
import { EStatus } from 'src/utils/enum'
import { IProposal } from 'src/types/proposal'
import FileDisplay from 'src/pages/ForumPages/ideas/idea-detail/file-display'

export const { Text } = Typography

export default function ReviewProposalsCard() {
  const {
    state: { id: clientID },
  } = useSubscription(userStore)
  const { state: locations } = useSubscription(locationStore)
  const { t } = useTranslation(['main'])
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState<IProposal[]>([])
  const [freelancers, setFreelancers] = useState([])
  const [skills, setSkills] = useState([])
  const [rejectMessage, setRejectMessage] = useState('')
  const [openModal, setOpenModal] = useState('')
  const [forceUpdate, setForceUpdate] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getFreelancers({}).then(res => setFreelancers(res.data.results))
    getSkills().then(res => setSkills(res.data))
    getAllProposalInJob(id)
      .then(res => setProposals(res.data.results))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setLoading(true)

    getAllProposalInJob(id)
      .then(res => setProposals(res.data.results))
      .finally(() => setLoading(false))
  }, [forceUpdate])

  console.log('proposals', proposals)
  const sendMSG = async (freelancerID: string, proposalId: string) => {
    await checkMessageRoom({ member: [clientID, freelancerID], proposal: proposalId })
      .then(res => {
        console.log(res.data)
        if (res.data.exist) {
          navigate(`/messages?proposalId=${proposalId}`)
        } else {
          message.success(
            `Sent request to message to ${freelancers.find(freelancer => freelancer.user === freelancerID)?.name}`
          )
        }
      })
      .catch(err => message.error(err))
  }

  const handleReject = async () => {
    await updateStatusProposal(openModal, {
      status: EStatus.REJECTED,
      comment: rejectMessage || 'Your proposal does not meet my requirements.',
    })
      .then(() => setForceUpdate({}))
      .then(() => setOpenModal(''))
  }

  const handleUnreject = async (proposalId: string) => {
    await updateStatusProposal(proposalId, {
      status: EStatus.INPROGRESS,
      comment: '',
    }).then(() => {
      setForceUpdate({})
    })
  }

  if (loading) return <Loader />

  return (
    <>
      <ReviewProposalsPageHeader proposals={proposals.length} />
      <Modal
        open={!!openModal}
        title={t('Do you want to reject this proposal ?')}
        okText={t('Reject')}
        okType="danger"
        onOk={handleReject}
        onCancel={() => {
          setOpenModal('')
          setRejectMessage('')
        }}
      >
        <span className="text-muted">Why you want to reject this proposal</span>
        <Input
          style={{ marginTop: 8 }}
          value={rejectMessage}
          autoFocus
          placeholder="Your proposal does not meet my requirements."
          onInput={e => setRejectMessage((e.target as any).value)}
        />
      </Modal>
      {proposals.length > 0 ? (
        proposals.map((proposal, index) => {
          const currentFreelancer = freelancers.find(({ _id }) => _id === proposal.freelancer)
          const currentSkills = skills.filter(({ _id }) => currentFreelancer?.skills?.find(item => item.skill === _id))
          return (
            <div
              className="row border border-1 ms-0 pt-2"
              key={index}
              style={{ background: proposal.currentStatus === EStatus.REJECTED ? '#cfcfcff4' : '#ffffff' }}
            >
              <div className="col-1 pt-lg-3">
                <img
                  alt=""
                  className="circle"
                  src={currentFreelancer?.img?.[0] ? currentFreelancer?.img?.[0] : img}
                  style={{ width: '70px', height: '70px' }}
                />
              </div>
              <Space className="col-lg-6 pt-lg-3" direction="vertical" size={'middle'}>
                <Link
                  to={`/freelancer-profile/${currentFreelancer?._id}`}
                  id="job-title-home-page "
                  className=" fw-bold "
                >
                  {currentFreelancer?.name}
                </Link>
                <div>
                  <span className="text-muted fw-bold">{t('Introduction')}: </span>
                  <div className="fw-bold">{currentFreelancer?.intro}</div>
                </div>
                <div>
                  <span className="text-muted fw-bold">{t('Locations')}: </span>

                  <span className="fw-bold">
                    {currentFreelancer?.currentLocations
                      ?.filter(l => locations.find(loc => loc.code === l)?.name)
                      .map(l => locations.find(loc => loc.code === l)?.name)
                      .join(', ')}
                  </span>
                </div>
                <div className="row">
                  <div className="col">
                    <span className="text-muted fw-bold">{t('Hourly rate')}:</span>
                    <span className="fw-bold"> ${currentFreelancer?.expectedAmount} /hr</span>
                  </div>
                  {/* <div className="col">
                    <span className="text-muted fw-bold">{t('Earned')}: </span>
                    <span className="fw-bold">${currentFreelancer?.earned}</span>
                  </div> */}
                </div>

                <div>
                  <span className="text-muted fw-bold">{t('Skills')}:</span>
                  <div className="d-flex justify-content-start">
                    {currentSkills?.map((skill, index) => (
                      <div className="chip mb-3 ms" key={index}>
                        <span> {t(skill?.name)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted fw-bold">{t('Certificates')}: </span>
                  <span className="fw-bold"> {currentFreelancer?.certificate}</span>
                </div>
                <div>
                  <span className="text-muted fw-bold">{t('Expected payment amount')}: </span>
                  <span className="fw-bold">${proposal?.expectedAmount}</span>
                </div>
                <div>
                  <span className="text-muted fw-bold">{t('Cover Letter')}: </span>
                  <span className="fw-bold">{proposal.description}</span>
                </div>

                {proposal?.job?.questions?.length && proposal?.answers?.length ? (
                  <div>
                    <span className="text-muted fw-bold">{t("Fast Client's Questions:")}</span>
                    {proposal?.job?.questions?.map((question, index) => (
                      <div style={{ paddingLeft: 12, marginTop: 8 }}>
                        <span className="text-muted">{question}</span>

                        <p className="text-muted fw-bold">{proposal?.answers?.[index]}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Space>
              <div
                className="col py-3"
                style={{
                  justifyContent: 'start',
                  display: 'flex',
                  alignItems: 'end',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                <Space>
                  {proposal.currentStatus !== EStatus.REJECTED ? (
                    <Button onClick={() => sendMSG(currentFreelancer.user, proposal._id)}>{t('Messages')}</Button>
                  ) : null}
                  {proposal.currentStatus === EStatus.ACCEPTED ? (
                    <Space>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                      <Text type="success">{t('Accepted')}</Text>
                    </Space>
                  ) : proposal.currentStatus === EStatus.REJECTED ? (
                    <Button type="primary" danger onClick={() => handleUnreject(proposal._id)}>
                      {t('Un-reject')}
                    </Button>
                  ) : (
                    <>
                      <Button type="primary" danger onClick={() => setOpenModal(proposal._id)}>
                        {t('Reject')}
                      </Button>
                      <Button type="primary">
                        <Link to={`/create-contract/${proposal._id}?freelancerID=${currentFreelancer?._id}`}>
                          {t('Make contract')}
                        </Link>
                      </Button>
                    </>
                  )}
                </Space>

                {proposal?.attachments?.length ? (
                  <FileDisplay files={proposal?.attachments} style={{ margin: 0 }} />
                ) : null}
              </div>
            </div>
          )
        })
      ) : (
        <div className="row border bg-white border-1 ms-0 py-3">
          <p className="text-muted text-center h1">No proposals</p>
        </div>
      )}
    </>
  )
}
