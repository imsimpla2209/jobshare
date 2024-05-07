/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { appInfoStore } from 'src/Store/commom.store'
import { freelancerStore, userStore } from 'src/Store/user.store'
import { updateFreelancer } from 'src/api/freelancer-apis'
import { useSubscription } from 'src/libs/global-state-hook'

export default function ConnectsAndSubmit() {
  const { t } = useTranslation(['main'])
  const { id } = useParams()
  const freelancer = useSubscription(freelancerStore).state
  const user = useSubscription(userStore).state
  const appInfo = useSubscription(appInfoStore).state
  // let [text, setText] = useState("");
  const [jobProposal, setjobProposal] = useState(false)
  const navigate = useNavigate()
  const [isliked, setisliked] = useState(false)
  const setState = useSubscription(freelancerStore).setState

  const [searchParams, setSearchParams] = useSearchParams()
  const isRcmd = searchParams.get('isRcmd')

  useEffect(() => {
    // db.collection("freelancer")
    //   .doc(auth.currentUser.uid)
    //   .collection("jobProposal")
    //   .where("jobId", "==", id)
    //   .onSnapshot((res) => {
    //     if (res?.docs.length > 0) setjobProposal(true);
    //   });
  }, [])

  useEffect(() => {
    // dispatch(jobsDataAction());
    // dispatch(freelancerDataAction())
  }, [isliked])

  const saveJob = () => {
    setisliked(!isliked)
    if (!freelancer?.favoriteJobs.includes(id)) {
      const favorJob = freelancer?.favoriteJobs || []
      updateFreelancer(
        {
          favoriteJobs: [...favorJob, id],
        },
        freelancer?._id
      ).then(() => {
        setState({ ...freelancer, favoriteJobs: [...favorJob, id] })
      })
    } else {
      const favorJob = freelancer?.favoriteJobs
      favorJob?.forEach((item, index) => {
        if (item === id) {
          favorJob?.splice(index, 1)
          updateFreelancer(
            {
              favoriteJobs: favorJob || [],
            },
            freelancer?._id
          ).then(() => {
            setState({ ...freelancer, favoriteJobs: favorJob || [] })
          })
        }
      })
    }
  }

  const handlewithdrawProposal = async () => {
    try {
      // await db
      //   .collection("job")
      //   .doc(id)
      //   .collection("proposals")
      //   .where("freelancerId", "==", auth.currentUser.uid)
      //   .get()
      //   .then((res) =>
      //     res.docs.map((e) => {
      //       proposal = e.id;
      //       setProposal(proposal);
      //       db.collection("job")
      //         .doc(id)
      //         .collection("proposals")
      //         .doc(proposal)
      //         .delete();
      //       console.log(proposal);
      //     })
      //   );
      // await db
      //   .collection("freelancer")
      //   .doc(auth.currentUser.uid)
      //   .collection("jobProposal")
      //   .where("jobId", "==", id)
      //   .get()
      //   .then((res) =>
      //     res.docs.map((e) => {
      //       freelancer = e.id;
      //       setFreelancer(freelancer);
      //       db.collection("freelancer")
      //         .doc(auth.currentUser.uid)
      //         .collection("jobProposal")
      //         .doc(freelancer)
      //         .delete();
      //       console.log(freelancer);
      //     })
      //   );
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-white py-lg-4 px-4 border border-1 py-sm-3">
      <div className="d-lg-grid gap-2  mx-auto d-none">
        {!jobProposal ? (
          <button
            className="btn bg-jobsicker"
            onClick={handleRout => navigate(`/job/apply/${id}?isRcmd=${isRcmd || false}`)}
            disabled={
              freelancer?.isProfileVerified === false || user?.jobsPoints < appInfo?.freelancerSicks?.proposalCost
            }
          >
            {t('Submit a proposal')}
          </button>
        ) : (
          <button className="btn bg-jobsicker-dark" onClick={handlewithdrawProposal}>
            {t('Withdraw')}
          </button>
        )}

        <button className="btn btn-light border border-1 my-lg-2" type="button" onClick={saveJob}>
          {freelancer?.favoriteJobs?.includes(id) ? <HeartFilled style={{ color: '#0E4623' }} /> : <HeartOutlined />}
          {/* {text} */}
        </button>
      </div>
      <p>
        {t('Required Connects to submit a proposal')}: {appInfo?.freelancerSicks?.proposalCost}
      </p>
      <p>
        {t('Available Connects')}: {user.jobsPoints}
      </p>
    </div>
  )
}
