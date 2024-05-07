import React from 'react'
import { Link } from 'react-router-dom'
import img from "../../assets/img/notifyicon.png";
import { useTranslation } from 'react-i18next';
import { pickName, timeAgo } from 'src/utils/helperFuncs';
import { Button, Popconfirm } from 'antd';
import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
// import { auth, db } from '../../firebase';


export default function NotificationCard({ notification, collectionName, getNotifications, remove }) {
	const { t, i18n } = useTranslation(['main'])
	const lang = i18n.language

	const updateShow = () => {
		// db.collection(collectionName)
		//     .doc(auth.currentUser.uid)
		//     .collection("notification")
		//     .doc(docID).update({ isShow: true })
	}


	return (
		<div className="border border-1 py-4 px-2" style={{
			backgroundColor: !notification.isDeleted ? "white" : "#e1f5b1",
			display: 'flex',
			justifyContent: 'space-around',
			alignItems: 'center',
			alignContent: 'center',
		}}>
			<div className="col-1">
				<img style={{ height: "40px", width: "40px" }} className="rounded-circle bg-white" src={notification?.image ? notification?.image : img} alt="" />
			</div>
			<p className="col-3">{timeAgo(notification?.createdAt, t)}</p>
			{/* <p className="col-2">{data?.type}</p> */}
			<Link style={{ display: "contents" }}
				to={notification?.path}
				onClick={updateShow}
			>
				<p className="col-5">
					{pickName(notification?.content, lang)}
				</p>
			</Link>
			<div className="col-1" style={{ cursor: "pointer" }} onClick={remove}>
				<Popconfirm
					title="Delete this notification"
					description="Are you sure?"
					onConfirm={() => remove(notification?._id)}
					icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
				>
					<Button icon={<DeleteFilled />} danger></Button>
				</Popconfirm>
			</div>
		</div>
	)
}
