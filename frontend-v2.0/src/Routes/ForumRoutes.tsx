import { CalendarOutlined, HomeFilled, LinkedinOutlined, WeiboOutlined } from "@ant-design/icons";
import { Layout, MenuProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { Outlet, Route } from "react-router-dom";
import DepartmentDetail from "src/pages/ForumPages/departments/department-detail";
import EventsPage from "src/pages/ForumPages/events";
import EventDetails from "src/pages/ForumPages/events/event-details";
import HomePage from "src/pages/ForumPages/home-page";
import CreateIdea from "src/pages/ForumPages/ideas/create-new-idea";
import EditIdea from "src/pages/ForumPages/ideas/edit-idea";
import IdeaDetail from "src/pages/ForumPages/ideas/idea-detail";
import AppHeader from "src/pages/ForumPages/layout/header";
import AppSidebar from "src/pages/ForumPages/layout/sidebar";
import UserProfile from "src/pages/ForumPages/user-profile";
import OtherProfile from "src/pages/ForumPages/user-profile/otherProfile";
import useWindowSize from "src/utils/useWindowSize";

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const RightSideBar: React.FC = () => {
  const windowSize = useWindowSize()

  return (
    <>
      {windowSize < 1000 ? (
        <></>
      ) : (
        <Layout.Sider
          width={278}
          style={{ background: 'transparent', boxSizing: 'border-box', paddingRight: '16px', marginTop: 16 }}
        >
          {/* <EventCard />
          <DepartmentCard /> */}
        </Layout.Sider>
      )}
    </>
  )
}

export { RightSideBar };


const LayoutApp = ({ children }) => {
  const items: MenuProps['items'] = [
    getItem('Home', 'home', <HomeFilled />),
    { type: 'divider' },
    getItem(
      'PUBLIC',
      'grp',
      null,
      [getItem('Your Profile', 'account', <WeiboOutlined />), getItem('Events', 'event', <CalendarOutlined />), getItem('Your Department', `departments`, <LinkedinOutlined />)],
      'group'
    ),
  ]
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

      <Layout
        style={{
          width: '100%',
          background: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <AppSidebar items={items} />
        <Content style={contentStyle}>{<>{children}</>}</Content>
        <RightSideBar />
      </Layout>
    </>
  )
}

export default function ForumRoutes() {
  return (
    <Route
      path="/forum"
      element={
        <Layout style={{ minHeight: '100vh' }}>
          <LayoutApp>
            <Outlet />
          </LayoutApp>
        </Layout>
      }
    >
      {/* <Route path="" element={<HomePage />} />
      <Route path="event" element={<EventsPage />} />
      <Route path="event/:id" element={<EventDetails role="staff" />} />
      <Route path="ideas" element={<HomePage />} />
      <Route path="account" element={<UserProfile />} />
      <Route path="profile" element={<OtherProfile />} />
      <Route path="submit" element={<CreateIdea />} />
      <Route path="departments/:id" element={<DepartmentDetail />} />
      <Route path="idea" element={<IdeaDetail />} />
      <Route path="idea/edit" element={<EditIdea />} /> */}
    </Route>
  )
}