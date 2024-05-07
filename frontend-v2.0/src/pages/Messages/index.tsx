import MesssagesContent from 'Components/SharedComponents/MessagesContent/MesssagesContent'
import MessagesLeftSide from 'Components/SharedComponents/MesssagesLeftSide/MessagesLeftSide'
import { Avatar, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { freelancerStore, userStore } from 'src/Store/user.store'
import { getMessageRooms } from 'src/api/message-api'
import defaultAvatar from 'src/assets/img/icon-user.svg'
import { useSubscription } from 'src/libs/global-state-hook'
import '../../assets/style/style.css'
import './Messages.css'
import { TeamOutlined } from '@ant-design/icons'

export default function Messages() {
  const freelancer = useSubscription(freelancerStore)
  const user = useSubscription(userStore)
  const [selectedMessageRoom, setSelectedMessageRoom] = useState<any>({})
  const [selectedUserMessages, setSelectedUserMessages] = useState<any>({})
  const [messageRooms, setMessageRooms] = useState<any[]>([])
  const [messageRoomsByUser, setMessageRoomsByUser] = useState<any[]>([])

  const [searchParams, setSearchParams] = useSearchParams()
  const proposalId = searchParams.get('proposalId')

  useEffect(() => {
    const member = [`${user?.state?.id}`]
    getMessageRooms({ member, sortBy: 'updatedAt:desc' })
      .then(res => {
        setMessageRoomsByUser(res.data)
        const foundData = res.data.find(item => {
          const room = proposalId ? item.rooms.find(room => room.proposal?.id === proposalId) : item?.rooms[0]
          return room
        })
        console.log('room', foundData)
        if (proposalId) {
          setSelectedMessageRoom(foundData?.rooms?.find(room => room.proposal?.id === proposalId))
        } else {
          setSelectedMessageRoom(foundData?.rooms?.length ? foundData?.rooms[0] : {})
        }
        setSelectedUserMessages(foundData)
        return res
      })
      .then(() => {
        // setSearchParams('')
      })
      .catch(err => {
        console.log('Get MSG ERROR: ', err)
      })
  }, [user?.state?.id])

  return (
    <div className="">
      <div className="row pt-3">
        <aside
          className="col-12 col-md-3 d-flex"
          style={{
            display: 'flex',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="mt-2"
            style={{
              height: '100vh',
              background: '#f5f5f5',
              boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
              zIndex: 5,
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '10px 0',
              }}
            >
              <TeamOutlined
                style={{
                  fontSize: 48,
                  background: '#0E4623',
                  color: 'whitesmoke',
                  padding: 4,
                  borderRadius: 8,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <hr style={{ width: '70%' }} />
            </div>
            {messageRoomsByUser?.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: 14,
                  cursor: 'pointer',
                  borderLeft: selectedUserMessages?.memberId?.id === item?.memberId?.id ? '6px solid #0E4623' : 'none',
                  background: selectedUserMessages?.memberId?.id === item?.memberId?.id ? '#ccc' : 'transparent',
                }}
                className={`message-tab`}
                onClick={() => setSelectedUserMessages(item)}
              >
                <Tooltip placement="right" title={item?.memberId?.name}>
                  <Avatar
                    shape={selectedUserMessages?.memberId?.id === item?.memberId?.id ? 'square' : 'circle'}
                    size={selectedUserMessages?.memberId?.id === item?.memberId?.id ? 60 : 58}
                    src={item?.memberId?.avatar || defaultAvatar}
                    style={{ backgroundColor: '#ccc' }}
                  ></Avatar>
                </Tooltip>
              </div>
            ))}
          </div>
          <div
            style={{
              width: '76.5%',
              borderTopRightRadius: 12,
            }}
          >
            <MessagesLeftSide
              freelancerID={freelancer?.state?._id}
              userID={user?.state?._id || user?.state?.id}
              selectedMessageRoom={selectedMessageRoom}
              setSelectedMessageRoom={setSelectedMessageRoom}
              setMessageRooms={setMessageRooms}
              messageRooms={selectedUserMessages?.rooms}
              setMessageRoomsByUser={setMessageRoomsByUser}
              messageRoomsByUser={messageRoomsByUser}
              selectedUserMessages={selectedUserMessages?.memberId}
            />
          </div>
        </aside>
        <div className="col-sm-12 col-md-9">
          <MesssagesContent
            setSelectedMessageRoom={setSelectedMessageRoom}
            userID={user?.state?._id || user?.state?.id}
            selectedMessageRoom={selectedMessageRoom}
            member={selectedUserMessages?.memberId}
          />
        </div>
      </div>
    </div>
  )
}
