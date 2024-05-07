/* eslint-disable */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../../SharedComponents/Logo/Logo'
import { useTranslation } from 'react-i18next'

export default function LoginHeader() {
  const { t } = useTranslation(['main'])

  const { pathname } = useLocation()

  return (
    <header className="py-3" style={{ background: 'white' }}>
      <div className="container d-flex justify-content-between">
        <Logo />
        <div>
          {pathname === '/sign-up' && (
            <p className="text-muted">
              {t('Already have an account')}
              <Link to="/login"> {t('Log In')}</Link>
            </p>
          )}
        </div>
      </div>
    </header>
  )
}
