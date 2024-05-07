/* eslint-disable react-hooks/exhaustive-deps */
import AcceptedAlert from 'Components/FreelancerComponents/AcceptedAlert'
import FindWorkFreelancerHome from 'Components/FreelancerComponents/FindWorkFreelancerHome'
import LeftSidebarFreelancerHome from 'Components/FreelancerComponents/LeftSidebarFreelancerHome'
import RightSidebarFreelancerHome from 'Components/FreelancerComponents/RightSidebarFreelancerHome'
import SectionCenterFreelancerHome from 'Components/FreelancerComponents/SectionCenterFreelancerHome'
import { useTranslation } from 'react-i18next'
import { freelancerStore, userStore } from 'src/Store/user.store'
import { useSubscription } from 'src/libs/global-state-hook'
import Loader from '../../../Components/SharedComponents/Loader/Loader'
import './HomeFreelancer.css'
import { Col, Row } from 'antd'
import HeadOfCenterSection from 'src/Components/FreelancerComponents/HeadOfCenterSection'

const greetings = [
  "How's it going? ",
  'Welcome! What would you like to find today? ',
  'Welcome to JobShare, ',
  'Good to see you! ',
]
var rd = Math.floor(Math.random() * greetings.length)
export default function HomeFreelancer() {
  const { i18n, t } = useTranslation(['main'])
  const lang = i18n.language
  const user = useSubscription(userStore).state
  const freelancer = useSubscription(freelancerStore).state

  return (
    <div>
      {/* <div className="mx-md-5 container-fluid-sm my-lg-4 px-1 pt-1">
        {
          user?.name
            ? <div className="mx-3">
              {
                freelancer?.isProfileVerified === false &&
                <AcceptedAlert widthh="66%" />
              }
              <div className="mx-md-5"><FindWorkFreelancerHome /></div>
              <Row gutter={24} className="mx-md-4">
                <LeftSidebarFreelancerHome freelancer={freelancer} />
                <SectionCenterFreelancerHome user={freelancer} />
                <RightSidebarFreelancerHome lang={lang} user={user} freelancer={freelancer} />
              </Row>
            </div>
            : <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
              <Loader />
            </div>
        }
      </div> */}
      <div className="mx-md-2 container-fluid-sm my-lg-4 px-1 pt-1">
        {user?.name ? (
          <div className="mx-md-4">
            <div className="mx-md-5" style={{ fontSize: 26, fontWeight: 500, color: '#000000', padding: '16px 13px' }}>
              {t(greetings[rd])}
              {user?.name || t('Unknown')}
            </div>
            {freelancer?.isProfileVerified === false && <AcceptedAlert widthh="66%" />}

            <Row gutter={24} className="mx-md-5">
              <Col xs={24} lg={24} xl={14}>
                <HeadOfCenterSection />
                {/* <LeftSidebarFreelancerHome freelancer={freelancer} /> */}
              </Col>
              <Col xs={0} lg={0} xl={10}>
                <RightSidebarFreelancerHome lang={lang} user={user} freelancer={freelancer} />
              </Col>
              <div className="mx-md-5 w-100 ">
                <FindWorkFreelancerHome />
              </div>
            </Row>
            <Row gutter={24} className="mx-md-5">
              <SectionCenterFreelancerHome user={freelancer} />
            </Row>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
            <Loader />
          </div>
        )}
      </div>
    </div>
  )
}
