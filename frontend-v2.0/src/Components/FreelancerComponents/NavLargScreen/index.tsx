/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import { BellFilled, MailFilled } from '@ant-design/icons'
import { Avatar, Badge, Divider, Dropdown, MenuProps, Space } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { userStore } from 'src/Store/user.store'
import { logout } from 'src/api/auth-apis'
import { getNotifies, updateNotify } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { useSocket } from 'src/socket.io'
import { ESocketEvent } from 'src/utils/enum'
import { pickName, timeAgo } from 'src/utils/helperFuncs'
import img from '../../../assets/img/icon-user.svg'
import LanguageList from '../../SharedComponents/LanguageBtn/LanguageList'
import notiIcon from '../../../assets/img/notifyicon.png'
import Title from 'antd/es/typography/Title'

export const NotifyPopup = (s, data) => {
  const { t } = useTranslation(['main'])
  return (
    <div className="max-w-md w-100 bg-white shadow-lg rounded-lg pointer-events-auto flex border ring-1 ring-black ring-opacity-5">
      <div className="w-100 p-4">
        <div className="flex">
          <div className="pt-0.5">
            <img
              className="h-10 w-10 rounded-circle"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
              alt=""
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-dark">{t('Notification')}</p>
            <p className="mt-1 text-sm text-gray-500">
              {data?.content} <span className="text-muted">{timeAgo(data?.created, t)}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="border-left border-gray-200">
        <button
          className="w-100 border border-transparent rounded-none rounded-lg p-4 flex items-center justify-content-center text-sm font-medium text-primary hover-text-indigo focus-outline-none focus-ring-2 focus-ring-indigo"
          onClick={() => toast.dismiss(s.id)}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function NavLargScreen() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { i18n, t } = useTranslation(['main'])
  const lang = i18n.language
  const user = useSubscription(userStore).state
  const [notifies, setNotifies] = useState([])
  const [unSeen, setUnSeen] = useState([])
  const [unSeenMSG, setUnSeenMSG] = useState(0)
  const { appSocket } = useSocket()
  const [forceUpdate, setForceUpdate] = useState({})

  const handleSeenNoti = async id => {
    await updateNotify(id, { seen: true }).then(() => {
      setForceUpdate({})
    })
  }

  const handleLogout = () => {
    logout()
      .then(res => {
        console.log(res)
        navigate('/login')
        window.location.reload()
        localStorage.removeItem('userType')
        localStorage.removeItem('expiredIn')
        toast.success('Bye', {
          icon: '👋',
        })
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  useEffect(() => {
    getNotifies(user?.id).then(res => {
      setNotifies(res.data.results)
      setUnSeen(res.data.results?.filter(n => !n?.seen) || [])
    })
  }, [forceUpdate])

  useEffect(() => {
    // App socket
    appSocket.on(ESocketEvent.SENDNOTIFY, data => {
      console.log('Get Notify:', data)
      if (data?.to === user?.id) {
        setNotifies(prev => [{ ...data, createdAt: new Date() }, ...prev])
        setUnSeen(prev => [...prev, data])
      }
    })

    // The listeners must be removed in the cleanup step, in order to prevent multiple event registrations
    return () => {
      appSocket.off(ESocketEvent.SENDNOTIFY)
    }
  }, [notifies, unSeen])

  useEffect(() => {
    appSocket.on(ESocketEvent.SENDMSG, data => {
      console.log(data.to, data?.to === user?.id)
      if (data?.to === user?.id) {
        console.log('Get MSG:', data)
        setUnSeenMSG(prev => prev + 1)
      }
    })

    return () => {
      appSocket.off(ESocketEvent.SENDMSG)
    }
  }, [unSeenMSG])

  const items = useMemo(() => {
    return notifies?.slice(0, 5)?.map((s, ix) => {
      return {
        label: (
          <div className="row" style={{ width: 400 }}>
            <img className="col-2" height={36} width={36} src={s.image || notiIcon} alt="sss" />
            <Link
              className="col-7 text-wrap text-truncate"
              style={{ color: s?.seen ? 'black' : '#0E4623' }}
              to={s?.path || '#'}
              onClick={() => handleSeenNoti(s._id)}
            >
              {pickName(s?.content, lang)?.slice(0, 100)}...
            </Link>
            <p className="col-3">{timeAgo(s?.createdAt, t)}</p>
          </div>
        ),
        key: ix,
      }
    }) as MenuProps['items']
  }, [notifies])

  return (
    <div className="navbar-expand" id="navbarNav-id">
      <ul className="navbar-nav align-items-center">
        <li className="nav-item hov-cn ">
          <NavLink
            className={`nav-link
                ${pathname === '/saved-jobs' || pathname === '/proposals' ? 'active' : ''}`}
            to="/find-work"
          >
            {t('FindWork')}
          </NavLink>
          <ul className={`dropdown-menu findWork-cn`} style={{ marginTop: '-8px' }}>
            <div className="nav-dd-cn"></div>
            <li>
              <Link className={`dropdown-item  `} to="/find-work">
                {t('FindWork')}
              </Link>
            </li>
            <li>
              <Link className={`dropdown-item  `} to="/saved-jobs">
                {t('Saved Jobs')}
              </Link>
            </li>
            <li>
              <Link className={`dropdown-item  `} to="/proposals">
                {t('Proposals')}
              </Link>
            </li>
            <li>
              <Link className={`dropdown-item  `} to={`/profile/me`}>
                {t('Profile')}
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item hov-cn mx-3">
          <NavLink
            className={`nav-link
                
                ${pathname === '/all-contract' || pathname === '/invitations' ? 'active' : ''}`}
            to="/my-jobs"
          >
            {t('My Jobs')}
          </NavLink>
          <ul className={`dropdown-menu myJobs-cn`} style={{ marginTop: '-8px' }}>
            <div className="nav-dd-cn"></div>
            <li>
              <Link className={`dropdown-item  `} to="/my-jobs">
                {t('My Jobs')}
              </Link>
            </li>
            <li>
              <Link className={`dropdown-item  `} to="/all-contract">
                {t('Contracts')}
              </Link>
            </li>
            <li>
              <Link className={`dropdown-item  `} to="/invitations">
                {t('Invitations')}
              </Link>
            </li>
            <li>
              <Link className={`dropdown-item  `} to="/connects-history">
                {t('Connects History')}
              </Link>
            </li>
          </ul>
        </li>
        {/* <li className="nav-item hov-cn">
            <NavLink className={`nav-link reports-cn `}

              to="/overview">
              {t("My Reports")}
            </NavLink>
            <ul className={`dropdown-menu Reports-cn`} style={{ marginTop: "-8px" }}>
              <div className="nav-dd-cn"></div>
              <li>
                <Link className={`dropdown-item  `} to="/overview">
                  {t("Overview")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to="/my-reports">
                  {t("My Reports")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to="/life-time-billing">
                  {t("Lifetime Billings by Client")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to="/connects-history">
                  {t("Connects History")}
                </Link>
              </li>
              <li>
                <Link className={`dropdown-item  `} to="/transaction-history">
                  {t("Transaction History")}
                </Link>
              </li>
              <li><a className="dropdown-item" href="#">Certificate of Earnings</a></li>
            </ul>
          </li> */}
        {/* <li className="nav-item me-5">
            <NavLink className={`nav-link  `} to="/messages">
              {t("Messages")}
            </NavLink>
          </li> */}
        {/* <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="fas fa-question fs-5"></i>
            </a>
          </li> */}
        <li className="nav-item ms-5 me-3">
          <Badge count={unSeenMSG || 0} color={'#2E6421'} status="processing">
            <NavLink
              className=""
              onClick={() => setUnSeenMSG(0)}
              style={{ padding: '10px 10px', borderRadius: 100, background: '#f5f0fa' }}
              to="/messages"
            >
              <MailFilled style={{ fontSize: 18 }} />
            </NavLink>
          </Badge>
        </li>
        <li className="nav-item pe-2">
          <Badge count={unSeen?.length || 0} color={'#2E6421'} status="processing">
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              overlayStyle={{
                overflowY: 'auto',
                maxHeight: '100vh',
              }}
              arrow={{ pointAtCenter: true }}
              dropdownRender={menu => (
                <div
                  style={{
                    padding: 18,
                    borderRadius: 10,
                    background: 'white',
                    marginLeft: 24,
                    boxShadow:
                      'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
                  }}
                >
                  <h3>{t('Notification')}</h3>
                  {React.cloneElement(menu as React.ReactElement, { style: { boxShadow: 'none' } })}
                  <Divider style={{ margin: 0 }} />
                  <Space style={{ padding: 8 }}>
                    <Link to="/notifications" className="nav-link" type="primary">
                      {t('View all')}
                    </Link>
                  </Space>
                </div>
              )}
            >
              <NavLink
                to="/notifications"
                style={{ padding: 10, borderRadius: 100, background: '#f5f0fa' }}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className=""
              >
                <BellFilled style={{ fontSize: 18 }} />
              </NavLink>
            </Dropdown>
          </Badge>
        </li>
        <li className="ms-1 me-3">
          <LanguageList />
        </li>

        <Dropdown
          placement="bottomRight"
          menu={{
            items: [
              {
                label: (
                  <Title level={5} style={{ margin: 0 }}>
                    <i className="fa fa-cog" style={{ marginRight: 8 }}></i>
                    {t('Settings')}
                  </Title>
                ),
                key: '0',
                onClick: () => navigate('/settings'),
              },
              {
                label: (
                  <Title level={5} style={{ margin: 0 }}>
                    <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>
                    {t('Log Out')}
                  </Title>
                ),
                onClick: handleLogout,
                key: '1',
              },
            ],
          }}
          trigger={['click']}
        >
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Avatar size="large" className="rounded-circle bg-white" src={user.avatar ? user.avatar : img} alt="" />
          </a>
        </Dropdown>
      </ul>
    </div>
  )
}
