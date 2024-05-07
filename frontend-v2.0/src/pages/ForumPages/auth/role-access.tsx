import { Navigate } from 'react-router-dom'
import { userStore } from './user-store'
import { Spin } from 'antd'
import { useSubscription } from 'libs/global-state-hook'

const RoleAccess = ({ roles = [], children }) => {
  const {
    state: { role, loading },
  } = useSubscription(userStore, ['role'])
  if (loading) {
    return (
      <div className="center" style={{ width: '100wh', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }
  return !roles.length || roles.includes(role) ? <>{children}</> : <Navigate to="/unauthorize" replace />
}

export default RoleAccess
