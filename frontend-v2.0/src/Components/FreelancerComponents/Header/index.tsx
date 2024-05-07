/* eslint-disable jsx-a11y/anchor-is-valid */
import { MenuUnfoldOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getSkillsWithCount } from 'src/api/job-apis'
import { pickName } from 'src/utils/helperFuncs'
import HeaderSearchSm from './../../SharedComponents/HeaderSearchSm/HeaderSearchSm'
import Logo from './../../SharedComponents/Logo/Logo'
import NavLargScreen from './../NavLargScreen'
import NavSmallScreen from './../NavSmallScreen'
import './Header.css'

export default function Header() {
  const { t, i18n } = useTranslation(['main'])

  const [showSearch, setShowSearch] = useState(false)
  const [showSearchIcon, setShowSearchIcon] = useState(true)
  const [skillShow, setSkillShow] = useState([])

  useEffect(() => {
    getSkillsWithCount().then(res => {
      setSkillShow(res?.data)
      console.log(res.data)
    })
  }, [showSearch, showSearchIcon])

  const toggleSearchForm = () => {
    showSearch ? setShowSearch(false) : setShowSearch(true)
  }
  const hideSearchIcon = () => {
    showSearchIcon ? setShowSearchIcon(false) : setShowSearchIcon(true)
  }

  return (
    <header className="nav-bg-cn py-1" style={{}}>
      {/* Header in large screen */}
      <div id="nav-lg-id" className="ms-5 me-5 d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between">
          <Link to={'/'} style={{ textAlign: 'end' }}>
            <Logo />
            <p style={{ color: 'grey', fontWeight: 600, marginBottom: 0 }}>{t('For Freelancers')}</p>
          </Link>
        </div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-0">
          <NavLargScreen />
        </nav>
      </div>

      {/* Header in Small screen */}
      <div id="nav-sm-id" className="container d-flex justify-content-between align-items-center">
        {showSearch ? (
          <div className="w-100">
            <HeaderSearchSm bg={showSearch} />
          </div>
        ) : (
          <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-0">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={hideSearchIcon}
              >
                {
                  <span>
                    <MenuUnfoldOutlined className="text-dark" />
                  </span>
                }
              </button>
            </nav>
            <Logo />
          </>
        )}
        <button id="search-btn-res-id" className="btn d-lg-none shadow-none" onClick={toggleSearchForm}>
          {showSearchIcon &&
            (showSearch ? <i className="fas fa-times text-white"></i> : <i className="fa fa-search text-white"></i>)}
        </button>
      </div>
      <div className="container">
        <NavSmallScreen />
      </div>
      <div
        className="second-nav-cn pt-2 d-xl-block d-none mt-1"
        style={{
          background: '#2E6421',
          color: 'white',
          paddingBottom: 1,
        }}
      >
        <ul
          className="d-flex align-items-baseline justify-content-center"
          style={{
            color: 'white',
          }}
        >
          {skillShow.map(s => (
            <li
              key={s?._id?.id}
              style={{
                width: 'auto',
              }}
            >
              <Link to={`/search?skillId=${s?._id?.id}`}>
                {pickName(s?._id, i18n.language)}({s?.count})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
