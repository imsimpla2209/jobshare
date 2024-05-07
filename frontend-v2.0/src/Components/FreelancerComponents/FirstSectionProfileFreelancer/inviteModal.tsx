import { Button, Checkbox, Divider, Input, List, Modal, Radio, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { clientStore } from 'src/Store/user.store'
import { getFreelancer } from 'src/api/freelancer-apis'
import { getJobs } from 'src/api/job-apis'
import { createNotify } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { Title } from 'src/pages/ClientPages/JobDetailsBeforeProposols'
import { EJobStatus } from 'src/utils/enum'

export default function InviteFreelancerModal() {
  const { id } = useParams()
  const { t } = useTranslation(['main'])
  const client = useSubscription(clientStore).state
  const [freelancer, setFreelancer] = useState<any>(null)
  const [inviteModal, setInviteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inviteJob, setInviteJob] = useState('')
  const [inviteJobTitle, setInviteJobTitle] = useState('')
  const [myJobs, setMyJobs] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchKey, setSearchKey] = useState('')
  const [sending, setSending] = useState(false)

  const handleInviteFreelancer = async () => {
    setSending(true)
    createNotify({
      content: `${client?.name} want to invite you into this job: ${inviteJobTitle}`,
      to: freelancer?.user,
      path: `/job/${inviteJob}`,
    })
      .then(res => {
        toast.success('Invite successfull')
        setInviteModal(false)
      })
      .catch(err => {
        toast.error(err.message)
      })
      .finally(() => setSending(false))
  }

  useEffect(() => {
    setLoading(true)
    setPage(1)
    getJobs({
      client: client?._id || client?.id,
      page: 1,
      limit: 20,
      searchText: searchKey || ' ',
      currentStatus: [EJobStatus.OPEN],
    })
      .then(res => {
        setMyJobs(res?.data?.results)
        setTotal(res?.data?.totalResults)
      })
      .catch(err => {
        toast.error('something went wrong, ', err)
      })
      .finally(() => setLoading(false))
  }, [searchKey])

  useEffect(() => {
    if (!myJobs?.length && page > 1) {
      getJobs({
        client: client?._id || client?.id,
        page: page,
        limit: 20,
        searchText: searchKey || ' ',
        currentStatus: [EJobStatus.OPEN],
      })
        .then(res => {
          setMyJobs(res?.data?.results)
          setTotal(res?.data?.totalResults)
        })
        .catch(err => {
          toast.error('something went wrong, ', err)
        })
    }
  }, [page])

  useEffect(() => {
    const root = document.body.querySelector('#root') as HTMLElement
    if (inviteModal) {
      root.style.height = '100vh'
      root.style.overflow = 'hidden'
    } else {
      root.style.height = '100vh'
      root.style.overflow = ''
    }

    return () => {
      root.style.height = '100vh'
      root.style.overflow = ''
    }
  }, [inviteModal])

  useEffect(() => {
    getFreelancer(id).then(res => {
      setFreelancer(res.data)
    })
  }, [id])

  return (
    <>
      <Modal
        destroyOnClose
        title={t('My posted jobs')}
        open={inviteModal}
        okText={t('Invite')}
        onCancel={() => setInviteModal(false)}
        okButtonProps={{ disabled: !inviteJob || sending, loading: sending }}
        onOk={handleInviteFreelancer}
      >
        <Input
          placeholder="Search job here"
          className="mt-3"
          value={searchKey}
          onInput={e => setSearchKey((e.target as any).value)}
        ></Input>
        <Divider style={{ marginBottom: 0 }}></Divider>
        <List
          style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'scroll' }}
          loading={loading}
          itemLayout="horizontal"
          loadMore={myJobs?.length < total}
          dataSource={myJobs}
          renderItem={job => (
            <List.Item key={job._id}>
              <Radio
                onChange={e => {
                  setInviteJob(job._id)
                  setInviteJobTitle(job.title)
                }}
                checked={inviteJob === job._id}
              >
                <Title level={5} style={{ margin: 0 }} className="text-muted">
                  {job.title}
                </Title>
              </Radio>
            </List.Item>
          )}
        />
      </Modal>

      <div className="col py-3 mx-1 float-end ">
        <Button
          type="primary"
          onClick={() => {
            setInviteModal(true)
          }}
        >
          {t('Invite to my job')}
        </Button>
      </div>
    </>
  )
}
