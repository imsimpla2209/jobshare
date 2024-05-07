// import { useEffect } from 'react'
// import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
// import { createGlobalStyle } from 'styled-components'
// import AccountManager from './accounts-manager'
// import Login from './auth/login'
// import RoleAccess from './auth/role-access'
// import { userCredential, userStore } from './auth/user-store'
// import BackupDataManager from './backup-data'
// import DashboardAdmin from './dashboard'
// import DepartmentManager from './departments'
// import DepartmentDetail from './departments/department-detail'
// import EventsPage from './events'
// import EventDetails from './events/event-details'
// import JobDetails from './hire/job-details'
// import JobList from './hire/job-list'
// import HomePage from './home-page'
// import IdeaDetail from './ideas/idea-detail'
// import LayoutAdmin from './layout/admin'
// import LayoutUser from './layout/user'
// import UserProfile from './user-profile'
// import OtherProfile from './user-profile/otherProfile'
// import WorkerDetails from './worker/worker-details'
// import WorkerList from './worker/worker-list'
// import SignUp from './auth/sign-up'
// import UnAuthorize from 'Components/CommonComponents/fobidden/unauthorize'
// import { LOCALSTORAGE, Http } from 'api/http'
// import { useAuth } from 'hooks/auth-hook'

// export default function App() {
//   const navigate = useNavigate()
//   const { login, logout, token, tokenVerified, userId, role } = useAuth()
//   const credential = JSON.parse(localStorage.getItem(LOCALSTORAGE.CREDENTIALS))

//   useEffect(() => {
//     userCredential.updateState({
//       userId: userId,
//       isLoggedIn: tokenVerified,
//       token: token,
//       login: login,
//       logout: logout,
//     })

//     if (credential) {
//       if (credential?.token === '' || !credential?.token) {
//       } else {
//         if (credential?.tokenVerified === true && credential?.userId) {
//           userCredential.updateState({
//             userId: credential.userId,
//             isLoggedIn: credential.tokenVerified,
//             token: credential.token,
//           })

//           const updateUserInfo = async () => {
//             await Http.get(`/api/v1/users/getProfile/${credential.userId}`)
//               .then(res => {
//                 userStore.updateState({ ...res.data.userInfo, loading: false })
//               })
//               .catch(err => {
//                 console.error(err.message)
//                 navigate('/')
//               })
//           }
//           updateUserInfo()
//         } else {
//         }
//       }
//     } else {
//     }
//   }, [])

//   const routes = (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/sign-up" element={<SignUp />} />
//       <Route path="/logout" />
//       <Route
//         path="/"
//         element={
//           <LayoutUser>
//             <Outlet />
//           </LayoutUser>
//         }
//       >
//         <Route path="" element={<HomePage />} />
//       </Route>

//       <Route
//         path="/freelance-jobs"
//         element={
//           <LayoutUser>
//             <Outlet />
//           </LayoutUser>
//         }
//       >
//         <Route path="" element={<JobList />} />
//         <Route path="details" element={<JobDetails />} />
//       </Route>

//       <Route
//         path="/hiring-workers"
//         element={
//           <LayoutUser>
//             <Outlet />
//           </LayoutUser>
//         }
//       >
//         <Route path="" element={<WorkerList />} />
//         <Route path="details" element={<WorkerDetails />} />
//         <Route path="profile" element={<OtherProfile />} />
//       </Route>

//       <Route
//         path="/admin"
//         element={
//           <RoleAccess roles={['admin']}>
//             <LayoutAdmin>
//               <Outlet />
//             </LayoutAdmin>
//           </RoleAccess>
//         }
//       >
//         <Route path="accounts-manager" element={<AccountManager />} />
//         <Route path="account" element={<UserProfile />} />
//         <Route path="departments" element={<DepartmentManager />} />
//         <Route path="departments/:id" element={<DepartmentDetail />} />
//         <Route path="" element={<HomePage />} />
//         <Route path="ideas" element={<HomePage />} />
//         <Route path="idea" element={<IdeaDetail />} />
//         <Route path="event" element={<EventsPage role="admin" />} />
//         <Route path="event/:id" element={<EventDetails />} />
//         <Route path="profile" element={<OtherProfile />} />
//         <Route path="backup" element={<BackupDataManager />} />
//         <Route path="dashboard" element={<DashboardAdmin />} />
//       </Route>

//       <Route path="*" element={<Navigate to={role ? `/${role}` : '/'} replace />} />
//       <Route path="/unauthorize" element={<UnAuthorize></UnAuthorize>}></Route>
//     </Routes>
//   )

//   return (
//     <>
//       <GlobalStyle />
//       {routes}
//     </>
//   )
// }

// const GlobalStyle = createGlobalStyle`
//   & {
//     .d-flex{
//       display: flex;
//     }
//     .center{
//       display: flex;
//       align-items: center;
//       justify-content:center;
//     }
//     .w-100{
//       width:100%;
//     }
//     .h-100{
//       height:100%;
//     }
//     .ellipsis{
//       white-space: nowrap;
//       text-overflow: ellipsis;
//     }
//   }
// `
