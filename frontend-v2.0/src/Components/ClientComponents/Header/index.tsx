import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import NavLargScreen from '../NavLargScreen'
import NavSmallScreen from '../NavSmallScreen'
import Logo from './../../SharedComponents/Logo/Logo'
import './Header.css'

export default function Header() {
  const { t } = useTranslation(['main'])

  return (
    <header className="nav-bg-cn">
      {/* Header in large screen */}
      <div id="nav-lg-id" className="ms-5 me-5 d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between">
          <Link to={'/'} style={{ textAlign: 'end' }}>
            <Logo />
            <p style={{ color: 'grey', fontWeight: 600, marginBottom: 0 }}>{t('For Clients')}</p>
          </Link>
        </div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-0 mx-4">
          <NavLargScreen />
        </nav>
      </div>

      {/* Header in Small screen */}

      <div className="container">
        <NavSmallScreen />
      </div>
    </header>
  )
}
