import { useParams } from 'react-router'
import JobDescriptionJobDetails from '../../../Components/FreelancerComponents/JobDescriptionJobDetails'
import RightSidebarJobDetails from '../../../Components/FreelancerComponents/RightSidebarJobDetails'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import NotFound from 'src/Components/CommonComponents/results/NotFound'
import OtherOpenJobsByThisClient from 'src/Components/FreelancerComponents/OtherOpenJobsByThisClient'
import { ETrackingEvent } from 'src/Store/tracking.store'
import { freelancerStore, userStore } from 'src/Store/user.store'
import { getJob } from 'src/api/job-apis'
import 'src/assets/style/style.css'
import { ETrackingType, useFreelancerTracking } from 'src/hooks/freelancer-tracking-hook'
import { useSubscription } from 'src/libs/global-state-hook'
import AcceptedAlert from '../../../Components/FreelancerComponents/AcceptedAlert'
import Loader from '../../../Components/SharedComponents/Loader/Loader'
import { useSearchParams } from 'react-router-dom'
import SimilarJobsOnJobShare from 'src/Components/FreelancerComponents/SimilarJobsOnJobSickers'

export default function JobDetailsFreelancer() {
  const { id } = useParams()
  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [start, setStart] = useState(0)
  const [ref, inView] = useInView({ threshold: 0 })

  const [searchParams, setSearchParams] = useSearchParams()
  const isRcmd = searchParams.get('isRcmd')
  const { updateTrackingData } = useFreelancerTracking()

  const freelancer = useSubscription(freelancerStore).state
  const user = useSubscription(userStore).state
  useEffect(() => {
    setLoading(true)
    getJob(id)
      .then(res => {
        console.log('load job, ', id)
        setJobData(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (inView) {
      console.log('inView', inView, ref)
      setStart(performance.now())
    }
    return () => {
      console.log('out', (performance.now() - start) / 1000)
      const event = isRcmd === 'true' ? ETrackingEvent.APPLY : ETrackingEvent.JOB_VIEW
      updateTrackingData(ETrackingType.JOBS, id, event, jobData?.title, start)
      jobData?.categories?.map(c => updateTrackingData(ETrackingType.CATEGORIES, c?._id, event, c?.name, start))
      jobData?.reqSkills?.map(s =>
        updateTrackingData(ETrackingType.SKILLS, s?.skill?._id, event, s?.skill?.name + '/' + s?.skill?.name_vi, start)
      )
    }
  }, [id])

  const { t } = useTranslation(['main'])

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
          <Loader />{' '}
        </div>
      ) : (
        <>
          {jobData !== null ? (
            <div ref={ref} className="container-md container-fluid-sm my-lg-5 my-sm-4 py-xs-5 px-md-5">
              <div className="d-lg-block">
                <div className="row my-lg-4 px-0 mx-0 d-lg-block d-none py-xs-5 py-2">
                  {freelancer.isProfileVerified === false && <AcceptedAlert widthh="100%" />}
                  <h3 className="mt-4">{t('Job details')}</h3>
                </div>
                <div className="row">
                  <JobDescriptionJobDetails job={jobData} />
                  <RightSidebarJobDetails job={jobData} freelancer={freelancer} />
                </div>
              </div>
              <div className="row me-md-1">
                <div className="col-lg-12 col-xs-12">
                  {/* <ClientRecentHistory /> */}
                  <OtherOpenJobsByThisClient client={jobData?.client} />
                  <SimilarJobsOnJobShare id={jobData?._id} />
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
              <NotFound />
            </div>
          )}
        </>
      )}
    </>
  )
}
