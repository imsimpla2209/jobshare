/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BlueColorButton } from "src/Components/CommonComponents/custom-style-elements/button";
import Loader from "src/Components/SharedComponents/Loader/Loader";
import { freelancerStore, userStore } from "src/Store/user.store";
import { getContracts } from "src/api/contract-apis";
import { useSubscription } from "src/libs/global-state-hook";
import { EStatus } from "src/utils/enum";
import { currencyFormatter } from "src/utils/helperFuncs";
import MyJobsActiveContractFixed from '../../../Components/FreelancerComponents/MyJobsActiveContractFixed';

export default function MyJobs() {
  const freelancer = useSubscription(freelancerStore).state;
  const user = useSubscription(userStore).state;
  const { t } = useTranslation(['main']);
  const [myJobs, setMyJobs] = useState<any>([])
  const [loading, onLoading] = useState<any>(true)
  const [page, onPage] = useState<any>(1)
  const [total, onTotal] = useState<any>(0)

  useEffect(() => {
    if (freelancer && user) {
      getMyJobs()
    }
  }, [freelancer, user])

  const getMyJobs = (p?: number) => {
    onLoading(true)
    getContracts({
      freelancer: (freelancer._id),
      currentStatus: EStatus.ACCEPTED,
      sortBy: 'updatedAt:desc',
      page: p ?? page,
    }).then(res => {
      onTotal(res.data?.totalResults)
      setMyJobs(res.data?.results)
    }).catch(err => {
      console.log('ERROR: cannot fetch', err)
    }).finally(() => {
      onLoading(false)
    })
  }

  return (
    <div className="">
      <div className="container">
        <div className="row">
          <div className="col-3 my-4 d-flex bg-white p-2 rounded" style={{
            textAlign: "center",
            color: "grey"
          }}>
            <h3 style={{ fontWeight: "bold" }}>{t("My Jobs")}</h3>
            {/* <h3 className="ms-auto bold">
              {t("Earnings available now")}:
              <a href=""> {currencyFormatter(freelancer?.earned)}</a>
            </h3> */}
          </div>
          <div className="col-12 bg-white border border-gray rounded">
            {
              loading ? <Loader /> :
                <>
                  {
                    myJobs?.map(j => (
                      <div key={j?._id}>
                        <MyJobsActiveContractFixed myJob={j} />

                      </div>
                    ))
                  }
                </>
            }
          </div>
          <div className="col-12 bg-white mb-5  border border-gray rounded d-flex flex-column py-3 justify-content-center align-items-center">

            <Link to="/all-contract">
              <BlueColorButton className="bg-white btn-outline-secondary border border-rounded">
                <span className="fw-bold">view All Contracts</span>
              </BlueColorButton>
            </Link>
          </div>


        </div>
      </div>
    </div>

  );
}
