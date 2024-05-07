/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { updateMessageRoom } from 'src/api/message-api'
import { useSocket } from 'src/socket.io'
import { ESocketEvent } from 'src/utils/enum'
import { timeAgo } from 'src/utils/helperFuncs'
import styled from 'styled-components'

export enum EMSGTags {
  CHAT = 'chat',
  CONTACT = 'contact',
}

export default function MessagesLeftSide({
  freelancerID,
  userID,
  selectedMessageRoom,
  setSelectedMessageRoom,
  messageRooms,
  selectedUserMessages,
  setMessageRooms,
  setMessageRoomsByUser,
  messageRoomsByUser,
}: any) {
  const { t } = useTranslation(['main'])
  const [tab, setTab] = useState(EMSGTags.CHAT)
  const [search, setSearch] = useState('')
  const { appSocket } = useSocket()

  useEffect(() => {
    // App socket
    appSocket.on(ESocketEvent.SENDMSG, data => {
      console.log('Get Message:', data)
      if (data?.to === userID) {
        setMessageRooms(
          messageRooms?.map(mr => {
            if (mr?._id === data?.room) {
              console.log('found here')
              return {
                ...mr,
                seen: false,
                createdAt: new Date(),
              }
            }
            return mr
          })
        )
      }
    })

    // The listeners must be removed in the cleanup step, in order to prevent multiple event registrations
    return () => {
      appSocket.off(ESocketEvent.SENDMSG)
    }
  }, [userID])

  useEffect(() => {
    if (freelancerID) {
      // db.collection("freelancer").doc(freelancerID).get().then(doc => setFreelancer(doc.data()));
    }
  }, [])

  const onSeen = _id => {
    setMessageRooms(
      messageRooms?.map(m => {
        if (m?._id === _id) {
          return { ...m, seen: true }
        }
        return m
      })
    )
    console.log(selectedUserMessages)
    setMessageRoomsByUser(
      messageRoomsByUser.map(mByUser => {
        let msgByUser = mByUser
        if (mByUser?.memberId?.id === selectedUserMessages?.id) {
          msgByUser = {
            ...mByUser,
            rooms: mByUser?.rooms?.map(r => {
              if (r?._id === _id) {
                return { ...r, seen: true }
              }
              return r
            }),
          }
          console.log(msgByUser)
        }
        return msgByUser
      })
    )
    updateMessageRoom({ seen: true }, _id)
  }

  const filterRooms = () => {
    return messageRooms?.filter(m => {
      return m?.proposal?.job?.title?.toLowerCase().includes(search.trim().toLowerCase())
    })
  }

  return (
    <div className="bg-white mt-2" style={{ height: '100vh' }}>
      <div className="card-body">
        <div className="row">
          <div className="input-group col-12">
            <span className="input-group-text bg-white" id="basic-addon1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
              </svg>
            </span>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              onChange={e => setSearch(e?.target?.value)}
              value={search}
              aria-label="Input group example"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="overflow-auto" style={{ maxHeight: '700px' }}>
            <ul className="list-group list-group-flush">
              {messageRooms?.length ? (
                <>
                  {filterRooms()?.map(mr => (
                    <li key={mr?._id} className="list-group-item">
                      <Wrapper
                        className="row message-item"
                        style={{
                          backgroundColor: selectedMessageRoom?._id === mr?._id ? '#ffe0fb' : '',
                        }}
                        onClick={() => {
                          if (selectedMessageRoom?._id === mr?._id) {
                            onSeen(mr?._id)
                          } else {
                            onSeen(mr?._id)
                            setSelectedMessageRoom(mr)
                          }
                        }}
                      >
                        <div className="col-2">
                          <div className="img_cont_msg">
                            <img
                              src={
                                mr?.image ||
                                'https://simpletexting.com/wp-content/uploads/2022/05/text-messages-not-sending.jpeg'
                              }
                              style={{ background: '#ccc' }}
                              className="rounded-circle user_img_msg"
                            ></img>
                          </div>
                        </div>
                        <div className="col-10">
                          <span className="msg-uname text-truncate">
                            <span key={mr?._id}>{mr?.proposal?.job?.title}</span>
                          </span>
                          <p className="smallmsg float-end">{timeAgo(mr?.updatedAt, t)}</p>
                          <span className="d-md-flex justify-content-between align-items-center w-100 d-none">
                            <span className="topic text-muted">{t('Single Direct Message')}</span>
                            <span className="">
                              {mr?.seen ? (
                                <Tag color="#108ee9">{t('Seen')}</Tag>
                              ) : (
                                <Tag color="#87d068">{t('Unseen')}</Tag>
                              )}
                            </span>
                          </span>
                          <br />
                        </div>
                      </Wrapper>
                    </li>
                  ))}
                </>
              ) : (
                <></>
              )}

              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
									s<span className="badge bg-jobsicker rounded-pill">2</span>
								</li>
								<li className="list-group-item d-flex justify-content-between align-items-center">
									A third list item
									<span className="badge bg-jobsicker rounded-pill">1</span>
								</li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const Wrapper = styled.div`
  cursor: pointer;
  padding: 5px;
  &:hover {
    background: #ffe0fb;
  }
`
