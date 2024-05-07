import { HomeFilled, InboxOutlined, UsergroupAddOutlined, WeiboOutlined } from '@ant-design/icons'
import { Layout, MenuProps } from 'antd'
import { Content } from 'antd/es/layout/layout'
import useWindowSize from 'utils/useWindowSize'
import { getItem } from '../admin'
import AppHeader from '../header'
import AppSidebar from '../sidebar'

const items: MenuProps['items'] = [
  getItem('Home', 'home', <HomeFilled />),
  { type: 'divider' },
  getItem('Find workers', 'hiring-workers', <UsergroupAddOutlined />),
  getItem('Find jobs', 'freelance-jobs', <InboxOutlined />),
  getItem('Your Profile', 'account', <WeiboOutlined />),
]

const LayoutUser = ({ children }) => {
  const windowWidth = useWindowSize()
  const contentStyle =
    windowWidth > 1000
      ? {
          width: '100%',
          background: 'none',
        }
      : {
          maxWidth: 'none',
          width: '100%',
        }

  return (
    <>
      <AppHeader />
      <Layout>
        <AppSidebar items={items} />
        <Content style={contentStyle}>{children}</Content>
      </Layout>
    </>
  )
}

export default LayoutUser
