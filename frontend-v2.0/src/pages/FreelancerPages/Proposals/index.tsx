/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProposalCard from "../../../Components/FreelancerComponents/ProposalCard";
import { getProposals } from "src/api/proposal-apis";
import { useSubscription } from "src/libs/global-state-hook";
import { freelancerStore } from "src/Store/user.store";
import { EStatus } from "src/utils/enum";
import { Pagination, Tabs } from "antd";
import Loader from "src/Components/SharedComponents/Loader/Loader";
import archiveimg from '../../../assets/img/archive.png'
import pendingimg from '../../../assets/img/pending.png'
import rejectimg from '../../../assets/img/reject.png'
import cancelimg from '../../../assets/img/cancel.png'

const tabLists = {
  "Pending": EStatus.PENDING,
  "Rejected": EStatus.REJECTED,
  "Archive": EStatus.ARCHIVE,
  "Cancel": EStatus.CANCELLED,
}

const tabIcons = [
  pendingimg,
  rejectimg,
  archiveimg,
  cancelimg
]

export default function Proposals() {

  const { t } = useTranslation(['main']);
  const freelancer = useSubscription(freelancerStore).state
  const [accpetedProposals, setAcceptedProposals] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isFirstLoad, setFirstLoad] = useState(true)
  const [tab, setTab] = useState(EStatus.PENDING)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [loading, onLoading] = useState(true)
  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    if (freelancer?._id) {
      getProposal();
    }
  }, [freelancer?._id, tab, refresh])

  const onRefresh = () => {
    setRefresh(!refresh)
  }

  const getProposal = (p?: number) => {
    onLoading(true);

    const request = getProposals({ currentStatus: tab, freelancer: freelancer?._id, page: (p ?? page) });

    request.then((res) => {
      setProposals(res.data.results);
      setTotal(res.data.totalResults)
    }).catch(err => {
      console.log('ERROR - getInvitations', err)
    }).finally(() => onLoading(false));
  }

  const handleChangePage = (page: number) => {
    setPage(page);
    getProposal(page)
  }

  useEffect(() => {
    if (!!freelancer?._id && isFirstLoad) {
      getProposals({ freelancer: freelancer?._id, currentStatus: EStatus.ACCEPTED }).then((res) => {
        setFirstLoad(false);
        setAcceptedProposals(res.data.results);
      }).catch((err) => {
        console.log('cannot load proposals', err)
      })
    }
  }, [freelancer?._id]);

  return (
    <div className="row justify-content-center">
      <div className="col-md-9 col-12">
        <h3 className="my-5">{t("My proposals")}</h3>
        <div className="list-group-item py-lg-4 mt-3">
          <h4>
            {t("Active proposals")} ({accpetedProposals?.length})
            <span className="text-jobsicker ms-2">
              <i className="fas fa-question-circle"></i>
            </span>
          </h4>
        </div>
        <div className="container list-group-item py-lg-4 mb-3">
          {accpetedProposals?.map((proposal, index) => (
            <ProposalCard job={proposal?.job} proposal={proposal} key={index} ind={index} onRefresh={onRefresh}/>
          ))}
        </div>
        <div className="list-group-item py-lg-4 mt-3">

          <h4>
            {t("Submitted proposals")} ({total})
            <span className="text-jobsicker ms-2">
              <i className="fas fa-question-circle"></i>
            </span>
          </h4>
        </div>
        <div className="container list-group-item py-lg-4 mb-3">
          <Tabs
            onChange={(t) => setTab(t as EStatus)}
            type="card"
            tabBarStyle={{ color: "black", fontWeight: 600, }}
            items={Object.keys(tabLists).map((k, i) => {
              return {
                label: `${t(`${k}`)}`,
                key: tabLists[k],
                icon: <img src={tabIcons[i]} alt="s" height={24}></img>
              };
            })}
          />
          {
            loading ? <Loader></Loader>
              : <>
                {proposals?.map((proposal, index) => (
                  <ProposalCard job={proposal?.job} proposal={proposal} key={index} ind={index} onRefresh={onRefresh} />
                ))}
              </>
          }
          <Pagination defaultCurrent={1} current={page} onChange={(p) => handleChangePage(p)} total={total} />

        </div>
      </div>
    </div>
  );
}
