import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Row, Col, Button } from 'antd'
import AliceCarousel from 'react-alice-carousel'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import JobItem, { ESize } from './JobItem'
import { useEffect, useRef, useState } from 'react'
import {
  getCurrentInterestJobsByJobs,
  getCurrentInterestJobs,
  getCurrentInterestJobsByTypes,
  getJobsByFav,
} from 'src/api/job-apis'
import { RenderTypes } from 'src/hooks/freelancer-tracking-hook'
import { useTranslation } from 'react-i18next'
import { getRcmdClients } from 'src/api/client-apis'
import { ClientItem } from './ClientItem'

export enum EPrevNext {
  Upper = 'upper',
  Slide = 'slide',
}

function getRenderTypeDetails(renderType: RenderTypes) {
  switch (renderType) {
    case RenderTypes.ContinueBrowsing:
      return {
        api: getCurrentInterestJobsByJobs,
        component: 'ContinueBrowsingComponent',
        text: 'Continue browsing',
        sizeCard: ESize.Small,
        prevNext: EPrevNext.Upper,
        padding: '10px 20px',
        itemsP: 3,
        carouselPadding: 200,
      }
    case RenderTypes.SkillsRecommendation:
      return {
        api: getCurrentInterestJobs,
        component: 'SkillsRcmdComponent',
        text: 'Skills recommendation',
        sizeCard: ESize.Medium,
        prevNext: EPrevNext.Slide,
        padding: '4px 12px',
        itemsP: 4,
        carouselPadding: 50,
      }
    case RenderTypes.CategoriesRecommendation:
      return {
        api: getCurrentInterestJobs,
        component: 'CategoriesRcmdComponent',
        text: 'Categories recommendation',
        sizeCard: ESize.Medium,
        prevNext: EPrevNext.Slide,
        padding: '4px 12px',
        itemsP: 4,
        carouselPadding: 50,
      }
    case RenderTypes.JobsRelatedToTopInterestJobs:
      return {
        api: getCurrentInterestJobs,
        component: 'TopInterestJobsComponent',
        text: 'Top interest jobs',
        sizeCard: ESize.Medium,
        prevNext: EPrevNext.Slide,
        padding: '4px 12px',
        itemsP: 4,
        carouselPadding: 50,
      }
    case RenderTypes.JobsRelatedToCurrentInterestJobs:
      return {
        api: getCurrentInterestJobsByJobs,
        component: 'CurrentInterestJobsComponent',
        text: 'Current interest jobs',
        sizeCard: ESize.Medium,
        prevNext: EPrevNext.Slide,
        padding: '4px 12px',
        itemsP: 4,
        carouselPadding: 50,
      }
    case RenderTypes.JobsRelatedToInterests:
      return {
        api: getCurrentInterestJobs,
        component: 'MostInterestJobsComponent',
        text: 'Most interest jobs',
        sizeCard: ESize.Medium,
        prevNext: EPrevNext.Slide,
        padding: '4px 12px',
        itemsP: 4,
        carouselPadding: 50,
      }
    case RenderTypes.JobsRelatedToCurrentSkillsCategories:
      return {
        api: getCurrentInterestJobsByTypes,
        component: 'CurrentInterestSkillsCatsComponent',
        text: 'Current interest skills & categories',
        sizeCard: ESize.Medium,
        prevNext: EPrevNext.Slide,
        padding: '4px 12px',
        itemsP: 4,
        carouselPadding: 50,
      }
    case RenderTypes.RecommendedClients:
      return {
        api: getRcmdClients,
        component: 'ClientsRcmdComponent',
        text: 'We found some clients may suit your abilities',
        sizeCard: ESize.Medium,
        prevNext: EPrevNext.Slide,
        padding: '4px 12px',
        itemsP: 4,
        carouselPadding: 50,
      }
    case RenderTypes.FavoriteJobs:
      return {
        api: getJobsByFav,
        component: 'ClientsRcmdComponent',
        text: 'Jobs similar to your favorites',
        sizeCard: ESize.Medium,
        prevNext: EPrevNext.Slide,
        padding: '4px 12px',
        itemsP: 4,
        carouselPadding: 50,
      }
  }
}

export const CarouselJobList = ({ renderType, numberCardPerSlice, extraStyle, size, user }) => {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const carouselRef = useRef<AliceCarousel>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [jobs, setJobs] = useState([])
  const { t } = useTranslation(['main'])
  const renderDetails = getRenderTypeDetails(renderType)

  useEffect(() => {
    if (user?._id) {
      setLoading(true)
      console.log('object', renderDetails.api)
      renderDetails
        .api()
        .then(res => {
          setJobs(res.data)
          setTotal(res.data?.length)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [renderType, user._id, user?.id])

  const slideRcmdNext = e => {
    if (activeIndex < total - renderDetails.itemsP) {
      console.log('activeIndex', activeIndex + renderDetails.itemsP)
      carouselRef?.current?.slideTo(activeIndex + renderDetails.itemsP)
      setActiveIndex(activeIndex + renderDetails.itemsP)
    }
  }

  const slideRcmdPrev = e => {
    if (activeIndex > 0) {
      console.log('activeIndex', activeIndex - renderDetails.itemsP)
      carouselRef?.current?.slideTo(activeIndex - renderDetails.itemsP)
      setActiveIndex(activeIndex - renderDetails.itemsP)
    }
  }

  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    768: { items: 3 },
    1248: { items: renderDetails.itemsP },
  }

  return (
    <div
      className="mb-5"
      style={{
        background: renderDetails.sizeCard !== ESize.Small ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        borderRadius: 8,
        position: 'relative',
        padding: renderDetails.padding,
      }}
    >
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4 className="fw-bold py-1" style={{ margin: 0, color: '#454047' }}>
          {t(renderDetails.text)}
        </h4>
        {renderDetails.prevNext === EPrevNext.Upper && (
          <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}>
            <Button
              type="primary"
              disabled={activeIndex === 0}
              style={{
                // display: activeIndex === 0 ? 'none' : 'block',
                marginRight: 10,
                height: 40,
                width: 40,
                paddingRight: 6,
                background: activeIndex === 0 ? '#ccc' : 'white',
                border: 'none',
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
              disabled={activeIndex === total - renderDetails.itemsP}
              style={{
                // display: activeIndex === total - 4 ? 'none' : 'block',
                height: 40,
                width: 40,
                paddingLeft: 6,
                border: 'none',
                background: activeIndex === total - renderDetails.itemsP ? '#ccc' : 'white',
                boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
              }}
              shape="circle"
              size={'large'}
              onClick={e => slideRcmdNext(e)}
            >
              <CaretRightOutlined style={{ fontWeight: 700, fontSize: '30px', color: 'gray' }} />
            </Button>
          </div>
        )}
      </Row>
      {!loading ? (
        <Row justify="center" className="mt-1">
          <Col span={24}>
            <AliceCarousel
              autoWidth={false}
              mouseTracking
              activeIndex={activeIndex}
              items={jobs?.map(j =>
                renderType === RenderTypes?.RecommendedClients ? (
                  <ClientItem clientData={j} isRcmd={true}></ClientItem>
                ) : (
                  <JobItem
                    key={j._id}
                    data={j}
                    isRcmd={false}
                    t={t}
                    user={user}
                    size={renderDetails?.sizeCard || null}
                  />
                )
              )}
              paddingRight={activeIndex === total - renderDetails.itemsP ? 0 : renderDetails.carouselPadding}
              paddingLeft={activeIndex === total - renderDetails.itemsP ? renderDetails.carouselPadding : 0}
              animationDuration={300}
              responsive={responsive}
              disableDotsControls
              disableButtonsControls
              ref={carouselRef}
            />
          </Col>
          {renderDetails.prevNext === EPrevNext.Slide && (
            <>
              <Button
                type="primary"
                style={{
                  display: activeIndex === 0 ? 'none' : 'block',
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
                  display: activeIndex === total - renderDetails.itemsP ? 'none' : 'block',
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
            </>
          )}
        </Row>
      ) : (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
          <Loader />
        </div>
      )}
    </div>
  )
}
