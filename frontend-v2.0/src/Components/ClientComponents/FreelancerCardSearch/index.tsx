
import { fakeClientState, fakeFreelancerState } from "Store/fake-state";
import { useEffect } from "react";
import ShowMore from 'react-show-more-button/dist/module';
import { updateUserData } from "../../../Network/Network";
import ImgWithActiveStatus from "../ImgWithActiveStatus";


export default function FreelancerCardSearch() {
  const user = fakeFreelancerState;
  const client = fakeClientState;

  useEffect(() => {
  }, [client]);

  const saveFreelancer = (e, id) => {
    if (e.target.className === 'far fa-heart') {
      // (client.savedFreelancers === undefined)?updateUserData("client", { savedFreelancers: [client?.savedFreelancers, id] }):
      updateUserData("client", { savedFreelancers: [...client?.savedFreelancers, id] });
      e.target.className = 'fas fa-heart text-jobsicker'
      console.log("add")
    }
    else {
      client?.savedFreelancers?.forEach((fakeFreelancerState, index) => {
        if (fakeFreelancerState === id) {
          console.log("delete")
          client?.savedFreelancers?.splice(index, 1);
          updateUserData("client", { savedFreelancers: [...client?.savedFreelancers] });
          e.target.className = 'far fa-heart'
        }
      })
    }
  }

  return (
    <div>
      {/* will be multiple data here */}
      <div className="row border bg-white border-1">
        <div className="col-1 pt-lg-3">
          <ImgWithActiveStatus avatar={undefined} />
        </div>
        <div className="col-lg-6 pt-lg-3 ">
          <a
            href="#"
            id="job-title-home-page "
            className="link-dark job-title-hover "
          >
            <p className="fw-bold text-success">{fakeFreelancerState.firstName} {"  "} {fakeFreelancerState.lastName}</p>
          </a>
          <a id="job-title-home-page " className="link-dark">
            <p className="fw-bold ">{fakeFreelancerState.title}</p>
          </a>
          <span className="text-muted">{fakeFreelancerState.location?.country}</span>
          <div className="row py-3">
            <div className="col">
              <span className="fw-bold">${fakeFreelancerState.hourlyRate}</span>
              <span className="text-muted"> /hr</span>
            </div>
            <div className="col">
              <span className="fw-bold">${fakeFreelancerState.totalEarnings}</span> +{" "}
              <span className="text-muted"> earned</span>
            </div>
            <div className="col">
              <span>
                {" "}
                <svg
                  width="15px"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                  role="img"
                >
                  <polygon
                    points="7 0 0 0 0 9.21 7 14 14 9.21 14 0 7 0"
                    fill="#1caf9d"
                  />
                </svg>
              </span>
              <span className="text-primary"> {fakeFreelancerState?.badge?.risingFreelancer}</span>
            </div>
            <div className="col progress " style={{ width: 50, height: 10, display: "inline", float: "left" }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${fakeFreelancerState.profileCompletion}%` }}
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={80}
              >
                <div style={{ fontSize: "0.7em", display: "start" }}>
                  {`${fakeFreelancerState.profileCompletion}%`}
                </div>
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
              <i onClick={(e) => saveFreelancer(e, fakeFreelancerState.authID)} className={`${client?.savedFreelancers?.includes(fakeFreelancerState.authID) ? 'fas fa-heart text-jobsicker' : 'far fa-heart'}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="col py-3">
          <button type="button" className="btn bg-jobsicker px-3">
            invite to job
          </button>
        </div>

        <div className="col-lg-1 pt-lg-3"></div>
        <div className="col-lg-10 pt-lg-3 mx-3">

        </div>
        <ShowMore className="" maxHeight={100} button={<button id="seemorebutton" className="advanced-search-link " style={{ color: 'green', position: 'absolute', left: 0 }}>
          more
        </button>}>
          {fakeFreelancerState.overview}

        </ShowMore>
        <div className="d-flex justify-content-start">
          {fakeFreelancerState.skills?.map((e, ix) =>
            <div className="chip mb-3 ms" key={ix}>
              <span>{e}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
