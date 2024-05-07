/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDownOutlined, FileAddTwoTone, PlusOutlined, SnippetsOutlined, TagOutlined } from '@ant-design/icons'
import { Button, Collapse, Drawer, Input, Menu, MenuProps, Modal, Popover, Skeleton } from 'antd'
import { isEmpty } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProposalCard from 'src/Components/FreelancerComponents/ProposalCard'
import { createMessage, getMessages, updateMessageRoom } from 'src/api/message-api'
import { useSocket } from 'src/socket.io'
import { ESocketEvent } from 'src/utils/enum'
import IncomeMsg from './IncomeMsg'
import OutgoingMsg from './OutgoingMsg'
import { DefaultUpload } from 'src/Components/CommonComponents/upload/upload'
import FileDisplay from 'src/pages/ForumPages/ideas/idea-detail/file-display'
import { EMessageType, ERoomType } from 'src/api/constants'
import { fetchAllToCL } from 'src/utils/helperFuncs'

type MenuItem = Required<MenuProps>['items'][any]

const items: MenuItem[] = [
  getItem('Attachments', EMessageType.Attachment, <FileAddTwoTone />),
  getItem('Embed', EMessageType.Embed, <TagOutlined />),
  getItem('Template', EMessageType.HTML, <SnippetsOutlined />),
]

export default function MesssagesContent({ selectedMessageRoom, userID, member, setSelectedMessageRoom }: any) {
  const { t } = useTranslation(['main'])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const setElRef = useRef<HTMLDivElement>(null)
  const { appSocket } = useSocket()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [files, setFiles] = useState([])
  const [msgAttachments, setMsgAttachments] = useState([])
  const [openChatMenu, setOpenChatMenu] = useState(false)
  const [messageType, setMessageType] = useState(EMessageType.Normal)
  const [other, setOther] = useState('Nothing')

  useEffect(() => {
    if (selectedMessageRoom) {
      updateMessageRoom({ seen: true }, selectedMessageRoom?._id)
      setLoading(true)
      setPage(1)
      setTotal(0)
      getMsgs().finally(() => setTimeout(() => setLoading(false), 500))
    } else {
      setMessages([])
    }
  }, [selectedMessageRoom])

  const scrollToBottom = () => {
    setElRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'end',
    })
  }

  const normFile = (e: any) => {
    // handle event file changes in upload and dragger components
    const fileList = e
    console.log('file', e)
    setFiles(fileList)
    return e
  }

  const normMSGFile = (e: any) => {
    // handle event file changes in upload and dragger components
    const fileList = e
    console.log('file', e)
    setMsgAttachments(fileList)
    return e
  }

  useEffect(() => {
    setElRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'end',
    })
  }, [loading])

  useEffect(() => {
    appSocket.on(ESocketEvent.SENDMSG, data => {
      if (data?.to === userID && data?.room === selectedMessageRoom?._id) {
        console.log(`Get Message from room: ${selectedMessageRoom?._id}`, data)
        setMessages([...messages, { ...data, createdAt: new Date(), seen: false }])
        scrollToBottom()
      }
    })

    return () => {
      appSocket.off(ESocketEvent.SENDMSG)
    }
  }, [userID, selectedMessageRoom, messages])

  const sendMsg = async () => {
    setMessage('')
    let attachments = []
    if (msgAttachments?.length) {
      const fileNameList = await fetchAllToCL(msgAttachments?.map(f => f?.originFileObj))
      attachments = fileNameList
    }
    const newMsg = {
      from: userID,
      to:
        selectedMessageRoom?.type !== ERoomType?.Multi
          ? member?.id
          : selectedMessageRoom?.member?.filter(m => m?._id !== userID)[0]?._id,
      content: message,
      attachments,
      room: selectedMessageRoom?._id,
      type: messageType,
      other: other,
    }
    setMsgAttachments([])
    setMessages([...messages, { ...newMsg, createdAt: new Date(), seen: false }])
    await createMessage(newMsg)
    scrollToBottom()
  }

  const msgHandler = e => {
    setMessage(e.target.value)
  }

  const submitFilesToRoom = async () => {
    if (files?.length) {
      setLoading(false)
      const fileNameList = await fetchAllToCL(files?.map(f => f?.originFileObj))
      const fileList = fileNameList
      const currentFiles = selectedMessageRoom?.attachments || []
      setSelectedMessageRoom({ ...selectedMessageRoom, attachments: [...currentFiles, ...fileList] })
      updateMessageRoom({ attachments: [...currentFiles, ...fileList] }, selectedMessageRoom?._id)
      setFiles([])
    }
  }

  const getMsgs = (p = 1, firstLoad = true) => {
    return getMessages({ room: selectedMessageRoom?._id, sortBy: 'createdAt:desc', limit: 15, page: p })
      .then(res => {
        if (!firstLoad) {
          setMessages([...res.data?.results?.reverse(), ...messages])
        } else {
          setMessages(res.data?.results?.reverse())
          setTotal(res.data?.totalPages)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const avatarsList = useMemo(() => {
    console.log('chat room', selectedMessageRoom)
    const avatar = new Map()
    // if (!isEmpty(selectedMessageRoom) && typeof selectedMessageRoom?.member === 'array') {
    //   selectedMessageRoom?.member?.forEach(m => {
    //     if (!avatar.get(m?._id)) {
    //       avatar.set(m?._id, m?.avatar)
    //     }
    //   })
    // }
    console.log('avatars', avatar)
    return avatar
  }, [selectedMessageRoom])

  const handleKeyDown = async event => {
    if (event.key === 'Enter') {
      sendMsg()
    }
  }

  const getMoreMSG = async p => {
    setPage(prev => prev + 1)
    getMsgs(p, false)
  }

  const onClickMenu = t => {
    setMessageType(t)
    setOpenChatMenu(true)
  }

  const getMessageType = t => {
    switch (t) {
      case EMessageType.Attachment:
        return (
          <>
            <span className="text-muted">Give your attachment with a message</span>
            <Input
              style={{ marginTop: 8 }}
              value={message}
              autoFocus
              placeholder="Message"
              onInput={e => setMessage((e.target as any).value)}
            />
            <DefaultUpload normFile={normMSGFile} files={msgAttachments}></DefaultUpload>
          </>
        )
      case EMessageType.Embed:
        return (
          <>
            <span className="text-muted">Embed Your Link Here</span>
            <Input
              addonBefore="http://"
              style={{ marginTop: 8 }}
              onInput={e => setOther((e.target as any).value)}
              defaultValue="yourlink"
            />
            <Input
              style={{ marginTop: 8 }}
              value={message}
              autoFocus
              placeholder="Message"
              onInput={e => setMessage((e.target as any).value)}
            />
          </>
        )
      case EMessageType.HTML:
        return (
          <>
            <span className="text-muted">Here are some job dealing template</span>
            <Input addonBefore="http://" suffix=".com" defaultValue="mysite" />
          </>
        )
    }
  }

  return (
    <div
      className="mt-2 mb-5 d-flex bg-white"
      style={{
        width: '100%',
        borderRadius: 16,
      }}
    >
      <div className="mesgs position-relative h-100 w-100 bg-white w-100 me-3 w-md-50" style={{ borderRadius: 20 }}>
        <Skeleton loading={loading} active avatar>
          {!isEmpty(selectedMessageRoom) && (
            <Button
              type="primary"
              onClick={() => setOpen(true)}
              style={{
                position: 'absolute',
                top: 10,
                right: 26,
                zIndex: 100,
              }}
              className="d-flex d-md-none"
            >
              {t('View Message Information')}
            </Button>
          )}
          <Drawer
            width={500}
            title={t('Single Direct Message')}
            placement="right"
            onClose={() => setOpen(false)}
            open={open}
          >
            {selectedMessageRoom?.proposal && (
              <ProposalCard
                proposal={selectedMessageRoom?.proposal}
                isInMSG={true}
                job={selectedMessageRoom?.proposal?.job}
                ind={0}
              />
            )}
            <Collapse
              items={[
                {
                  key: '1',
                  label: t('Attachments'),
                  children: (
                    <div className="d-flex mb-3">
                      {selectedMessageRoom?.attachments?.length > 0 && (
                        <div className="bg-white py-lg-4 px-4 border border-1 pb-sm-3 py-xs-5">
                          {/* <h5 className="fw-bold my-4">Attachments</h5> */}
                          <div className="col">
                            <FileDisplay files={selectedMessageRoom?.attachments}></FileDisplay>
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            ></Collapse>

            <div className="mx-4 mt-3 py-2 pb-4">
              {/* <p className="fw-bold">{t("Attachments")}</p> */}

              <div className="attachments-cn">
                <p className="pt-2 px-5 text-center">
                  drag or{' '}
                  <label htmlFor="file" className="upw-c-cn me-1" style={{ cursor: 'pointer' }}>
                    {t('upload')}
                  </label>
                  {t('Additional project files (optional)')}
                  <DefaultUpload normFile={normFile} files={files}></DefaultUpload>
                </p>
              </div>
              <p className="my-3">
                {t('You may attach up to 10 files under the size of')} <strong>25MB</strong>{' '}
                {t(
                  `each. Include work samples or other documents to support your application. Do not attach your résumé — your JobShare profile is automatically forwarded tothe client with your proposal.`
                )}
              </p>
            </div>
          </Drawer>
          <div className="msg_history" style={{ height: '70vh' }}>
            {page < total && (
              <Button size={'middle'} onClick={() => getMoreMSG(page + 1)}>
                {t('Load More Messages')}
              </Button>
            )}
            {messages?.map(item =>
              item.from === userID ? (
                <OutgoingMsg key={item?.createdAt} avatar={avatarsList?.get(userID)} msg={item} />
              ) : (
                <IncomeMsg key={item?._id} avatar={member?.avatar} msg={item} />
              )
            )}
            <div ref={setElRef}></div>
          </div>
          <Button
            type="dashed"
            shape="circle"
            style={{
              position: 'absolute',
              bottom: 100,
              right: 32,
              zIndex: 100,
            }}
            icon={<ArrowDownOutlined style={{ fontSize: 18 }} />}
            onClick={() => scrollToBottom()}
          />
          <div className="type_msg">
            <div
              className="input_msg_write d-flex align-items-center"
              style={{
                margin: '8px 0px',
              }}
            >
              <Popover
                content={
                  <>
                    <Menu onClick={e => onClickMenu(e.key)} style={{ width: 256 }} mode="vertical" items={items} />
                  </>
                }
                title="Message Type"
                trigger="click"
              >
                <Button className="me-2" icon={<PlusOutlined />}></Button>
              </Popover>
              <input
                onKeyDown={handleKeyDown}
                type="text"
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 20,
                }}
                className="form-control write_msg"
                placeholder="Type a message"
                value={message}
                onInput={msgHandler}
              />
              <button className="btn msg_send_btn p-1" disabled={!message} onClick={sendMsg}>
                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </Skeleton>
        <Skeleton loading={loading} active avatar />
        <Skeleton loading={loading} active avatar />
        <Skeleton loading={loading} active avatar />
        <Skeleton loading={loading} active avatar />
        <Skeleton loading={loading} active avatar />
      </div>
      <div className="w-50 d-md-block d-none pe-3 pt-3 overflow-auto" style={{ maxHeight: '800px' }}>
        <ProposalCard
          proposal={selectedMessageRoom?.proposal}
          isInMSG={true}
          job={selectedMessageRoom?.proposal?.job}
          ind={0}
        />

        <Collapse
          items={[
            {
              key: '1',
              label: t('Attachments'),
              children: (
                <div className="d-flex mb-3">
                  {selectedMessageRoom?.attachments?.length > 0 && (
                    <div className="bg-white py-lg-4 px-4 border border-1 pb-sm-3 py-xs-5">
                      {/* <h5 className="fw-bold my-4">Attachments</h5> */}
                      <div className="col">
                        <FileDisplay files={selectedMessageRoom?.attachments}></FileDisplay>
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        ></Collapse>
        <Modal
          open={openChatMenu}
          title={t('Write your Message ?')}
          okText={t('Accept')}
          okType="default"
          onOk={() => {
            sendMsg()
            setOpenChatMenu(false)
          }}
          onCancel={() => {
            setOpenChatMenu(false)
            setMessage('')
          }}
        >
          {getMessageType(messageType)}
        </Modal>
        <div className="mx-4 mt-3 py-2 pb-4">
          {/* <p className="fw-bold">{t("Attachments")}</p> */}

          <div className="attachments-cn">
            <p className="pt-2 px-5 text-center">
              drag or{' '}
              <label htmlFor="file" className="upw-c-cn me-1" style={{ cursor: 'pointer' }}>
                {t('upload')}
              </label>
              {t('Additional project files (optional)')}
              <DefaultUpload normFile={normFile} files={files}></DefaultUpload>
              <Button disabled={!files?.length} onClick={submitFilesToRoom}>
                {t('Submit')}
              </Button>
            </p>
          </div>
          <p className="my-3">
            {t('You may attach up to 10 files under the size of')} <strong>25MB</strong>{' '}
            {t(
              `each. Include work samples or other documents to support your application. Do not attach your résumé — your JobShare profile is automatically forwarded tothe client with your proposal.`
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}
