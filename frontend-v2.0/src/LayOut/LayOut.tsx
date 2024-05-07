/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/Components/Providers/AuthProvider'
import AdminRoutesWithSeparateCss from 'src/Routes/AdminRoutesWithoutCss'
import { appInfoStore, categoryStore, locationStore, skillStore } from 'src/Store/commom.store'
import { userStore } from 'src/Store/user.store'
import { logout } from 'src/api/auth-apis'
import { getAllCategories } from 'src/api/category-apis'
import { getSkills } from 'src/api/job-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { useSocket } from 'src/socket.io'
import { ESocketEvent } from 'src/utils/enum'
import BeforeLoginRoutes from '../Routes/BeforeLoginRoutes'
import ClientRoutes from '../Routes/ClientRoutes'
import Loader from './../Components/SharedComponents/Loader/Loader'
import FreelancerRoutes from './../Routes/FreelancerRoutes'
import { getAppInfo } from 'src/api/admin-apis'

export default function LayOut() {
  const { authenticated, loading, id } = useAuth()
  const [usrType, setUsrType] = useState('')
  const { setState } = useSubscription(locationStore)
  const { state: user } = useSubscription(userStore)
  const { state: appInfo, setState: setAppInfo } = useSubscription(appInfoStore)
  const { appSocket } = useSocket()
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticated) {
      setUsrType(localStorage.getItem('userType') || '')
      appSocket.emit(ESocketEvent.USER_CONNECTED, { socketId: appSocket.id, userId: id })
    }
    return () => {
      appSocket.emit(ESocketEvent.USER_DISCONNECTED, { socketId: appSocket.id, userId: id })
    }
  }, [authenticated])

  useEffect(() => {
    if (authenticated) {
      appSocket.on(ESocketEvent.DEACTIVE, data => {
        if (data?.userId === (user?.id || user?._id) && data?.type === ESocketEvent.DEACTIVE) {
          console.log('Deactive:', data)
          logout()
            .then(res => {
              toast.error('Oops, You are deactived by admin, see yah', {
                icon: '👋',
              })
              console.log(res)
              navigate('/login')
              window.location.reload()
              localStorage.removeItem('userType')
              localStorage.removeItem('expiredIn')
            })
            .catch(error => {
              console.log(error.message)
            })
        }
      })
    }
    return () => {
      appSocket.off(ESocketEvent.DEACTIVE)
    }
  }, [authenticated])

  useEffect(() => {
    if (authenticated) {
      appSocket.on(ESocketEvent.SICKSETTING, data => {
        getAppInfo().then(res => setAppInfo(res.data))
      })
    }
    return () => {
      appSocket.off(ESocketEvent.SICKSETTING)
    }
  }, [authenticated])

  useEffect(() => {
    getSkills().then(res => skillStore.updateState(res.data))
    getAllCategories().then(res => categoryStore.updateState(res.data))
    getAppInfo().then(res => setAppInfo(res.data))
    fetch('https://raw.githubusercontent.com/sunrise1002/hanhchinhVN/master/dist/tinh_tp.json') //eslint-disable-line
      .then(response => response.json())
      .then(responseJson => {
        setState(
          Object.values(responseJson).map((loc: any) => {
            return {
              name: loc.name,
              code: loc.code,
            }
          })
        )
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  if (!loading) {
    if (authenticated) {
      if (usrType === 'Freelancer') {
        return <FreelancerRoutes />
      } else if (usrType === 'Client') {
        return <ClientRoutes />
      } else if (usrType === 'admin') {
        return <AdminRoutesWithSeparateCss />
      } else {
        return (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Loader />
          </div>
        )
      }
    } else {
      return <BeforeLoginRoutes />
    }
  } else {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loader />
      </div>
    )
  }
}
