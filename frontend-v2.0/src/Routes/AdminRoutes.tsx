import Billing from 'pages/AdminPages/Billing'
import Home from 'pages/AdminPages/Home'
import SignIn from 'pages/AdminPages/SignIn'
import Tables from 'pages/AdminPages/Tables'
import 'pages/AdminPages/assets/styles/main.css'
import 'pages/AdminPages/assets/styles/responsive.css'
import { Route, Routes } from 'react-router-dom'
import Main from 'src/Components/AdminComponents/layout/Main'
import CategoriesTable from 'src/pages/AdminPages/Categories'
import JobTables from 'src/pages/AdminPages/JobTables'
import Profile from 'src/pages/AdminPages/Profile'
import SignUp from 'src/pages/AdminPages/SignUp'
import SkillsTable from 'src/pages/AdminPages/Skills'
import BackupDataManager from 'src/pages/ForumPages/backup-data'

function AdminRoutes() {
  return (
    <div className="App">
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/" element={<Main />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Tables />} />
          <Route path="/skills" element={<SkillsTable />} />
          <Route path="/categories" element={<CategoriesTable />} />
          <Route path="/jobs" element={<JobTables />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/backup" element={<BackupDataManager />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default AdminRoutes
