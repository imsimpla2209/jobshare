import Footer from 'Components/BeforeLoginComponents/Footer'
import ReviewProposalsCard from 'Components/ClientComponents/ReviewProposalsCard'
import Header from 'Components/FreelancerComponents/Header'
import Reports from 'pages/ClientPages/Reports'
import EmailVerified from 'pages/EmailVerification/EmailVerified'
import PleaseVerifiy from 'pages/EmailVerification/PleaseVerifiy'
import Contract from 'pages/FreelancerPages/Contract'
import CreateProfile from 'pages/FreelancerPages/CreateProfile'
import HomeFreelancer from 'pages/FreelancerPages/HomeFreelancer'
import JobAppliedDetails from 'pages/FreelancerPages/JobAppliedDetails'
import JobDetailsFreelancer from 'pages/FreelancerPages/JobDetailsFreelancer'
import MyJobs from 'pages/FreelancerPages/MyJobs'
import MyStats from 'pages/FreelancerPages/MyStats'
import Offers from 'pages/FreelancerPages/Offers'
import Profile from 'pages/FreelancerPages/Profile'
import Proposals from 'pages/FreelancerPages/Proposals'
import BuyConnects from 'pages/FreelancerPages/Reports/BuyConnects'
import OverviewReports from 'pages/FreelancerPages/Reports/OverviewReports'
import BillingByClients from 'pages/FreelancerPages/Reports/billingbyclient'
import ConnectsHistory from 'pages/FreelancerPages/Reports/connectshistory'
import SavedJobs from 'pages/FreelancerPages/SavedJobs'
import Search from 'pages/FreelancerPages/Search'
import Messages from 'pages/Messages'
import Notifications from 'pages/Notifications'
import PageNotFound from 'pages/PageNotFound'
import SubmitProposal from 'pages/Submit Proposal'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { trackingLogStore } from 'src/Store/tracking.store'
import { getFreelancerTracking, getFreelancerTrackingIntend } from 'src/api/freelancer-apis'
import { getAllJobs } from 'src/api/job-apis'
import { useFreelancerTracking } from 'src/hooks/freelancer-tracking-hook'
import { useSubscription } from 'src/libs/global-state-hook'
import AllJobPosts from 'src/pages/ClientPages/AllJobPost'
import JobDetails from 'src/pages/ForumPages/hire/job-details'
import JobList from 'src/pages/ForumPages/hire/job-list'
import AllContracts from 'src/pages/FreelancerPages/AllContracts'
import ClientProfile from 'src/pages/FreelancerPages/ClientProfile'
import { handleCacheData, handleGetCacheData, miniSearch, syncTrackingDataToBackend } from 'src/utils/handleData'
import './styles.css'
import Settings from 'src/pages/ClientPages/Client Settings'
import TransactionHistory from 'src/pages/FreelancerPages/Reports/TransactionHistory'

export default function FreelancerRoutes() {
  const { state: trackingLogs, setState: setTrackingLogs } = useSubscription(trackingLogStore)
  const { loadTrackingData, determineRenderType } = useFreelancerTracking()
  const [isSync, setSync] = useState(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()
  pathname === '/' && navigate('/find-work')

  useEffect(() => {
    const isIndex = localStorage.getItem('index')
    if (!isIndex || isIndex !== 'okay') {
      console.log('reIndex')
      getAllJobs()
        .then(res => {
          miniSearch.addAll(res.data)
          handleCacheData(res.data)
          localStorage.setItem('index', 'okay')
        })
        .catch(err => console.log('sth wrong', err))
    } else if (isIndex === 'okay') {
      handleGetCacheData()
        .then(res => {
          console.log('cache res', res)
          miniSearch.addAll(res?.rows?.map(s => s?.doc))
        })
        .catch(err => console.log('get cache failed', err))
    }
  }, [])

  useEffect(() => {
    getFreelancerTracking().then(res => {
      setTrackingLogs({
        ...trackingLogs,
        isFirstTime: res.data?.isFirstTime,
      })

      loadTrackingData(res.data?.freelancerTracking)
    })

    getFreelancerTrackingIntend().then(res => {
      determineRenderType(res.data)
    })
  }, [])

  useEffect(() => {
    if (!isSync) {
      window.addEventListener('beforeunload', event => {
        console.log('object called')
        setSync(true)
        syncTrackingDataToBackend(true)
        console.log('sync tracking to backend')
      })
    }

    window.addEventListener('unload', event => {
      event.preventDefault()
      event.stopPropagation()
      syncTrackingDataToBackend(true)
      console.log('sync tracking to backend')
    })
  }, [isSync])

  return (
    <div className="background_general">
      <Header />
      <div>
        <Routes>
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/find-work" element={<HomeFreelancer />} />
          <Route path="/" element={<HomeFreelancer />} />
          <Route path="/Search/:searchValue" element={<Search />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/job/" element={<AllJobPosts />} />
          <Route path="/job/:id" element={<JobDetailsFreelancer />} />
          <Route path="/job-details/:id" element={<JobDetailsFreelancer />} />
          <Route path="/fake-job" element={<JobDetails />} />
          <Route path="/fake-job-list" element={<JobList />} />
          <Route path="/job/apply/:id" element={<SubmitProposal />} />
          <Route path="/job/review-proposal/:id" element={<ReviewProposalsCard />} />
          <Route path="/job/applied/:id" element={<JobAppliedDetails />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/proposals/:id" element={<Proposals />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/profile/:id" element={<Profile noMargin={false} />} />
          <Route path="/email-verification" element={<EmailVerified />} />
          <Route path="/sign-up/please-verify" element={<PleaseVerifiy />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/all-contract" element={<AllContracts />} />
          <Route path="/invitations" element={<Offers />} />
          <Route path="/overview" element={<OverviewReports />} />
          <Route path="/my-reports" element={<Reports />} />
          <Route path="/life-time-billing" element={<BillingByClients />} />
          {/* <Route path="/connects-history" element={<ConnectsHistory />} /> */}
          <Route path="/buyconnects" element={<BuyConnects />} />
          <Route path="/client-info/:clientId" element={<ClientProfile />} />
          <Route path="/connects-history" element={<TransactionHistory />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/contract/:id" element={<Contract />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
