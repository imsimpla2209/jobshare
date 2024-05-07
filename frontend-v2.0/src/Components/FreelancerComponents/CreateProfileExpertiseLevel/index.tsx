import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubscription } from "src/libs/global-state-hook";
import { EStep, profileFreelancerData, profileStepStore } from "src/pages/FreelancerPages/CreateProfile";

export default function CreateProfileExpertiseLevel() {
	const profileStep = useSubscription(profileStepStore).setState
  const { setState: setProfile, state: profile } = useSubscription(profileFreelancerData);
  const { t } = useTranslation(['main']);
  const [state, setState] = useState({ available: profile?.available || false, expertiseLevel: profile?.expertiseLevel ||  -1 })

  const onChangeVal = (e) => {
    const val = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "expertise-level":
        setState({ ...state, expertiseLevel: val });
        break;
      case "available":
        setState({ ...state, available: e.target.checked });
        console.log(e.target.checked)
        break;
      default:
        break;
    }
  };

  const addData = () => {
    setProfile({ ...profile, available: state.available, expertiseLevel: state.expertiseLevel, profileCompletion: 30, })
    profileStep({step: EStep.EDUANDEMP})
  }

  return (
    <section className=" bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>{t("Experience Level with online working")}</h4>
      </div>
      <div className="ps-4 my-5">
        <p className="fw-bold mt-5">
          {t("Honestly Clarify your online working experience, which could help you find more suitable jobs with your experience?")}
        </p>
        <div
          className="my-4 mx-4 d-flex btn-grou justify-content-between"
          onChange={onChangeVal}
          aria-label="Basic radio toggle button group"
        >
          <label className="border rounded p-3 text-center w-25">
            <input
              type="radio"
              className="float-end "
              
              name="expertise-level"
              value="0"
              defaultChecked={state.expertiseLevel === 0}
            />
            <h5 className="my-4">{t("Beginer")}</h5>
            <div>I have never worked online</div>
          </label>
          <label className="border rounded p-3 text-center w-25">
            <input
              type="radio"
              className="float-end"
              name="expertise-level"
              value="1"
              defaultChecked={state.expertiseLevel === 1}
            />
            <h5 className="my-4">{t("Junior")}</h5>
            <div>I am relatively new to this field</div>
          </label>
          <label className="border rounded p-3 text-center w-25">
            <input
              type="radio"
              className="float-end"
              name="expertise-level"
              value="2"
              defaultChecked={state.expertiseLevel === 2}
            />
            <h5 className="my-4">{t("Intermediate")}</h5>
            <div>I have substantial experience in this field</div>
          </label>
          <label className="border rounded p-3 text-center w-25">
            <input
              type="radio"
              className="float-end"
              name="expertise-level"
              value="3"
              defaultChecked={state.expertiseLevel === 3}
            />
            <h5 className="my-4">{t("Expert")}</h5>
            <div>I have comprehensive and deep expertise in this field</div>
          </label>
        </div>
      </div>
      <div className="row mx-4 justify-content-start align-items-center">
        <label className="w-50 fw-bold">
          {t("Are you available to work immediately")}
            </label>
        <input
          type="checkbox"
          name="available"
          defaultChecked={state?.available}
          className="w-25 form-check shadow-none"
          onChange={onChangeVal}
        />

      </div>
      <div className="px-4 my-3 pt-4 border-top d-flex justify-content-between">
        <button className="btn border me-4 px-5 fw-bold" onClick={() => profileStep({step: EStep.CATEGORY})}>
            {t("Back")}
        </button>
        <button className={`btn bg-jobsicker px-5 ${state.expertiseLevel === -1 ? "disabled" : ""}`} onClick={addData}>

            {t("Next")}
        </button>
      </div>
    </section>
  );
}
