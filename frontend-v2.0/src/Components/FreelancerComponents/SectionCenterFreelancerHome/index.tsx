import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Button, Col, Row } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import AliceCarousel from 'react-alice-carousel'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import { EJobFilter, jobLoad, jobsDataStore } from 'src/Store/job.store'
import { getJobs, getRcmdJobs } from 'src/api/job-apis'
import { RenderTypes, renderTypesStore } from 'src/hooks/freelancer-tracking-hook'
import { useSubscription } from 'src/libs/global-state-hook'
import { CarouselJobList } from './CarouselJobList'
import JobItem, { ESize } from './JobItem'
import './SectionCenterFreelancerHome.css'

export default function SectionCenterFreelancerHome({ user }) {
  const { t } = useTranslation(['main'])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const { state: rcmdJobs, setState: setRcmdJobs } = useSubscription(jobsDataStore)
  const jobLoader = useSubscription(jobLoad)

  const { categories, skills, filter, isFirstLoad, page, pageSize } = jobLoader.state

  const [activeRmcdIndex, setActiveRmcdIndex] = useState(0)

  const rcmdCarousel = useRef<AliceCarousel>(null)

  const { state: renderTypes, setState: setRenderTypes } = useSubscription(renderTypesStore)

  const handleGetData = useCallback(
    (p?: number | undefined, ps?: number | undefined) => {
      setLoading(true)
      switch (filter) {
        case EJobFilter.RCMD:
          return
        case EJobFilter.RECENT:
          return getJobs({
            categories,
            skills,
            sortBy: '_id:asc',
            limit: ps || pageSize,
            page: p || page,
          })
        default:
          return getJobs({
            limit: ps || pageSize,
            page: p || page,
            categories,
            skills,
          })
      }
    },
    [filter, pageSize, page, categories, skills]
  )

  useEffect(() => {
    if (renderTypes?.length && user?._id) {
    }
  }, [user?._id, renderTypes])

  useEffect(() => {
    if (isFirstLoad && user?._id) {
      setLoading(true)
      getRcmdJobs(user?._id, {
        limit: 28,
        page: 1,
      })
        .then(res => {
          setRcmdJobs(res.data?.results)
          setTotal(res.data?.totalResults)
        })
        .catch(err => {
          toast.error('something went wrong, ', err)
        })
        .finally(() => {
          setLoading(false)
          jobLoader.setState({ ...jobLoader.state, isFirstLoad: false })
        })
    }
  }, [user?._id, isFirstLoad, jobLoader, rcmdJobs?.length])

  const slideRcmdNext = e => {
    if (activeRmcdIndex < pageSize - 4) {
      console.log('activeRmcdIndex', activeRmcdIndex + 4)
      rcmdCarousel?.current?.slideTo(activeRmcdIndex + 4)
      setActiveRmcdIndex(activeRmcdIndex + 4)
    }
  }

  const slideRcmdPrev = e => {
    if (activeRmcdIndex > 0) {
      console.log('activeRmcdIndex', activeRmcdIndex - 4)
      rcmdCarousel?.current?.slideTo(activeRmcdIndex - 4)
      setActiveRmcdIndex(activeRmcdIndex - 4)
    }
  }

  return (
    <Col className="mb-4 px-lg-3" xs={24} md={18} lg={24}>
      {renderTypes?.includes(RenderTypes.ContinueBrowsing) && (
        <CarouselJobList
          renderType={RenderTypes.ContinueBrowsing}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}

      {user?.favoriteJobs?.length > 0 && (
        <CarouselJobList
          renderType={RenderTypes.FavoriteJobs}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}

      <div
        className="mb-5 mt-5"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 8,
          position: 'relative',
          padding: '4px 12px',
        }}
      >
        <Row style={{ display: 'flex' }}>
          <h4 className="fw-bold py-1" style={{ margin: 0, color: '#454047' }}>
            {t('Best Matches')}
          </h4>
        </Row>
        {!loading ? (
          <Row justify="center" className="mt-1">
            <Col span={24}>
              <AliceCarousel
                autoWidth={false}
                mouseTracking
                activeIndex={activeRmcdIndex}
                items={rcmdJobs?.map(j => (
                  <JobItem key={j._id} data={j} isRcmd={true} t={t} user={user} size={ESize.Medium} />
                ))}
                paddingRight={activeRmcdIndex === pageSize - 4 ? 0 : 50}
                paddingLeft={activeRmcdIndex === pageSize - 4 ? 50 : 0}
                animationDuration={300}
                responsive={responsive}
                disableDotsControls
                disableButtonsControls
                ref={rcmdCarousel}
              />
            </Col>
            <Button
              type="primary"
              style={{
                display: activeRmcdIndex === 0 ? 'none' : 'block',
                position: 'absolute',
                left: -27,
                top: '45%',
                height: 54,
                width: 54,
                paddingRight: 6,
                background: 'white',
                boxShadow: `rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px`,
              }}
              shape="circle"
              size={'large'}
              onClick={e => slideRcmdPrev(e)}
            >
              <CaretLeftOutlined style={{ fontWeight: 700, fontSize: '30px', color: 'gray' }} />
            </Button>
            <Button
              type="primary"
              style={{
                display: activeRmcdIndex === pageSize - 4 ? 'none' : 'block',
                position: 'absolute',
                right: -27,
                top: '45%',
                height: 54,
                width: 54,
                paddingLeft: 6,
                background: 'white',
                boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
              }}
              shape="circle"
              size={'large'}
              onClick={e => slideRcmdNext(e)}
            >
              <CaretRightOutlined style={{ fontWeight: 700, fontSize: '30px', color: 'gray' }} />
            </Button>
          </Row>
        ) : (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
            <Loader />
          </div>
        )}
      </div>

      {renderTypes?.includes(RenderTypes.RecommendedClients) && (
        <CarouselJobList
          renderType={RenderTypes.RecommendedClients}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}

      {renderTypes?.includes(RenderTypes.SkillsRecommendation) && (
        <CarouselJobList
          renderType={RenderTypes.SkillsRecommendation}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}

      {renderTypes?.includes(RenderTypes.CategoriesRecommendation) && (
        <CarouselJobList
          renderType={RenderTypes.CategoriesRecommendation}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}

      {renderTypes?.includes(RenderTypes.JobsRelatedToCurrentInterestJobs) && (
        <CarouselJobList
          renderType={RenderTypes.JobsRelatedToCurrentInterestJobs}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}

      {renderTypes?.includes(RenderTypes.JobsRelatedToCurrentSkillsCategories) && (
        <CarouselJobList
          renderType={RenderTypes.JobsRelatedToCurrentSkillsCategories}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}

      {renderTypes?.includes(RenderTypes.JobsRelatedToInterests) && (
        <CarouselJobList
          renderType={RenderTypes.JobsRelatedToInterests}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}

      {renderTypes?.includes(RenderTypes.JobsRelatedToTopInterestJobs) && (
        <CarouselJobList
          renderType={RenderTypes.JobsRelatedToTopInterestJobs}
          numberCardPerSlice={undefined}
          extraStyle={undefined}
          size={undefined}
          user={user}
        />
      )}
    </Col>
  )
}

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  768: { items: 3 },
  1248: { items: 4 },
}
