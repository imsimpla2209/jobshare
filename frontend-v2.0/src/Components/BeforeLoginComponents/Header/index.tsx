/* eslint-disable */
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Logo from 'src/Components/SharedComponents/Logo/Logo'
import LanguageList from '../../SharedComponents/LanguageBtn/LanguageList'
import './Header.css'
import SearchBox from 'src/Components/SharedComponents/SearchBox'
import { useEffect, useState } from 'react'
import { getCategories, getSkills } from 'src/api/job-apis'
import { pickName } from 'src/utils/helperFuncs'

export default function Header() {
  const { i18n } = useTranslation(['main'])
  let lang = i18n.language
  const { t } = useTranslation(['main'])
  const [skills, setSkills] = useState([])
  const [cats, setCats] = useState([])

  useEffect(() => {
    getSkills().then(res => {
      setSkills(res.data)
    })
    getCategories().then(res => {
      setCats(res.data)
    })
  }, [])

  return (
    <header
      className="py-1 pt-2 bg-white "
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 20,
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-around align-items-center mb-3">
          <div className="d-flex align-items-center w-auto">
            <div className="d-flex" style={{ width: 136 }}>
              <Logo />
            </div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-0">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link n-l-c-cn dropdown-toggle fs-6"
                      href="#"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {t('Find Freelancer')}
                      <i className="fa fa-sort-down ms-1 px-2"></i>
                    </a>
                    <ul
                      id="find-freelancer-dd-id"
                      className={`dropdown-menu pb-4 pe-4`}
                      aria-labelledby="navbarDropdownMenuLink"
                    >
                      <div className="d-flex">
                        <ul className="mt-3 d-inline-block typeOfwork-cn">
                          <span className="fw-bold">{t('TYPE OF WORK')}</span>
                          {cats?.slice(3, 11)?.map(c => (
                            <li key={c?._id}>
                              <Link className="dropdown-item" to="dev-it">
                                {c?.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 ps-4 d-inline-block waysToHire-cn">
                          <span className="fw-bold">{t('WAYS TO HIRE')}</span>
                          <div className="d-flex mt-3">
                            <div>
                              <a href="#">
                                <p className="fw-bold">{t('Freelancer Marketplace')}</p>
                                <p className="">{t('Post a job and get proposals')}</p>
                              </a>
                              <a href="#">
                                <p className="fw-bold">{t('Freelancer Scout')}</p>
                                <p>{t('Have us find you an expert')}</p>
                              </a>
                            </div>
                            <div className="ms-5">
                              <a href="#">
                                <p className="fw-bold">{t('Freelancer Scout')}</p>
                                <p className="">{t('Have us find you an expert')}</p>
                              </a>
                              <a href="#">
                                <p className="fw-bold">{t('Enterprise Suite')}</p>
                                <p>{t('Revamp the way you hire')}</p>
                              </a>
                            </div>
                          </div>
                          <div className={`border-top mt-5 pt-4`}>
                            <a href="#">
                              {t('Learn how to hire on JobShare')}
                              <i className={`fa fa-arrow-right ms-3 text-success `}></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link n-l-c-cn dropdown-toggle fs-6"
                      href="#"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {t('FindWork')}
                      <i className="fa fa-sort-down ms-1  px-2"></i>
                    </a>
                    <ul id="find-work-dd-id" className="dropdown-menu pb-4" aria-labelledby="navbarDropdownMenuLink">
                      <div className="d-flex ">
                        <ul className="mt-3 d-inline-block ">
                          <span className="fw-bold">{t('TOPSKILLS')}</span>
                          {skills?.slice(0, 6)?.map((s, ix) => (
                            <li key={s?._id}>
                              <Link className={`dropdown-item ${ix === 0 ? 'mt-3' : ''}`} to="freelance-jobs">
                                {pickName(s, lang)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <ul className="d-inline-block ms-5">
                          {skills?.slice(7, 12)?.map((s, ix) => (
                            <li key={s?._id}>
                              <Link className={`dropdown-item ${ix === 0 ? 'mt-5 pt-4' : ''}`} to="freelance-jobs">
                                {pickName(s, lang)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3 ps-4 d-inline-block">
                        <div className="border-top pt-3">
                          <a href="#" className={` pt-4`}>
                            {t('Learn how to get hired on JobShare')}
                            <i className={`fa fa-arrow-right} ms-3 text-success `}></i>
                          </a>
                        </div>
                      </div>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link n-l-c-cn dropdown-toggle fs-6"
                      href="#"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {t('Why JobShare')}
                      <i className="fa fa-sort-down ms-1  px-2"></i>
                    </a>
                    <ul id="why-work-dd-id" className={`dropdown-menu mt-3 `} aria-labelledby="navbarDropdownMenuLink">
                      <li>
                        <a
                          className="dropdown-item py-2 mt-3"
                          href="#"
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            const element = document.getElementById('success-story')
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }}
                        >
                          {t('Success Stories')}
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item py-2" href="#">
                          {t('Reviews')}
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item py-2" href="#">
                          {t('Learn')}
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item py-2" href="#">
                          {t('Forums')}
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="d-flex justify-content-between col-7">
            <SearchBox />
            <div className="col-md-5 border-start ps-2 d-flex j justify-content-end">
              <Link className={`btn login-btn-cn `} to="/login">
                {t('Log In')}
              </Link>
              <Link className={`btn signup-btn-cn px-3 py-2 `} to="/sign-up">
                {t('Sign Up')}
              </Link>
              <LanguageList />
            </div>
          </div>
        </div>
      </div>
      <div className="second-nav-cn pt-2 pb-1">
        <div className="container">
          <ul className="d-flex align-items-center ms-0 ps-0">
            <li>
              <a href="#" className="fs-6">
                {t('Development & IT')}
              </a>
            </li>
            <li>
              <a href="#" className="fs-6">
                {t('Design & Creative')}
              </a>
            </li>
            <li>
              <a href="#" className="fs-6">
                {t('Sales & Marketing')}
              </a>
            </li>
            <li>
              <a href="#" className="fs-6">
                {t('Writing & Translation')}
              </a>
            </li>
            <li>
              <a href="#" className="fs-6">
                {t('Admin & Customer Support')}
              </a>
            </li>
            <li>
              <a href="#" className="fs-6">
                {t('Finance & Accounting')}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
