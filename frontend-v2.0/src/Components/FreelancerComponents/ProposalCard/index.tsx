/* eslint-disable react-hooks/exhaustive-deps */

import { Collapse, Drawer } from 'antd'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { BlueColorButton } from 'src/Components/CommonComponents/custom-style-elements/button'
import { userStore } from 'src/Store/user.store'
import { getJob } from 'src/api/job-apis'
import { requestMessageRoom } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { EStatus } from 'src/utils/enum'
import { currencyFormatter, randomDate } from 'src/utils/helperFuncs'
import Loader from './../../SharedComponents/Loader/Loader'
import ProposalDetail from './ProposalDetail'
import './style.css'

export default function ProposalCard({ proposal, jobId, job, ind, isInMSG = false, onRefresh }: any) {
  const { t, i18n } = useTranslation(['main'])
  const [jobData, setJobData] = useState<any>({})
  const [isSendRequest, setSendRequest] = useState<any>(false)
  const user = useSubscription(userStore).state
  const [loading, setLoading] = useState<boolean>(false)

  const [openDrawer, setOpenDrawer] = useState(false)

  const showDrawer = () => {
    setOpenDrawer(true)
  }

  const onClose = () => {
    setOpenDrawer(false)
  }

  useEffect(() => {
    if (proposal) {
      if (job) {
        setJobData(job)
      } else {
        getJob(jobId)
          .then(res => {
            setJobData(res.data)
          })
          .catch(err => console.log(err))
      }
    }
  }, [job, jobId, proposal])

  const createRequestMSGRoom = () => {
    setLoading(true)
    requestMessageRoom({
      from: user?.id || user?._id,
      to: jobData?.client?.user,
      proposal: proposal._id,
      text: 'Accept me please!',
    })
      .then(() => {
        setSendRequest(true)
      })
      .catch(err => {
        console.log('ERROR: Could not send request', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  console.log(jobData)

  return (
    <>
      {jobId || (job && jobData?.title) ? (
        <div className="card p-4 mb-3">
          <div className="row">
            <div className="col-md-7 col-12 ">
              <Link
                to="/"
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                  showDrawer()
                }}
                className={`fw-bold `}
                style={{ color: '#0E4623', textTransform: 'capitalize' }}
              >
                {isInMSG ? 'Proposal Information' : `Proposals No.${ind + 1} - (${t(proposal?.currentStatus)})`}
              </Link>
              <div>
                <strong className=" me-2">{t('Cover Letter')}:</strong>
                <span className="text-muted text-wrap">{proposal?.description}</span>
              </div>
              <div className="">
                <div className="d-flex flex-wrap">
                  <strong className="me-2">
                    {proposal?.currentStatus === EStatus.ACCEPTED ? t('Accepted Date') : t('Submited Date')}:{' '}
                  </strong>
                  <div>
                    {proposal?.currentStatus === EStatus.ACCEPTED
                      ? new Date(proposal?.updatedAt).toLocaleString()
                      : proposal?.createdAt
                      ? new Date(proposal?.createdAt).toLocaleString()
                      : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()}
                  </div>
                </div>
                <div className="d-flex flex-wrap">
                  <strong className="me-2">{t('Status')}: </strong>
                  <span>{proposal?.currentStatus}</span>
                </div>
                <div className="d-flex flex-wrap">
                  <strong className="me-2">{t('Expected Amount')}: </strong>
                  <span>{currencyFormatter(proposal?.expectedAmount) + '/ ' + t(`${jobData?.payment?.type}`)}</span>
                </div>
                {(proposal?.currentStatus === EStatus.ACCEPTED ||
                  proposal?.currentStatus === EStatus.PENDING ||
                  proposal?.currentStatus === EStatus.INPROGRESS) && (
                  <>
                    {!isInMSG && (
                      <div>
                        {proposal?.currentStatus === EStatus.ACCEPTED ||
                        proposal?.currentStatus === EStatus.INPROGRESS ? (
                          <Link to={`/messages?proposalId=${proposal?._id}`}>
                            <BlueColorButton>{t('Go to messaging')}</BlueColorButton>
                          </Link>
                        ) : (
                          <BlueColorButton
                            loading={loading}
                            style={{
                              pointerEvents: isSendRequest || proposal?.msgRequestSent ? 'none' : 'auto',
                              background: isSendRequest || proposal?.msgRequestSent ? 'gray' : '',
                            }}
                            className=""
                            onClick={createRequestMSGRoom}
                          >
                            {isSendRequest || proposal?.msgRequestSent ? (
                              <>{t('Sent')}</>
                            ) : (
                              <>{t('Request to message')}</>
                            )}
                          </BlueColorButton>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="col-md-5 col-12 d-flex flex-column">
              <strong className=" me-2">{t('Applied Job')}:</strong>
              <Link to={`/job/${jobId || job?._id}`} className="fw-bold " style={{ color: '#0E4623' }}>
                {jobData?.title}
              </Link>
              <div className="text muted">{jobData?.description}</div>
            </div>
          </div>
          <div>
            {!isEmpty(proposal?.answers) && (
              <>
                <strong className="me-2">{t('answers')}: </strong>
                <Collapse
                  items={Object.keys(proposal?.answers)?.map((a, ix) => {
                    return {
                      key: ix,
                      label: jobData?.questions[a],
                      children: <p>{proposal?.answers[a]}</p>,
                    }
                  })}
                  defaultActiveKey={[0]}
                />
              </>
            )}
          </div>
          <hr />
        </div>
      ) : (
        ind === 0 && <Loader />
      )}
      <Drawer width={1020} placement="right" closable={true} onClose={onClose} open={openDrawer}>
        <ProposalDetail proposal={proposal} user={user} onRefresh={onRefresh}></ProposalDetail>
      </Drawer>
    </>
  )
}
