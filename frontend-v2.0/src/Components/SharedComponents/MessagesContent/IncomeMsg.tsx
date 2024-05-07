/* eslint-disable jsx-a11y/iframe-has-title */
import { timeAgo } from 'src/utils/helperFuncs'
import img from '../../../assets/img/icon-user.svg'
import { useTranslation } from 'react-i18next'
import { EMessageType } from 'src/api/constants'
import FileDisplay from 'src/pages/ForumPages/ideas/idea-detail/file-display'

export default function IncomeMsg({ msg, avatar }) {
	const { t } = useTranslation(['main'])
	return (
		<div className="incoming_msg">
			<div className="incoming_msg_img">
				<img
					className="fas rounded-circle border fa-user_img"
					src={avatar || img}
					alt="Profile Pic"
				/>
			</div>
			<div className="received_msg" >
				<div className="received_withd_msg" >
					{msg?.type === EMessageType.Attachment && (
						<div className="bg-white py-lg-4 px-4 border border-1 pb-sm-3 py-xs-5">
							{/* <h5 className="fw-bold my-4">Attachments</h5> */}
							<div className="col">
								<FileDisplay files={msg?.attachments}></FileDisplay>
							</div>
						</div>
					)}
					{msg?.type === EMessageType.Embed && (
						<div className="py-lg-4 px-4 border border-1 pb-sm-3 py-xs-5">
							{/* <h5 className="fw-bold my-4">Attachments</h5> */}
							<iframe width="390" height="270" src={msg?.other}>
							</iframe>
						</div>
					)}
					<p>{msg?.content}</p>
					<span className="time_date">{timeAgo(msg?.createdAt, t)}</span>
				</div>
			</div>
		</div>
	)
}
