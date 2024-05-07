
/* eslint-disable react-hooks/exhaustive-deps */
import { fakeClientState, fakeFreelancerState, fakeJobsState } from "Store/fake-state";
import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useParams } from "react-router-dom";
import ContractEarnings from '../../../Components/FreelancerComponents/ContractEarnings';
import ContractFeedback from '../../../Components/FreelancerComponents/ContractFeedback';
import StarsRating from "../../../Components/SharedComponents/StarsRating/StarsRating";
import img from "../../../assets/img/icon-user.svg";
import "../../ClientPages/Freelancer/Freelancer.css";
import { useSubscription } from "src/libs/global-state-hook";
import { freelancerStore } from "src/Store/user.store";
import { locationStore } from "src/Store/commom.store";
import { getContract } from "src/api/contract-apis";

export default function Contract() {
	const { id } = useParams()
	const freelancer = useSubscription(freelancerStore).state;
	const [data, setData] = useState<any>({})
	const locations = useSubscription(locationStore).state

	useEffect(() => {
		if(id) {
			getContract(id).then((res) => {
				setData(res.data)
			});
		}
	}, [id])

	const askPayment = () => {
		// db.collection("client")
		// 	.doc(client?.authID)
		// 	.collection("notification").add({
		// 		time: firebase.firestore.Timestamp.now(),
		// 		message: `the job finished "${job?.jobTitle}" and he asked for payment.`,
		// 		type: "Payment Request",
		// 		userID: user.authID,
		// 		userName: user.firstName,
		// 		userPhoto: user.profilePhoto,
		// 		isShow: false,
		// 		route: "/all-contracts"
		// 	})
	}

	const endContract = () => {
		// db.collection("job").doc(job?.jobID).update({ status: "closed" })

		// db.collection("freelancer")
		// 	.doc(user?.authID)
		// 	.collection("jobProposal")
		// 	.where("jobId", "==", job?.jobID)
		// 	.get().then(res => {
		// 		db.collection("freelancer")
		// 			.doc(user?.authID)
		// 			.collection("jobProposal")
		// 			.doc(res.docs[0]?.id).update({ status: "closed", endContractTime: firebase.firestore.Timestamp.now() })
		// 	})

		// db.collection("client")
		// 	.doc(clientContract?.clientID)
		// 	.collection("contracts")
		// 	.where("jobID", "==", job?.jobID)
		// 	.get().then(res => {
		// 		db.collection("client")
		// 			.doc(clientContract?.clientID)
		// 			.collection("contracts")
		// 			.doc(res.docs[0].data().id).update({ endContractTime: firebase.firestore.Timestamp.now() })
		// 	})
	}

	return (
		<div className="container my-5 px-5">
			<div className="row bg-white border border-rounded border-1 bg-gray mx-3">
				<div className="row p-5">
					<div className="col-9">
						<h3 className="">{data?.job?.title}</h3>
						{/* {
							data?.job?.review?.at(0)?.review &&
							<div>
								<small>
									<i className="fas fa-check-circle text-success"> </i>
									{"  "}Completed Feb 21{"  "}
									<StarsRating clientReview={data?.job?.review?.at(0)?.review} index={1} />
									<StarsRating clientReview={data?.job?.review?.at(0)?.review} index={2} />
									<StarsRating clientReview={data?.job?.review?.at(0)?.review} index={3} />
									<StarsRating clientReview={data?.job?.review?.at(0)?.review} index={4} />
									<StarsRating clientReview={data?.job?.review?.at(0)?.review} index={5} />
								</small>
							</div>
						} */}
					</div>
					<div className="col-3">
						<img style={{ height: "40px", width: "40px" }} className="circle bg-white" src={img} alt="" />
						<span className="h4 ms-3">
							{data?.client?.name}
						</span>
						<p className="text-muted text-center">{
							data?.client?.preferLocations?.map(l => (
								<span key={l} style={{ marginLeft: 2 }}>
									{locations?.find(s => s.code === l.toString())?.name} |
								</span>
							))
						}</p>
					</div>
				</div>

				<div className="row px-5">
					<ul className="nav nav-tabs ">
						<li className="nav-item">
							<NavLink
								className={isActive => "nav-link" + isActive.isActive ? "active" : ""}

								to="/contract"
							>
								Earnings
							</NavLink>
						</li>
						<li className="nav-item ">
							<NavLink
								className={isActive => "nav-link" + isActive.isActive ? "active" : ""}
								to="/contract/feedback"
							>
								Feedback
							</NavLink>
						</li>
						{
							data?.job?.currentStatus !== false &&
							<li className="nav-item ms-3">
								<button
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
								</ul>
							</li>
						}
					</ul>
					<Routes>
						<Route path="/contract" element={<ContractEarnings job={data?.job} client={data?.client} clientContract={data?.client} />}>

						</Route>
						<Route path="/contract/feedback" element={<ContractFeedback job={data?.job} />
						}>
						</Route>
					</Routes>
				</div>

			</div>

		</div>

	)
}
