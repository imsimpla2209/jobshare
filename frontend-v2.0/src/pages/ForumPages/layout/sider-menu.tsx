import { Layout, Menu } from 'antd'
import useRoleNavigate from 'libs/use-role-navigate'
import { useState } from 'react'

export default function SiderMenu({ menuItems }) {
  const navigate = useRoleNavigate()
  const [tabKey, setTabKey] = useState([window.location.pathname.split('/')?.[2] || 'home'])

  const handleClickMenu = async (val: any) => {
    setTabKey([val.key])
    switch (val.key) {
      case 'home':
        navigate('/')
        break
      default:
        navigate(`/${val.key}`)
        break
    }
  }

  return (
    <>
      <Layout.Sider
        collapsed={true}
        style={{
          background: 'linear-gradient(92.88deg, #12582D 9.16%, #316027 43.89%, #1F8346 64.72%)',
          position: 'sticky',
          zIndex: 1,
          alignSelf: 'start',
          overflow: 'hidden',
          height: 'calc(100vh - 60px)',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
          paddingTop: '12px',
        }}
      >
        <Menu
          className="menu-sidebar"
          onClick={handleClickMenu}
          defaultSelectedKeys={tabKey}
          mode="inline"
          theme="dark"
          items={menuItems}
          style={{
            background: 'transparent',
          }}
        />
      </Layout.Sider>
    </>
  )
}
