import DevelopmentItFreelancer from 'pages/BeforeLoginPages/FindTalent_Development_It_Freelancer'
import PageNotFoundBeforeLogin from 'pages/PageNotFound'
import { Route, Routes } from 'react-router-dom'
import Header from 'src/Components/BeforeLoginComponents/Header'
import AllJobPosts from 'src/pages/ClientPages/AllJobPost'
import FreelancerList from 'src/pages/ClientPages/Freelancer'
import FreelancerProfile from 'src/pages/ClientPages/FreelancerProfile'
import JobDetailsBeforeProposals from 'src/pages/ClientPages/JobDetailsBeforeProposols'
import ForgotPassword from 'src/pages/FreelancerPages/AccountRecovery/ForgotPassword'
import ResetPassword from 'src/pages/FreelancerPages/AccountRecovery/ResetPassword'
import HomePage from '../pages/BeforeLoginPages/HomePage'
import SignUp from '../pages/BeforeLoginPages/SignUp'
import Login from './../pages/BeforeLoginPages/Login'

export default function BeforeLoginRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job-sickers" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/freelancer"
          element={
            <div>
              <FreelancerList />
            </div>
          }
        />
        <Route
          path="/freelancer-profile/:id"
          element={
            <div>
              <FreelancerProfile />
            </div>
          }
        />
        <Route
          path="/find-work"
          element={
            <div className="mt-xl-5" style={{ paddingTop: 72 }}>
              <AllJobPosts />
            </div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <div className="mt-xl-5" style={{ paddingTop: 72 }}>
              <ForgotPassword />
            </div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <div className="mt-xl-5" style={{ paddingTop: 72 }}>
              <ResetPassword />
            </div>
          }
        />
        <Route
          path="/job-details/:id"
          element={
            <div>
              <JobDetailsBeforeProposals />
            </div>
          }
        />

        <Route path="/dev-it" element={<DevelopmentItFreelancer />} />
        <Route path="*" element={<PageNotFoundBeforeLogin />} />
      </Routes>
    </>
  )
}
