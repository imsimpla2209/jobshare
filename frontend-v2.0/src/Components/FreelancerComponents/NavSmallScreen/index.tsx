/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { useSubscription } from 'src/libs/global-state-hook'
import img from '../../../assets/img/icon-user.svg'
import HeaderSearchSm from '../../SharedComponents/HeaderSearchSm/HeaderSearchSm'
import { userStore } from 'src/Store/user.store'

export default function NavSmallScreen() {
  const { i18n, t } = useTranslation(['main'])
  let lang = i18n.language
  const user = useSubscription(userStore).state

  const logout = () => {
    console.log('tao logout')
  }

  return (
    <div className="collapse d-lg-none" id="navbarNavDropdown">
      <ul className="navbar-nav">
        <li className="mt-3">
          <HeaderSearchSm />
        </li>
        <li className="dropdown px-3">
          <a
            className={`nav-link dropdown-toggle mt-4 pt-4 border-top-cn`}
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              style={{ height: '50px', width: '50px' }}
              className="circle bg-white me-2"
              src={user?.avatar ? user?.avatar : img}
              alt=""
            />
            {user?.name}
            <i className="fa fa-sort-down text-white float-end"></i>
          </a>
          <ul id="acc-id" className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li className="px-4 py-3">
              <div id="acc-btns-id" className="btn-group w-100" role="group" aria-label="Basic example">
                <button type="button" className="btn">
                  {t('Online')}
                </button>
                <span style={{ padding: '0 1px' }}></span>
                <button type="button" className="btn">
                  {t('Invisible')}
                </button>
              </div>
            </li>
            <li>
              <Link className="dropdown-item px-4" to="/find-work">
                <div className="d-flex align-items-center">
                  <span style={{ marginLeft: '-5px' }}>
                    <i className="fa fa-user-circle fs-3"></i>
                  </span>
                  <div className="acc-cn ms-2">
                    <p>{t('Name')}</p>
                    <p>{t('Freelancer')}</p>
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item px-4 mb-1"
                to="/home"
                // onClick={changeLayOut}
              >
                <div className="d-flex align-items-center">
                  <span style={{ marginLeft: '-5px' }}>
                    <i className="fa fa-user-circle fs-3"></i>
                  </span>
                  <div className="acc-cn ms-2">
                    <p>{t('Name')}</p>
                    <p>{t('Client')}</p>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </li>
        <li className="dropdown px-3">
          <a
            className={`nav-link active dropdown-toggle mt-2 pt-3 border-top-cn ${lang === 'vi' && 'fs-5'}`}
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {t('FindWork')}
            <i className="fa fa-sort-down text-white float-end"></i>
          </a>
          <ul className="dropdown-menu sub-drop-cn" aria-labelledby="navbarDropdownMenuLink">
            <li>
              <a className="dropdown-item" href="#">
                {t('FindWork')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('Saved Jobs')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('Proposals')}
              </a>
            </li>
            <li>
              <Link className="dropdown-item" to={`/profile/$42000`}>
                {t('Profile')}
              </Link>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('My Stats')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('JobShare Readiness Test')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('My Project Dashboard')}
              </a>
            </li>
          </ul>
        </li>
        <li className="dropdown px-3">
          <a
            className={`nav-link dropdown-toggle mt-2 pt-3 border-top-cn`}
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {t('My Jobs')}
            <i className="fa fa-sort-down text-white float-end"></i>
          </a>
          <ul className="dropdown-menu sub-drop-cn" aria-labelledby="navbarDropdownMenuLink">
            <li>
              <a className="dropdown-item" href="#">
                {t('My Jobs')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('All Contracts')}
              </a>
            </li>
            <li>
              <Link className="dropdown-item" to="/invitations">
                {t('Invitations')}
              </Link>
            </li>
          </ul>
        </li>
        <li className="dropdown px-3">
          <a
            className={`nav-link dropdown-toggle mt-2 pt-3 border-top-cn`}
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {t('Reports')}
            <i className="fa fa-sort-down text-white float-end"></i>
          </a>
          <ul className="dropdown-menu sub-drop-cn" aria-labelledby="navbarDropdownMenuLink">
            <li>
              <a className="dropdown-item" href="#">
                {t('Overview')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('My Reports')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('Lifetime Billings by Client')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('Connects History')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('Transaction History')}
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                {t('Certificate of Earnings')}
              </a>
            </li>
          </ul>
        </li>
        <li className="nav-item px-3">
          <Link className={`nav-link mt-2 pt-3 border-top-cn`} to="/messages">
            {t('Messages')}
          </Link>
        </li>
        <li className="nav-item px-3">
          <a className={`nav-link mt-2 pt-3 border-top-cn`} href="#">
            {t('Help')}
            <i className="fas fa-question float-end"></i>
          </a>
        </li>
        <li className="nav-item px-3">
          <NavLink className={`nav-link mt-2 pt-3 border-top-cn`} to="/notifications">
            {t('Notification')}
            <i className="far fa-bell float-end"></i>
          </NavLink>
        </li>
        <li className="nav-item px-3">
          <a className={`nav-link mt-2 pt-3 border-top-cn`} href="#">
            {t('Direct Contracts')}
            <i className="far fa-paper-plane float-end" style={{ transform: 'scaleX(-1)' }}></i>
          </a>
        </li>
        <li className="nav-item">
          <a className={`dropdown-item mt-2 pt-3 border-top-cn`} href="#">
            <span>
              <i className="fa fa-cog"></i>
            </span>
            <span className="ps-3">{t('Settings')}</span>
          </a>
        </li>
        <li className="nav-item pb-2" onClick={logout}>
          <a className={`dropdown-item mt-2 pt-3 border-top-cn`} href="#">
            <span>
              <i className="fas fa-sign-out-alt"></i>
            </span>
            <span className="ps-3">{t('Log Out')}</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
