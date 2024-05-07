/* eslint-disable jsx-a11y/anchor-is-valid */
import { useTranslation } from 'react-i18next'
import './styles.css'

export default function SearchBox() {
  const { t } = useTranslation(['main'])

  return (
    <form id="search-form-id" className="d-flex mt-2">
      <button className="btn position-relative search-btnn-cn ">
        <i className="fa fa-search search-icon-cn"></i>
      </button>
      <div className="nav-item dropdown search-type-cn ">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i className="fa fa-sort-down search-icon-cn"></i>
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a className="dropdown-item px-4" href="#">
            <div className="d-flex align-items-center">
              <span className="me-2 mb-3"><i className="fas fa-user fs-6"></i></span>
              <div className="acc-cn ms-2">
                <p>{t("Freelancer")}</p>
                <p>{t("Hire professionals and agencies")}</p>
              </div>
            </div>
          </a>
          <a className="dropdown-item px-4" href="#">
            <div className="d-flex align-items-center">
              <span className="me-2 mb-3"><i className="fas fa-clipboard-list fs-6"></i></span>
              <div className="acc-cn ms-2">
                <p>{t("Projects ")}<span id="search-type-projects-new" className="rounded-pill">{t("NEW")}</span>
                </p>
                <p>{t("Buy pre-defined projects")}</p>
              </div>
            </div>
          </a>
          <a className="dropdown-item px-4" href="#">
            <div className="d-flex align-items-center">
              <span className="me-2 mb-3"><i className="fas fa-briefcase fs-6"></i></span>
              <div className="acc-cn ms-2">
                <p>{t("Jobs")}</p>
                <p>{t("Apply to jobs posted by clients")}</p>
              </div>
            </div>
          </a>
        </ul>
      </div>
      <input className="form-control ms-1 ps-5 py-1 search-inputt-cn" type="search" placeholder={t("Search")} aria-label="Search" />
    </form>
  )
}