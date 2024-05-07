import { Form, Select } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubscription } from "src/libs/global-state-hook";
import { EStep, profileFreelancerData, profileStepStore } from "src/pages/FreelancerPages/CreateProfile";

export default function CreateProfileEducationAndEmployment() {
  const profileStep = useSubscription(profileStepStore).setState
  const { setState, state } = useSubscription(profileFreelancerData);

  const { t } = useTranslation(['main']);

  const [user, setuser] = useState({
    education: { 
      school: state?.education?.school || "", 
      areaOfStudy: state?.education?.areaOfStudy || "", 
      degree: state?.education?.degree || "", 
      gradYear: state?.education?.gradYear || "" },
    job: [{ jobName: state?.historyWork?.at(0)?.jobName ?? "", jobTitle: state?.historyWork?.at(0)?.jobTitle ?? "", stillWork: state?.historyWork?.at(0)?.stillWork ?? false }],
    profileCompletion: 40,
  });

  const onChangeVal = (e) => {
    setuser({ ...user, education: { ...user.education, degree: e } });
  }

  const getUserData = (e) => {
    const val = e?.target?.value;
    const name = e?.target?.name;
    switch (name) {
      case "school":
        setuser({ ...user, education: { ...user.education, school: val } });
        break;
      case "area":
        setuser({ ...user, education: { ...user.education, areaOfStudy: val } });
        break;
      case "degree":
        setuser({ ...user, education: { ...user.education, degree: e } });
        break;
      case "year":
        console.log(val);
        setuser({ ...user, education: { ...user.education, gradYear: val } });
        break;
      case "job":
        setuser({ ...user, job: [{ ...user.job[0], jobName: val }] });
        break;
      case "title":
        setuser({ ...user, job: [{ ...user.job[0], jobTitle: val }] });
        break;
      case "stillwork":
        setuser({
          ...user,
          job: [{ ...user.job[0], stillWork: e.target.checked }],
        });
        break;
      default:
        break;
    }
  };

  const updateUser = () => {
    console.log(user);
    setState({ ...state, education: user.education, historyWork: user.job });
    profileStep({ step: EStep.LANGUAGE })
  };

  return (
    <section className="bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>{t("Education")} & {t("Employment history")}</h4>
      </div>
      <div className="px-4 my-4">
        <div>
          <p className="fw-bold">{t("Education")}</p>
          <label className="w-100">
            School
            <input
              defaultValue={user?.education?.school}
              className="form-control shadow-none"
              name="school"
              placeholder="E.g: Greenwich University or Cau Giay High School"
              onInput={getUserData}
            />
          </label>
          <label className="w-100 my-2">
            Area of study
            <input
              defaultValue={user?.education?.areaOfStudy}
              className="form-control shadow-none"
              name="area"
              placeholder="E.g: IT"
              onInput={getUserData}
            />
          </label>
          <label className="w-100">
            Degree
            <Form.Item name="degree" >
              <Select defaultValue={user?.education?.degree} size="large" placeholder="E.g: Bachelor of commerce or high-school graduation" onChange={(e) => onChangeVal(e)}>
                <Select.Option value="Bachelour/Cử nhân đại học">Bachelour/Cử nhân đại học</Select.Option>
                <Select.Option value="M.A/Thạc sĩ">M.A/Thạc sĩ</Select.Option>
                <Select.Option value="PhD/Tiến sĩ">PhD/Tiến sĩ</Select.Option>
                <Select.Option value="College/Cao đẳng">College/Cao đẳng</Select.Option>
                <Select.Option value="High-School/Cấp ba">High-School/Cấp ba</Select.Option>
                <Select.Option value="Middle-School/Cấp hai">Middle-School/Cấp hai</Select.Option>
                <Select.Option value="None/Chưa từng đi học">None/Chưa từng đi học</Select.Option>
              </Select>
            </Form.Item>
          </label>
          <label className="w-100 my-2">
            Graduation year
            <input
              type="date"
              defaultValue={user?.education?.gradYear}
              className="form-control shadow-none"
              name="year"
              onInput={getUserData}
            />
          </label>
        </div>
        <div className="my-4"></div>
        <div>
          <p className="fw-bold">{t("Add your past work experience")}</p>
          <label className="w-100">
            Job
            <input
              defaultValue={user?.job[0]?.jobName}
              className="form-control shadow-none"
              name="job"
              onInput={getUserData}
            />
          </label>
          <label className="w-100 mt-3">
            Title
            <input
              defaultValue={user?.job[0]?.jobTitle}
              className="form-control shadow-none"
              name="title"
              onInput={getUserData}
            />
          </label>
          <label className="mt-3">
            I currently work here?
            <input
              type="checkbox"
              name="stillwork"
              defaultChecked={user?.job[0]?.stillWork}
              className="form-check shadow-none"
              onChange={getUserData}
            />
          </label>
        </div>
      </div>
      <div className="px-4 my-3 pt-4 border-top d-flex justify-content-between">
        <button className="btn" onClick={() => profileStep({ step: EStep.EXPERTISELEVEL })
        }>
          {t("Back")}
        </button>
        <button className={`btn }`}>
          <button
            className="btn bg-jobsicker px-5"
            onClick={updateUser}
          >
            {t("Next")}
          </button>
        </button>
      </div>
    </section>
  );
}
