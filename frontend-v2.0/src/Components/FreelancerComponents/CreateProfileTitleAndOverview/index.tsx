import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSubscription } from "src/libs/global-state-hook";
import { EStep, profileFreelancerData, profileStepStore } from "src/pages/FreelancerPages/CreateProfile";

export default function CreateProfileTitleAndOverview() {
  const { setState, state } = useSubscription(profileFreelancerData);
  const [data, setData] = useState({
    title: state?.title || "",
    intro: state?.intro || "",
    profileCompletion: 70,
  });

  const { t } = useTranslation(['main'])

  const profileStep = useSubscription(profileStepStore).setState

  const getData = (e) => {
    const name = e.target.name;
    const val = e.target.value;
    switch (name) {
      case "title":
        setData({ ...data, title: val });
        break;
      case "overview":
        setData({ ...data, intro: val });
        break;
      default:
        break;
    }
  };

  const addData = () => {
    setState({ ...state, title: data?.title, intro: data?.intro })
    profileStep({ step: EStep.PROFILEPHOTO })
  };

  return (
    <section className="bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>{t("Title & Overview")}</h4>
      </div>
      <div className="px-4 my-4">
        <p>
          <Link to="">Learn more</Link> about writing a great profile or{" "}
          <Link to="">browse profiles</Link> in your category.
        </p>

        <div className="my-4"></div>
        <div>
          <label className="w-100">
            <strong>Title</strong>
            <span className="text-danger"> *</span>
            <i className="fas fa-question-circle upw-c-cn ms-3 mb-3"></i>
            <input
              type="text"
              className="form-control shadow-none w-50"
              name="title"
              defaultValue={data.title}
              onInput={getData}
            />
          </label>
          <label className="w-100 mt-3">
            <strong>Professional Overview</strong>
            <span className="text-danger"> *</span>
            <i className="fas fa-question-circle upw-c-cn ms-3 mb-3"></i>
            <textarea
              name="overview"
              rows={7}
              defaultValue={data.intro}
              className="form-control shadow-none"
              placeholder="Highlight your top skills, experience, and interests. This is one of the first things clients will see on your profile."
              onInput={getData}
            ></textarea>
            <p className="text-end">5000 characters left</p>
          </label>
        </div>
      </div>
      <div className="px-4 my-3 pt-4 border-top d-flex justify-content-between">
        <button className="btn" onClick={() => profileStep({ step: EStep.HOURLYRATE })
        }>

          {t("Back")}
        </button>
        <button className={`btn bg-jobsicker px-5 ${data.title === "" || data.intro === "" ? "disabled" : ""}`} onClick={() => addData()}>
          {t("Next")}
        </button>
      </div>
    </section>
  );
}
