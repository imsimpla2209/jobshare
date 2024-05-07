
import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Upload, UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkFileFunc } from "src/Components/CommonComponents/upload/upload";
import { useSubscription } from "src/libs/global-state-hook";
import { EStep, profileStepStore, userData } from "src/pages/FreelancerPages/CreateProfile";
import { getBase64 } from "src/utils/helperFuncs";

export default function CreateProfilePhoto() {
	const profileStep = useSubscription(profileStepStore).setState
	const { setState: setUser, state: user } = useSubscription(userData);
	const [files, setFiles] = useState(null)
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const handleCancel = () => setPreviewOpen(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user?.avatar) {
			setFiles(user?.avatar)
		}
	}, [])

	const addData = async () => {
		setLoading(true);
		try {
			setUser({ ...user, avatar: files })
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
		profileStep({ step: EStep.LOCATION })
	}
	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile);
		}
		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	}

	return (
	<section className="bg-white border rounded mt-3 pt-4">
		<div className="border-bottom ps-4 pb-3">
			<h4>Profile Photo</h4>
		</div>
		<div className="px-4 my-4" style={{ width: "100%", display: 'flex', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>
			<p>
				Please upload a professional portrait that clearly shows your face.{" "}
				<Link to="">
					<i className="fas fa-info-circle"></i>
				</Link>
			</p>
		</div>
		<div

		>
			<Upload
				name="avatar"
				listType="picture-card"
				className="avatar-uploader ms-5"
				defaultFileList={files ? [files] : []}
				onPreview={handlePreview}
				accept="image/*"
				beforeUpload={file => {
					const checkedFile = checkFileFunc(file);
					console.log('checkedFile', checkedFile)
					if (checkedFile) {
						setFiles([file])
					}
					return false
				}}
				maxCount={1}
			>
				<div>
					<PlusOutlined />
					<div style={{ marginTop: 8 }}>Upload</div>
				</div>
			</Upload>
			<Modal open={previewOpen} title={'Avatar'} footer={null} onCancel={handleCancel}>
				<img alt="example" style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</div>
		<div className="px-4 my-3 pt-4 border-top d-flex justify-content-between">
			<button className="btn border me-4 px-5 fw-bold" onClick={() => profileStep({ step: EStep.TITLEANDOVERVIEW })}>
				Back
			</button>
			<Button loading={loading} className={`btn bg-jobsicker px-5 ${!files && "disabled"}`} onClick={() => {
				addData()
			}}>
				Next
			</Button>
		</div>
	</section>
);
}
