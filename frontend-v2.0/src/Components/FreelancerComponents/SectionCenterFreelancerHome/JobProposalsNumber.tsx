/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
// import { db } from '../../../firebase'

export default function JobProposalsNumber({ jobID }) {
	const [num, setNum] = useState(0)

	return (
		<span>
			{num}
		</span>
	)
}
