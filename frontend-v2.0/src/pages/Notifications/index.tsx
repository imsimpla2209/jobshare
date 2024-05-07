/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable jsx-a11y/anchor-has-content */
import { useEffect, useState } from 'react'
import NotificationCard from './NotificationCard'
import { deleteNotify, getNotifies, updateNotifies } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { userStore } from 'src/Store/user.store'
import { useTranslation } from 'react-i18next'

export default function Notifications() {
  const { t } = useTranslation(['main'])

  const collectionName = localStorage.getItem('userType')
  const user = useSubscription(userStore).state
  const [notifies, setNotifies] = useState([])
  const [unSeen, setUnSeen] = useState([])

  useEffect(() => {
    updateNotifies(user?._id || user?.id, { seen: true })
  }, [])

  useEffect(() => {
    getNotifications()
  }, [])

  const getNotifications = () => {
    getNotifies(user?.id || user?._id).then(res => {
      setNotifies(res.data.results)
      setUnSeen(res.data.results?.filter(n => !n?.seen) || [])
    })
  }

  const removeNotify = (id: string) => {
    deleteNotify(id)
    setNotifies(notifies?.filter(n => n?._id !== id))
  }

  return (
    <div className="container">
      <div className="row mt-5 mb-3 mx-5">
        <h3>Notifications</h3>
      </div>
      <div className="mt-3 mb-5 mx-5">
        <div className="row border border-1 bg-white py-3 px-3 mt-2">
          <h5>Check what's new</h5>
        </div>
        {notifies?.length > 0 ? (
          notifies.map((notification, index) => (
            <NotificationCard
              notification={notification}
              collectionName={collectionName}
              getNotifications={getNotifications}
              key={index}
              remove={removeNotify}
            />
          ))
        ) : (
          <div className="row border border-1 bg-white py-4 px-3">
            <p className="h3">{t('No Notifications to show')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
