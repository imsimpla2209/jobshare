
import { ClockCircleFilled, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ShowMore from 'react-show-more-button/dist/module'
import { locationStore } from 'src/Store/commom.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { EComplexityGet } from 'src/utils/enum'
import { currencyFormatter, randomDate } from 'src/utils/helperFuncs'
import StarsRating from '../../SharedComponents/StarsRating/StarsRating'
import JobProposalsNumber from './JobProposalsNumber'
import { useState } from 'react'
import { updateFreelancer } from 'src/api/freelancer-apis'
import { freelancerStore } from 'src/Store/user.store'

export default function JobCard({ item, freelancer, lang, style }: any) {
  const { t } = useTranslation(['main'])
  const locations = useSubscription(locationStore).state;
  const setState = useSubscription(freelancerStore).setState;
  const [isLiked, setisliked] = useState(false)

  const saveJob = (id) => {
    setisliked(!isLiked)
    if (!freelancer?.favoriteJobs.includes(id)) {
      const favorJob = freelancer?.favoriteJobs || []
      updateFreelancer({
        favoriteJobs: [...favorJob, id]
      }, freelancer?._id).then(() => {
        setState({ ...freelancer, favoriteJobs: [...favorJob, id] })
      })
    }
    else {
      const favorJob = freelancer?.favoriteJobs
      favorJob?.forEach((item, index) => {
        if (item === id) {
          favorJob?.splice(index, 1);
          updateFreelancer({
            favoriteJobs: favorJob || []
          }, freelancer?._id).then(() => {
            setState({ ...freelancer, favoriteJobs: favorJob || [] })
          })
        }
      })
    }
  }

  return (
    <div style={{ borderRadius: 12, marginBottom: 16 }} className="card-job">
      <div className="list-group-item px-4 py-2" style={{ border: '1px solid #ccc', background: "#fffcff" }}>
        <div className="row align-items-center">
          <div className="col-lg-9 pt-lg-2">
            <Link
              to={`/job/${item?._id || item?.id}`}
              className="job-title-link fw-bold"
            >
              {item?.title}
            </Link>
          </div>
          <div className="col-lg-3">
            <div className="btn-group float-sm-end mt-2">
              <button
                type="button"
                className={`btn btn-light dropdown-toggle rounded-circle collapsed`}
                style={{
                  background: freelancer?.favoriteJobs?.includes(item._id || item?.id) ? '#6f00f7' : '#e5d3f5',
                  border: freelancer?.favoriteJobs?.includes(item._id || item?.id) ? '3px solid #4fffc2' : '1px solid #ccc'
                }}
                data-toggle="collapse"
                data-target="#collapse"
                aria-expanded="false"
                aria-controls="collapseTwo"
                onClick={
                  (e) => saveJob(item._id || item?.id)
                }
              >
                {
                  freelancer?.favoriteJobs?.includes(item._id || item?.id) ? <HeartFilled style={{ color: '#59ffc5' }} /> : <HeartOutlined />
                }
              </button>
            </div>
          </div>
        </div>
        <p className="text-muted" style={{ fontSize: "0.8em", lineHeight: 0.5 }}>
          <span><ClockCircleFilled /> </span>
          <span className="fw-bold me-1">{t('posted')}</span>
          <span id="posting-time"> {
            item?.createdAt ? new Date(`${item?.createdAt}`).toLocaleString()
              : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()
          }</span>
        </p>
        <div>
          <p style={{ fontSize: "0.9em", marginBottom: '2px', }}>
            <span className="text-muted">
              <span className="fw-bold me-1" id="contract-type">
                {t(item?.payment?.type)}:
              </span>
              <span className="text-secondary" id="contract-type">
                {currencyFormatter(item?.payment?.amount)} {'/'} {item?.payment?.type}
              </span>
              <span> - </span>
              <span className="fw-bold me-1">
                {t('Complexity')}:
              </span>
              <span id="experience-level">{t(EComplexityGet[item?.scope?.complexity])}</span>
              <span> - </span>
              <span className="fw-bold me-1">{t("Est. Budget")}</span>
              <span id="client-budget">{currencyFormatter(item?.budget)}</span>
            </span>
          </p>
        </div>

        <div style={{ marginBottom: 4 }}>
          <ShowMore
            maxHeight={100}
            button={
              <button
                id="seemorebutton"
                className="advanced-search-link "
                style={{ color: "green", position: "absolute", left: 0 }}
              >
                more
              </button>
            }
          >
            <span className="text-muted fw-bold me-1" style={{ fontSize: "0.9em" }}>{t('Description')}:</span>
            <span style={{ fontSize: "1em" }}>{item?.description}</span>
          </ShowMore>
        </div>

        <Space size="small" wrap>
          <div className='fw-bold me-1 text-muted' style={{ fontSize: "0.9em" }}>{t("Categories") + ":"}</div>
          {item?.categories?.map((c, index) => (
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
        </Space>

        {/* <Space size="small">
          {item?.reqSkills?.map((skill, index) => (
            <div key={index}>
              <button
                key={index}
                type="button"
                className="btn text-light btn-sm rounded-pill skills mx-1 my-1"
                style={{ backgroundColor: "#9b9d9f" }}
              >
                {pickName(skill?.skill, lang)}
              </button>
            </div>
          ))}
        </Space> */}

        <p style={{ fontSize: "0.9em" }} className="my-lg-1 fw-bold me-1 text-muted">
          <span className="text-muted">
            <span>Proposals: </span>
            <span className="fw-bold " id="proposals-numbers">
              <JobProposalsNumber jobID={item?.proposals?.length || 0} />
            </span>
          </span>
        </p>
        <div style={{ fontSize: "0.85em" }} className="my-lg-1 mb-lg-2">
          <span className="fw-bold" style={{ color: item?.client?.paymentVerified ? "#14bff4" : "red" }}>
            <i
              className={`${item?.client?.paymentVerified ? "fas fa-check-circle" : "far fa-times-circle"} me-1`}
              style={{ color: item?.client?.paymentVerified ? "#14bff4" : "red" }}
            />
            {item?.client?.paymentVerified ? t("PaymentVerified") : t("Paymentunverified")}
          </span>
          <span className="text-muted">
            <span className="mx-2">
              <StarsRating clientReview={item?.client?.rating} index={1} />
              <StarsRating clientReview={item?.client?.rating} index={2} />
              <StarsRating clientReview={item?.client?.rating} index={3} />
              <StarsRating clientReview={item?.client?.rating} index={4} />
              <StarsRating clientReview={item?.client?.rating} index={5} />
            </span>
            <span className="fw-bold "> {currencyFormatter(item?.client?.spent || 0)} </span>
            <span> {t("spent")} </span>
            <span className="fw-bold text-muted" style={{ display: 'flex', marginTop: 2 }}>
              <i className="fas fa-map-marker-alt" />
              {
                item?.preferences?.locations?.filter(l=>locations?.find(s => s.code === l.toString())).map(l => (
                  <span key={l} style={{ marginLeft: 8 }}>
                    {locations?.find(s => s.code === l.toString())?.name} |
                  </span>
                ))
              }
            </span>
          </span>
        </div>
      </div>

    </div>
  )
}
