/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { freelancerStore } from "src/Store/user.store";
import { useSubscription } from "src/libs/global-state-hook";
import SavedJobsHeader from "./../../../Components/FreelancerComponents/SavedJobsHeader";
import Loader from './../../../Components/SharedComponents/Loader/Loader';
import { getFavJobsByUser } from "src/api/job-apis";
import { Pagination } from "antd";
import JobCard from "src/Components/FreelancerComponents/SectionCenterFreelancerHome/JobCard";
import { useTranslation } from "react-i18next";
import nothingLeft from "assets/img/nothingleft.png"

export default function SavedJobs() {
  const { i18n } = useTranslation(['main'])
  const freelancer = useSubscription(freelancerStore).state;
  const [favJobs, setFavJobs] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    getFavJobsByUser(freelancer?._id, { page: page }).then((res) => {
      setFavJobs(res.data.results)
    }).catch(err => {
      console.log('load fav job fail', err)
    })
  }, [page]);

  return (
    <div className="container-md container-fluid-sm my-lg-4">
      <div className="col-12">
        <SavedJobsHeader jobs={freelancer.favoriteJobs?.length} />
        {
          !!freelancer.favoriteJobs?.length ?
            <>
              {
                favJobs?.map((item) => (
                  <div key={item?._id} >
                    <JobCard item={item} lang={i18n.language} freelancer={freelancer} />
                  </div>
                ))

              }
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Pagination
                  className="mt-5"
                  total={freelancer.favoriteJobs?.length}
                  current={page}
                  showQuickJumper
                  responsive
                  onChange={(p) => { setPage(p)}}
                  showTotal={(total) => `Total ${total} items`}
                />
              </div>
            </>
            :
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
              <img src={nothingLeft} alt="" />
              <p className="h3">No saved jobs.</p>
            </div>
        }
      </div>
    </div>
  );
}