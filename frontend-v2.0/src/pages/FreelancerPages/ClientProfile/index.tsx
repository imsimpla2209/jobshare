/* eslint-disable react-hooks/exhaustive-deps */

import { useParams } from "react-router";

import { Pagination, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientCardView from "src/Components/FreelancerComponents/ClientCardView";
import JobCard from "src/Components/FreelancerComponents/SectionCenterFreelancerHome/JobCard";
import StarsRating from "src/Components/SharedComponents/StarsRating/StarsRating";
import { locationStore } from "src/Store/commom.store";
import { freelancerStore, userStore } from "src/Store/user.store";
import { getClient } from "src/api/client-apis";
import { getJobs } from "src/api/job-apis";
import { useSubscription } from "src/libs/global-state-hook";
import Loader from "../../../Components/SharedComponents/Loader/Loader";
import { updateFreelancer } from "src/api/freelancer-apis";

enum EViewMode {
  JOBLIST = 'joblist',
  REVIEW = 'review',
}

export default function ClientProfile() {
  const { clientId } = useParams();
  const [jobDatas, setJobDatas] = useState([])
  const [clientData, setClientData] = useState<any>({})
  const freelancer = useSubscription(freelancerStore).state;
  const setFreelancer = useSubscription(freelancerStore).setState;
  const user = useSubscription(userStore).state;
  const locations = useSubscription(locationStore).state
  const [loading, setLoading] = useState(false);
  const [page, setpage] = useState(1);
  const [total, setTotal] = useState(10);
  const [viewMode, setViewMode] = useState(EViewMode.JOBLIST)
  const [vietModeBtn, setViewModeBtn] = useState({

  })
  const { i18n, t } = useTranslation(['main']);

  const follow = (e) => {
    e.preventDefault();
    if (viewMode === EViewMode.JOBLIST)
    {
      setViewMode(EViewMode.REVIEW)
      updateFreelancer({ favoriteClients: freelancer.favoriteClients ? [...freelancer.favoriteClients, clientData._id] : [clientData._id] }, freelancer._id).then(res => {
        setFreelancer(res.data)
      })
      setViewModeBtn({
        icon: 'cancel',
        text: 'Unfollow',
        btnStyle: {
          color: 'maroon',
          cursor: 'normal',
          animation: 'spin 200ms ease-in-out'
        }
      });
    }
    else {
      updateFreelancer({ favoriteClients: freelancer.favoriteClients ? [...freelancer.favoriteClients, clientData._id] : [clientData._id] }, freelancer._id).then(res => {
        setFreelancer(res.data)
      })
      setViewModeBtn({
        icon: 'add_circle',
        text: 'Follow',
        btnStyle: {
          color: 'limegreen',
          cursor: 'pointer',
          animation: 'spinBack 200ms ease-in-out'
        }
      });
    }
  };

  useEffect(() => {
    getJobs({ client: clientId }).then(res => {
      console.log("load job, ",);
      setJobDatas(res.data.results)
    })
    getClient(clientId).then(res => {
      setClientData(res.data)
    })
  }, [clientId])


  const handleGetData = useCallback((p?: number | undefined) => {
    setLoading(true);
    return getJobs({ client: clientId, page: p || page })

  }, [clientId, page])

  useEffect(() => {
    console.log('rerender')
    console.log('rerender1')
    handleGetData().then(res => {
      setJobDatas(res.data?.results)
      setTotal(res.data?.totalResults)
    }).catch(err => {
      toast.error('something went wrong, ', err)
    }).finally(() => {
      setLoading(false)
    })

  }, [user._id, clientId, page])

  const handleChangePage = useCallback((p: number) => {
    if (p === page) return
    setpage(p)
    handleGetData(p).then(res => {
      setJobDatas(res.data?.results)
    }).catch(err => {
      toast.error('something went wrong, ', err)
    }).finally(() => {
      setLoading(false)
    })
  }, [handleGetData, page, setJobDatas])

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarsRating key={i} clientReview={clientData?.rating} index={i} />);
    }
    return stars;
  };

  return (
    <>
      {jobDatas !== null ?
        <div className="container-md container-fluid-sm my-lg-5 my-sm-4 py-xs-5 px-md-5">
          <div className="d-lg-block">
            <div className="bg-white py-lg-4 px-4 border border-1 py-sm-3 py-xs-5 rounded">
              <h5>{t("ClientInfo")}</h5>
              <ClientCardView client={clientData} clientId={clientId} total={total}></ClientCardView>
            </div>
            <div className="row">
              <div className="col-lg-3 col-xs-3">
                <Space size="middle" direction="vertical" wrap className='mb-2 bg-white p-4'>
                  <div className='fw-bold me-1 text-muted' style={{ fontSize: "0.9em" }}>{t("Prefer Job Types") + ":"}</div>
                  {clientData?.preferJobType?.map((c, index) => (
                    <div key={index}>
                      <Link to={`/search?categoryId=${c?._id}`}
                        key={index}
                        type="button"
                        className="btn text-light btn-sm rounded-pill cats mx-1"
                      >
                        {c?.name}
                      </Link>
                    </div>
                  ))}
                  <h5 className="text-muted mt-3">{t("Other Verifications")}</h5>
                  <p><strong>{t("Email Verification")}: </strong> {clientData?.user?.isEmailVerified ? `${t("Verified")}✅` : `${t("Not Verified")} ⛔`} </p>
                  <p><strong>{t("Phone Verification")}: </strong> {clientData?.user?.isPhoneVerified ? `${t("Verified")}✅` : `${t("Not Verified")} ⛔`}</p>

                  <h5 className="text-muted mt-3" style={{ lineHeight: 0 }}>{t("Rating from Freelancers")}</h5>
                  <div className="text-muted mb-3 me-3 ">{renderStars()}</div>

                </Space>
              </div>
              <div className="col-lg-9 col-xs-12  mt-lg-4 d-flex flex-column">
                {
                  !loading
                    ? jobDatas?.map((item, index) => (
                      <div key={index}>
                        <JobCard item={item} freelancer={user} lang={i18n?.language} />
                      </div>
                    ))
                    : <div className="d-flex justify-content-center align-items-center" style={{ height: "10vh" }}>
                      <Loader />
                    </div>
                }

                <div style={{
                  display: 'flex', justifyContent: 'end',
                  background: 'white', alignContent: 'center',
                  alignItems: 'center', padding: 16, borderRadius: 10
                }}>
                  <Pagination
                    className="mt-5"
                    total={total}
                    current={page}
                    showSizeChanger
                    responsive
                    onChange={(p) => handleChangePage(p)}
                    showTotal={(total) => `Total ${total} items`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row  me-md-1">
            <div className="col-lg-12 col-xs-12">
            </div>
          </div>
        </div>
        :
        <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
          <Loader />
        </div>
      }

    </>
  );
}

