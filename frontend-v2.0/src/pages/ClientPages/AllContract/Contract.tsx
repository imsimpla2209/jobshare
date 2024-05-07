
/* eslint-disable react-hooks/exhaustive-deps */
import { fakeClientState, fakeFreelancerState, fakeJobsState } from "Store/fake-state";
import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import ContractFeedback from '../../../Components/FreelancerComponents/ContractFeedback';
import StarsRating from "../../../Components/SharedComponents/StarsRating/StarsRating";
import img from "../../../assets/img/icon-user.svg";
import "../../ClientPages/Freelancer/Freelancer.css";
import Payment from "./Payment";

export default function Contract({ location }) {

	const user = fakeClientState;
	const [data, setData] = useState({ job: {}, freelancer: {}, contract: {} })
	const job = fakeJobsState[0]
	const freelancer = fakeFreelancerState

	useEffect(() => {
		const { freelancer, contract } = location?.state;
		setData({ job, freelancer, contract });
	}, [])

	const { contract } = data;


	return (
		<div className="container my-5 px-5">
			<div className="row bg-white border border-rounded border-1 bg-gray mx-3">
				<div className="row p-5">
					<div className="col-8">
						<h3 className="">{job?.jobTitle}</h3>
						{
							job?.freelancerJobReview[0]?.review &&
							<div>
								<small>
									<i className="fas fa-check-circle text-success"> </i>
									{"  "}Completed Feb 21{"  "}
									<StarsRating clientReview={job?.freelancerJobReview[0]?.review} index={1} />
									<StarsRating clientReview={job?.freelancerJobReview[0]?.review} index={2} />
									<StarsRating clientReview={job?.freelancerJobReview[0]?.review} index={3} />
									<StarsRating clientReview={job?.freelancerJobReview[0]?.review} index={4} />
									<StarsRating clientReview={job?.freelancerJobReview[0]?.review} index={5} />
								</small>
							</div>
						}
					</div>
					<div className="col-4">
						<img style={{ height: "40px", width: "40px" }} className="rounded-circle bg-white" src={freelancer.profilePhoto ? freelancer.profilePhoto : img} alt="" />
						<span className="h4 ms-2">
							{freelancer?.firstName + " " + freelancer?.lastName}
						</span>
						<p className="text-muted text-center">{freelancer?.location?.country}</p>
					</div>
				</div>

				<div className="row px-5">
					<ul className="nav nav-tabs ">
						<li className="nav-item">
							<NavLink
								className={isActive => "nav-link" + (isActive ? "active" : "")}
								to="/contract"
							>
								Payment
							</NavLink>
						</li>
						<li className="nav-item ">
							<NavLink
								className={isActive => "nav-link" + (isActive ? "active" : "")}
								to="/contract/feedback"
							>
								Feedback
							</NavLink>
						</li>
						{
							job?.status !== true &&
							<li className="nav-item ms-3">
								{/* <button
                                    type="button"
                                    className="btn btn-light dropdown-toggle border border-1 rounded-circle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-ellipsis-h " />
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item" onClick={askPayment}>
                                            Ask for pyament
                                        </button>
                                        <button className="dropdown-item" onClick={endContract}>
                                            End contract
                                        </button>
                                    </li>
                                </ul> */}
							</li>
						}
					</ul>
					<Routes>
						<Route path="/contract" >
							<Payment job={job} freelancer={freelancer} clientContract={contract} />
						</Route>
						<Route path="/contract/feedback" >
							<ContractFeedback job={job} />
						</Route>
					</Routes>
				</div>

			</div>

		</div>

	)
}
