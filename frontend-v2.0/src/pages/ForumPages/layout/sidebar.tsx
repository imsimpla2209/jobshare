import { MenuOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import useRoleNavigate from 'libs/use-role-navigate'
import useWindowSize from 'utils/useWindowSize'
import SiderMenu from './sider-menu'

function AppSidebar({ items }) {
  const windowWidth = useWindowSize()
  const navigate = useRoleNavigate()

  const handleClickMenu = async (val: any) => {
    switch (val.key) {
      case 'home':
        navigate('/')
        break
      default:
        navigate(`/${val.key}`)
    }
  }
  return (
    <>
      {windowWidth > 1000 ? (
        <SiderMenu menuItems={items} />
      ) : (
        <Dropdown
          menu={{ items: items, onClick: handleClickMenu }}
          trigger={['click']}
          overlayStyle={{ width: 200 }}
          placement="bottom"
        >
          <Button
            icon={<MenuOutlined />}
            type="primary"
            style={{
              position: 'sticky',
              zIndex: 3,
              background: 'linear-gradient(92.88deg, #12582D 9.16%, #316027 43.89%, #1F8346 64.72%)',
              alignSelf: 'start',
              top: '70px',
              right: '20px',
              border: '1px solid #ccc',
              boxShadow:
                'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
              marginTop: '10px',
            }}
          />
        </Dropdown>
      )}
    </>
  )
}

export default AppSidebar
