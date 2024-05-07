/* eslint-disable react-hooks/exhaustive-deps */
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import {
  ETrackingEvent,
  ITrackingData,
  freelancerTrackingCategoriesStore,
  freelancerTrackingJobsStore,
  freelancerTrackingLocationsStore,
  freelancerTrackingSkillsStore,
} from 'src/Store/tracking.store'
import { updateFreelancerTracking } from 'src/api/freelancer-apis'
import { createSubscription, useSubscription } from 'src/libs/global-state-hook'

let timer = 60000

export enum ETrackingType {
  CATEGORIES = 'categories',
  SKILLS = 'skills',
  JOBS = 'jobs',
  LOCATIONS = 'locations',
}

export enum RenderTypes {
  ContinueBrowsing = 'Continue_browsing',
  SkillsRecommendation = 'Skills_Rcmd',
  CategoriesRecommendation = 'Categories_Rcmd',
  JobsRelatedToTopInterestJobs = 'Jobs_related_to_top_interest_jobs',
  JobsRelatedToCurrentInterestJobs = 'Jobs_related_to_current_interest_jobs',
  JobsRelatedToInterests = 'job_related_to_most_categories_skills_interests',
  JobsRelatedToCurrentSkillsCategories = 'Job_related_to_current_interested_skills_cats',
  RecommendedClients = 'Clients_Rcmd',
  FavoriteJobs = 'Favorite_Jobs',
}

export const renderTypesStore = createSubscription<RenderTypes[]>([])

export const useFreelancerTracking = () => {
  const { state: trackingJobs, setState: setTrackingJobs } = useSubscription(freelancerTrackingJobsStore)
  const { state: trackingSkills, setState: setTrackingSkills } = useSubscription(freelancerTrackingSkillsStore)
  const { state: trackingCategories, setState: setTrackingCategories } = useSubscription(
    freelancerTrackingCategoriesStore
  )
  const { state: trackingLocations, setState: setTrackingLocations } = useSubscription(freelancerTrackingLocationsStore)
  const [refresh, onRefresh] = useState(false)
  const { state: renderTypes, setState: setRenderTypes } = useSubscription(renderTypesStore)

  const updateTrackingData = useCallback(
    (type: ETrackingType, id: string, event: ETrackingEvent | number, text: any, start: number) => {
      let store: Record<string, ITrackingData>, setter: any
      console.log('updateTrackingData')
      switch (type) {
        case ETrackingType.JOBS:
          store = trackingJobs
          setter = setTrackingJobs
          break
        case ETrackingType.SKILLS:
          store = trackingSkills
          setter = setTrackingSkills
          break
        case ETrackingType.CATEGORIES:
          store = trackingCategories
          setter = setTrackingCategories
          break
        case ETrackingType.LOCATIONS:
          store = trackingLocations
          setter = setTrackingLocations
          break
        default:
          break
      }

      onRefresh(!refresh)

      const updatedData = { ...store }
      const target = updatedData[id]

      const viewCount = target?.event?.[event]?.viewCount || 0
      const totalTimeView = target?.event?.[event]?.totalTimeView || 0

      const newTrackingEvent = {
        viewCount: viewCount + 1,
        totalTimeView: totalTimeView + (performance.now() - start) / 1000,
      }

      const updatedEvent = {
        ...target?.event,
        [event]: newTrackingEvent,
      }

      updatedData[id] = {
        event: updatedEvent,
        text,
        lastTimeView: new Date().getTime().toString(),
        id,
      }

      setter(updatedData)
    },
    [trackingCategories, trackingJobs, trackingLocations, trackingSkills]
  )

  const loadTrackingData = useCallback((data: any) => {
    if (!data) return
    console.log('Load tracking data', data)
    const { jobs, skills, categories, locations } = data || {}

    const loadIntoGlobalState = (store, typeData) => {
      const updatedStore = { ...(store || {}) }

      typeData.forEach(item => {
        if (item) {
          updatedStore[item?.id] = {
            event: item?.event,
            text: item?.text,
            lastTimeView: item?.lastTimeView,
            id: item?.id,
          }
        }
      })

      return updatedStore
    }

    setTrackingJobs(loadIntoGlobalState(trackingJobs, jobs || []))
    setTrackingSkills(loadIntoGlobalState(trackingSkills, skills || []))
    setTrackingCategories(loadIntoGlobalState(trackingCategories, categories || []))
    setTrackingLocations(loadIntoGlobalState(trackingLocations, locations || []))
  }, [])

  const updateTrackingforJob = useCallback(
    (job: any, event: ETrackingEvent, start) => {
      updateTrackingData(ETrackingType.JOBS, job?._id || job?.id, ETrackingEvent.JOB_VIEW, job?.title, start)
      job?.categories?.map(c =>
        updateTrackingData(ETrackingType.CATEGORIES, c?._id, ETrackingEvent.JOB_VIEW, c?.name, start)
      )
      job?.reqSkills?.map(s =>
        updateTrackingData(
          ETrackingType.SKILLS,
          s?.skill?._id,
          ETrackingEvent.JOB_VIEW,
          s?.skill?.name + '/' + s?.skill?.name_vi,
          start
        )
      )
    },
    [trackingCategories, trackingJobs, trackingSkills]
  )

  useEffect(() => {
    console.log('trackingData', trackingCategories, trackingJobs, trackingSkills)
  }, [trackingCategories, trackingJobs, trackingSkills])

  // useEffect(() => {
  //   const i = setTimeout(() => {
  //     syncTrackingDataToBackend()
  //   }, timer)

  //   return () => {
  //     clearTimeout(i)
  //   }
  // }, [refresh])

  const determineRenderType = useCallback(
    data => {
      if (!data || !data?.length || isEmpty(data)) {
        return
      }
      const weights = {
        Continue_browsing: { viewCount: 1.2, timeView: 1.7 },
        Skills_Rcmd: { viewCount: 1.4, timeView: 1.4 },
        Categories_Rcmd: { viewCount: 1.4, timeView: 1.3 },
        Jobs_related_to_top_interest_jobs: { viewCount: 1.3, timeView: 1.5 },
        Jobs_related_to_current_interest_jobs: { viewCount: 1, timeView: 1.4 },
        job_related_to_most_categories_skills_interests: { viewCount: 1.5, timeView: 1.2 },
        Job_related_to_current_interested_skills_cats: { viewCount: 1.4, timeView: 1 },
        Clients_Rcmd: { viewCount: 2, timeView: 2 },
      }

      const scores = {
        Continue_browsing:
          data[0]?.eventData[1]?.eventData?.totalViewCount * weights?.Continue_browsing?.viewCount +
          data[0]?.eventData[1]?.eventData?.totalTotalTimeView * weights?.Continue_browsing?.timeView,
        Skills_Rcmd:
          data[2]?.eventData[1]?.eventData?.totalViewCount * weights?.Skills_Rcmd?.viewCount +
          data[2]?.eventData[1]?.eventData?.totalTotalTimeView * weights?.Skills_Rcmd?.timeView,
        Categories_Rcmd:
          data[3]?.eventData[0]?.eventData?.totalViewCount * weights?.Categories_Rcmd?.viewCount +
          data[3]?.eventData[0]?.eventData?.totalTotalTimeView * weights?.Categories_Rcmd?.timeView,
        Jobs_related_to_top_interest_jobs:
          data[1]?.eventData[1]?.eventData?.totalViewCount * weights?.Jobs_related_to_top_interest_jobs?.viewCount +
          data[1]?.eventData[1]?.eventData?.totalTotalTimeView * weights?.Jobs_related_to_top_interest_jobs?.timeView,
        Jobs_related_to_current_interest_jobs:
          data[1]?.eventData[0]?.eventData?.totalViewCount * weights?.Jobs_related_to_current_interest_jobs?.viewCount +
          data[1]?.eventData[0]?.eventData?.totalTotalTimeView *
            weights?.Jobs_related_to_current_interest_jobs?.timeView,
        job_related_to_most_categories_skills_interests:
          data[1]?.eventData[3]?.eventData?.totalViewCount *
            weights?.job_related_to_most_categories_skills_interests?.viewCount +
          data[1]?.eventData[3]?.eventData?.totalTotalTimeView *
            weights?.job_related_to_most_categories_skills_interests?.timeView,
        Job_related_to_current_interested_skills_cats:
          data[2]?.eventData[2]?.eventData?.totalViewCount *
            weights?.Job_related_to_current_interested_skills_cats?.viewCount +
          data[2]?.eventData[2]?.eventData?.totalTotalTimeView *
            weights?.Job_related_to_current_interested_skills_cats?.timeView,
        Clients_Rcmd:
          100000000000000,
        // data[0]?.eventData[0]?.eventData?.totalViewCount * weights?.Clients_Rcmd?.viewCount +
        // data[0]?.eventData[0]?.eventData?.totalTotalTimeView * weights?.Clients_Rcmd.timeView,
      }

      const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1])

      const topRenderTypes = sortedScores.slice(0, 3).map(item => item[0])

      console.log(sortedScores)
      setRenderTypes(topRenderTypes)
      return topRenderTypes
    },
    [trackingCategories, trackingJobs, trackingLocations, trackingSkills]
  )

  return {
    trackingJobs,
    trackingSkills,
    trackingCategories,
    trackingLocations,
    updateTrackingData,
    loadTrackingData,
    determineRenderType,
    updateTrackingforJob,
  }
}
