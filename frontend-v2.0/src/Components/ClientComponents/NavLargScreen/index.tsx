/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  BellFilled,
  DingtalkCircleFilled,
  EditTwoTone,
  HeartFilled,
  MailFilled,
  ReconciliationFilled,
  ReconciliationTwoTone,
  SmileTwoTone,
  SyncOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Divider, Dropdown, MenuProps, Space } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { userStore } from 'src/Store/user.store'
import { logout } from 'src/api/auth-apis'
import { getNotifies, updateNotify } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { Title } from 'src/pages/ClientPages/JobDetailsBeforeProposols'
import { useSocket } from 'src/socket.io'
import { ESocketEvent } from 'src/utils/enum'
import { pickName, timeAgo } from 'src/utils/helperFuncs'
import img from '../../../assets/img/icon-user.svg'
import notiIcon from '../../../assets/img/notifyicon.png'
import LanguageList from '../../SharedComponents/LanguageBtn/LanguageList'

export default function NavLargScreen() {
  const { t, i18n } = useTranslation(['main'])
  const navigate = useNavigate()
  const user = useSubscription(userStore).state
  const [notifies, setNotifies] = useState([])
  const [unSeen, setUnSeen] = useState([])
  const [unSeenMSG, setUnSeenMSG] = useState(0)
  const [forceUpdate, setForceUpdate] = useState({})
  const { appSocket } = useSocket()
  const lang = i18n.language

  const handleSeenNoti = async id => {
    await updateNotify(id, { seen: true }).then(() => {
      setForceUpdate({})
    })
  }

  const handleLogout = () => {
    logout()
      .then(res => {
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
              {pickName(s?.content, lang)}
            </Link>
            <p className="col-3">{timeAgo(s?.createdAt, t)}</p>
          </div>
        ),
        key: ix,
      }
    }) as MenuProps['items']
  }, [notifies])

  return (
    <div className="navbar-expand" id="navbarNav-id" style={{ padding: '10px 0px' }}>
      <ul className="navbar-nav align-items-center">
        <li className="nav-item hov-cn">
          <Dropdown
            placement="bottomCenter"
            menu={{
              items: [
                {
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      <SmileTwoTone twoToneColor="#eb2f96" style={{ marginRight: 8 }} />
                      {t('My Jobs')}
                    </Title>
                  ),
                  key: '0',
                  onClick: () => navigate('/home'),
                },
                {
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      <DingtalkCircleFilled style={{ marginRight: 8 }} />
                      {t('All Jobs')}
                    </Title>
                  ),
                  onClick: () => navigate('/all-job-posts'),
                  key: '1',
                },
                {
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      <ReconciliationTwoTone twoToneColor="#ddb10f" style={{ marginRight: 8 }} />
                      {t('Contracts')}
                    </Title>
                  ),
                  onClick: () => navigate('/all-contract'),
                  key: '2',
                },
                {
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      <EditTwoTone twoToneColor="#0f98dd" style={{ marginRight: 8 }} />
                      {t('Post a job')}
                    </Title>
                  ),
                  onClick: () => navigate('/post-job'),
                  key: '3',
                },
                {
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      <UserAddOutlined style={{ marginRight: 8 }} />
                      {t('Invitations')}
                    </Title>
                  ),
                  onClick: () => navigate('/invitations'),
                  key: '4',
                },
              ],
            }}
          >
            <NavLink className="nav-link" to="/home">
              {t('Jobs')}
            </NavLink>
          </Dropdown>
        </li>
        <li className="nav-item hov-cn ms-3">
          <Dropdown
            placement="bottomCenter"
            menu={{
              items: [
                {
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      <UsergroupAddOutlined style={{ marginRight: 8 }} />
                      {t('All freelancers')}
                    </Title>
                  ),
                  key: '0',
                  onClick: () => navigate('/freelancer'),
                },
                {
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      <HeartFilled style={{ marginRight: 8 }} />
                      {t('Favourite freelancers')}
                    </Title>
                  ),
                  onClick: () => navigate('/saved-freelancer'),
                  key: '1',
                },
                {
                  label: (
                    <Title level={5} style={{ margin: 0 }}>
                      <SyncOutlined spin style={{ marginRight: 8 }} />
                      {t('My Hires')}
                    </Title>
                  ),
                  onClick: () => navigate('/my-hires'),
                  key: '2',
                },
              ],
            }}
          >
            <NavLink className="nav-link" to="/freelancer">
              {t('Freelancer')}
            </NavLink>
          </Dropdown>
        </li>
        <li className="nav-item hov-cn">
          <NavLink className="nav-link" to="/transaction-history">
            {t('Reports')}
          </NavLink>
        </li>
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
        <li className="nav-item me-3">
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
                    height: '70%',
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
        <li className="nav-item me-3">
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
