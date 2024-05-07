
export default function Payment({ job, freelancer, clientContract }) {
	console.log(clientContract);

	const pay = () => {

		// db.collection("freelancer")
		//     .doc(freelancer.authID)
		//     .collection("notification").add({
		//         time: new Date(),
		//         message: `Your payment request for "${job?.jobTitle}" is approved.`,
		//         type: "Payment approved",
		//         userID: freelancer.authID,
		//         userName: freelancer.firstName,
		//         userPhoto: freelancer?.profilePhoto,
		//         isShow: false,
		//         route: "/all-contract",
		//         jobID: job?.jobID
		//     })

		// db.collection("freelancer")
		//     .doc(freelancer?.authID).get().then(doc => {
		//         const res = doc.data()?.totalEarnings + clientContract.jobBudget;
		//         db.collection("freelancer")
		//             .doc(freelancer?.authID)
		//             .update({ totalEarnings: res })
		//     })

	}
	const end = () => {
		// db.collection("job").doc(job?.jobID).update({ status: "closed" })

		// db.collection("freelancer")
		//     .doc(freelancer?.authID)
		//     .collection("jobProposal")
		//     .where("jobId", "==", job?.jobID)
		//     .get().then(res => {
		//         db.collection("freelancer")
		//             .doc(freelancer?.authID)
		//             .collection("jobProposal")
		//             .doc(res.docs[0]?.id).update({ status: "closed", endContractTime: new Date() })
		//     })

		// db.collection("client")
		//     .doc(clientContract?.clientID)
		//     .collection("contracts")
		//     .where("jobID", "==", job?.jobID)
		//     .get().then(res => {
		//         db.collection("client")
		//             .doc(clientContract?.clientID)
		//             .collection("contracts")
		//             .doc(res.docs[0].data().id).update({ endContractTime: new Date() })
		//     })
	}
	return (
		<div className=" pt-4 pb-5 ps-4 mt-3">
			<div className="row">
				<div className="col">
					<h6>Budget</h6>
					<h4>${clientContract?.jobBudget}</h4>
				</div>
				<div className="col">
					<button className="btn bg-jobsicker me-2" onClick={pay}>Pay for freelancer</button>
					<button className="btn btn-danger ms-2" onClick={end}>End contract</button>
				</div>
			</div>

		</div>
	)
}
