/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { fakeFreelancerState, fakeJobsState } from 'Store/fake-state';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import './HeaderSearchLg.css';

export default function HeaderSearchLg() {

  // const { arr, setarr, itemSearchList, setitemSearchList, setsearchList } = useContext(SearchContext)
  const { t } = useTranslation(['main']);
  const navigate = useNavigate();
  const user = fakeFreelancerState;
  const jobs = fakeJobsState;
  useEffect(() => {
    // sessionStorage.setItem('searchArray', JSON.stringify(user.searchHistory))
    // dispatch(freelancerDataAction());
  }, []);

  const handle = (e) => {
    // setitemSearchList(e.target.value)
  }

  // useEffect(() => {
  //  itemSearchList === "" && setsearchList([])
  // }, [itemSearchList])

  const searchDatabase = () => {
    let tempArr = [];
    // jobs.map((e) => e.skills?.includes(itemSearchList) && tempArr.push(e))
    // setsearchList(tempArr)
    navigate({ pathname: "/search" })

    
    // if (itemSearchList !== "") {
    //   let arr2 = []
    //   arr != null ? arr2 = [itemSearchList, ...arr] :
    //     arr2 = [itemSearchList]
    //   user.searchHistory != null ?
    //     updateUserData('freelancer', { searchHistory: [...user?.searchHistory, ...arr2] })
    //     : updateUserData('freelancer', { searchHistory: [...arr2] })
    //   sessionStorage.setItem('searchArray', JSON.stringify(arr2))
    //   setarr([...arr2])
    // }
  }
  return (
    <>
      <form id="search-form-id" className="d-flex ms-4">
        <Link className="btn position-relative search-btn-cn" onClick={searchDatabase} to={''}>
          <i className="fa fa-search text-white search-icon-cn"></i>
        </Link>
        <div className="dropdown search-type-cn">
          <Link
            className="nav-link dropdown-toggle"
            to="#"
            id="navbarDropdownMenuLink"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
          </Link>
        </div>
        <input
          className="form-control ms-1 ps-5 py-1 border-0 text-white search-input-cnn place-h-cn"
          type="search"
          onChange={handle}
          value={''}
          style={{ color: 'white' }}
          placeholder={t("Search")}
          aria-label="Search"
        />
      </form>
    </>
  )
}



