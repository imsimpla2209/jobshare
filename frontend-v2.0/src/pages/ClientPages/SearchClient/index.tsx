import { fakeClientState } from 'Store/fake-state'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ShowMore from 'react-show-more-button/dist/module'
import { updateUserData } from '../../../Network/Network'
import ImgWithActiveStatus from './../../../Components/ClientComponents/ImgWithActiveStatus'
import { getFreelancers } from 'src/api/freelancer-apis'

export default function FreelancerCardSearch() {
  const client = fakeClientState
  const freelancerArr = []
  const [isliked, setisliked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [listFreelancers, setListFreelancers] = useState([])

  const getAllListJobs = async () => {
    setLoading(true)
    await getFreelancers({ limit: 10, page: page })
      .then(res => {
        setListFreelancers([...listFreelancers, ...res.data])
      })
      .finally(() => setLoading(false))
  }
  console.log('listFreelancers', listFreelancers)

  useEffect(() => {
    getAllListJobs()
  }, [])

  const saveFreelancer = (e, id) => {
    setisliked(!isliked)
    if (e.target.className === 'far fa-heart') {
      updateUserData('client', { savedFreelancer: [...client?.savedFreelancers, id] })
      e.target.className = 'fas fa-heart text-jobsicker'
    } else {
      client?.savedFreelancers?.forEach((item, index) => {
        if (item === id) {
          client?.savedFreelancers?.splice(index, 1)
          updateUserData('client', { savedFreelancer: [...client?.savedFreelancers] })
          e.target.className = 'far fa-heart'
        }
      })
    }
  }
  return (
    <div>
      {freelancerArr.length === 0 ? (
        <div className="col-12 bg-white">
          <h3 className="fw-bold text-center py-2 pt-5 " style={{ color: '#124C82' }}>
            There are no results that match your search
          </h3>

          <h6 className="text-center " style={{ color: '#124C82' }}>
            Please try adjusting your search keywords or filters
          </h6>

          {/* <img className='mx-auto d-block' src={searchSvg} /> */}
        </div>
      ) : null}
      {freelancerArr?.map(item => (
        <div className="row border bg-white border-1 px-3 py-3" key={item.authID}>
          <div className="col-1 pt-lg-3">
            <ImgWithActiveStatus avatar={item?.profilePhoto} />
          </div>
          <div className="col-lg-6 pt-lg-3 ">
            <Link
              to={`/freelancer-profile/${item.authID}`}
              id="job-title-home-page "
              className="link-dark job-title-hover "
            >
              <p className="fw-bold text-success">
                {item.firstName} {'  '} {item.lastName}
              </p>
            </Link>
            <a href="#" id="job-title-home-page " className="link-dark">
              <p className="fw-bold ">{item.title}</p>
            </a>
            <span className="text-muted">{item.location?.country}</span>
            <div className="row py-3">
              <div className="col">
                <span className="fw-bold">${item.hourlyRate}</span>
                <span className="text-muted"> /hr</span>
              </div>
              <div className="col">
                <span className="fw-bold">${item.totalEarnings}</span> + <span className="text-muted"> earned</span>
              </div>
              <div className="col">
                <span>
                  {' '}
                  <svg
                    width="15px"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 14 14"
                    aria-hidden="true"
                    role="img"
                  >
                    <polygon points="7 0 0 0 0 9.21 7 14 14 9.21 14 0 7 0" fill="#1caf9d" />
                  </svg>
                </span>
                <span className="text-primary"> {item.badge?.risingFreelancer}</span>
              </div>
              <div className="col progress " style={{ width: 50, height: 10, display: 'inline', float: 'left' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${item.profileCompletion}%` }}
                  aria-valuenow={100}
                  aria-valuemin={0}
                  aria-valuemax={80}
                >
                  <div style={{ fontSize: '0.7em', display: 'start' }}>{`${item.profileCompletion}%`}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col py-3">
            <div className="btn-group float-end ">
              <button
                type="button"
                className="btn btn-light dropdown-toggle border border-1 rounded-circle collapsed"
                data-toggle="collapse"
                data-target="#collapse"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <i
                  onClick={e => saveFreelancer(e, item.authID)}
                  className={`${
                    client?.savedFreelancers?.includes(item.authID) ? 'fas fa-heart text-jobsicker' : 'far fa-heart'
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* <div className="col py-3">
            <button type="button" className="btn bg-jobsicker px-3">
              invite to job
            </button>
          </div> */}

          <div className="col-lg-1 pt-lg-3"></div>
          <div className="col-lg-10 pt-lg-3 mx-3"></div>
          <div className="row mx-5 px-5">
            <ShowMore
              className=""
              maxHeight={100}
              button={
                <button
                  id="seemorebutton"
                  className="advanced-search-link "
                  style={{ color: 'green', position: 'absolute', left: 0 }}
                >
                  more
                </button>
              }
            >
              {item.overview}
            </ShowMore>
            <div className="d-flex justify-content-start">
              {item.skills?.map((e, ix) => (
                <div className="chip mb-3 ms" key={ix}>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
