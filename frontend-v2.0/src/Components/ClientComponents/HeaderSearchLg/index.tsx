
/* eslint-disable array-callback-return */
import { fakeFreelancerState } from 'Store/fake-state';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


export default function HeaderSearchLg() {
  const { t } = useTranslation(['main']);
  const navigate = useNavigate();
  const freelancers = fakeFreelancerState;
  
  useEffect(() => {
    // dispatch(freelancersDataAction());
  }, [])

  useEffect(() => {
    // let tempArr = [];
    // freelancers.map((tal) => tal.firstName.toLowerCase().includes(freelancerSearchList.toLowerCase()) && tempArr.push(tal))
    // setfreelancerArr([...tempArr])
    // freelancerSearchList === "" && setfreelancerArr([])
  }, [])

  const handle = (e) => {
    // setfreelancerSearchList(e.target.value)
  }

  const searchDatabase = () => {
    let tempArr = [];
    // freelancers.map((tal) => tal.firstName.toLowerCase().includes(freelancerSearchList.toLowerCase()) && tempArr.push(tal))
    // setfreelancerArr([...tempArr])
    navigate({ pathname: "/freelancer/searchclient" })
  }


  return (
    <div>
      <form id="search-form-id" className="d-flex ms-4">
        <Link className="btn position-relative search-btn-cn"
        onClick={searchDatabase} to={''}        >
          <i className="fa fa-search text-white search-icon-cn"></i>
        </Link>
        <div className="dropdown search-type-cn">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
          </a>
        </div>
        <input
          className="form-control ms-1 ps-5 py-1 border-0 text-white search-input-cnn"
          type="search"
          onChange={handle}
          value={[]}
          style={{ color: 'white' }}
          placeholder={t("Search")}
          aria-label="Search"
        />
      </form>
    </div>
  )
}
