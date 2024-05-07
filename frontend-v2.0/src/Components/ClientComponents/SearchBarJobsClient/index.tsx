import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";



export default function SearchBarJobsClient() {
  const { t } = useTranslation(['main']);
  const navigate = useNavigate();
  // const { freelancerSearchList, setfreelancerSearchList, setfreelancerArr,freelancerArr } = useContext(SearchContext)
  const handle = (e) => {
    // setfreelancerSearchList(e.target.value)
  }
  // useEffect(() => {
  //     setfreelancerArr([])
  // }, [freelancerSearchList])
  const searchDatabase = () => {
    let tempArr = [];
    // db.collection('freelancer')
    //   .where('firstName', '==', freelancerSearchList)
    //   .onSnapshot(
    //     jobs => jobs.docs.map(
    //       item => {
    //         tempArr.push(item.data())
    //         if (freelancerSearchList != "") {
    //           setfreelancerArr([...tempArr])
    //           navigate({pathname:"/freelancer/searchclient"})
    //       }

    //   })
    //       )
    //   if(tempArr.length<=0){
    //       setfreelancerArr(null)
    //     navigate('/freelancer/searchclient')
    //   }
  }


  return (

    <div>

      <div className="col-8 input-group form-outline has-success">
        <input
          id="input"
          type="search"
          onChange={handle}
          value={'freelancerSearchList'}
          className="form-control text-dark bg-white btn-outline-success"
          placeholder={t("Search For Jobs")}
        />
        <Link to={""} >
          <button
            id="search-button"
            type="button"
            className="btn bg-jobsicker bg-invert"
            onClick={searchDatabase}
          >
            <i className="fas fa-search" />
          </button>
        </Link>
      </div>
      <span>
        <a href="#" className="advanced-search-link">
          {t("AdvancedSearch")}
        </a>
      </span>
    </div>

  )
}
