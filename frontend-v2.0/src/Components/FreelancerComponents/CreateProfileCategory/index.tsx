
import { Form } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CategoriesPicker from "src/Components/SharedComponents/CategoriesPicker";
import SkillPicker from "src/Components/SharedComponents/SkillPicker";
import { useSubscription } from "src/libs/global-state-hook";
import { EStep, profileFreelancerData, profileStepStore } from "src/pages/FreelancerPages/CreateProfile";

export default function CreateProfileCategory() {
  const { setState, state } = useSubscription(profileFreelancerData);
  const [skillsList, setskillsList] = useState([]);
  let [cat, setCat] = useState([]);
  const profileStep = useSubscription(profileStepStore).setState

  const { t } = useTranslation(['main']);

  const catVal = (data) => {
    setCat(data);
  };

  useEffect(() => {
    setCat(state.preferJobType?.map(c => c?._id));
    setskillsList(state?.skills?.map(s => { return { skill: s?.skill?._id, level: s.level } }))
  }, [])

  const addData = () => {
    setState({
      ...state, skills: skillsList, preferJobType: cat, profileCompletion: 20,
    })
    profileStep({ step: EStep.EXPERTISELEVEL })
  }

  const addskills = (sk) => {
    setskillsList(sk);
    console.log(skillsList);
  };

  return (
    <section className=" bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>{t("Category")}</h4>
      </div>
      <Form>
        <div className="p-4 my-3">
          <h5 className="fw-bold mb-4">Tell us about the work you do</h5>
          <p className="fw-bold">What is the main service you offer?</p>
          <CategoriesPicker handleChange={catVal} data={state.preferJobType?.map(c => (c?._id || c))}></CategoriesPicker>
          <p className="fw-bold mt-2">{t("Skills and experties")}</p>
          <Form.Item
            name="skills"
            label={t('Skills')}
            rules={[{ required: true, message: 'Please choose the skills' }]}
          >
            <SkillPicker handleChange={addskills} data={state?.skills?.map(s => { return { skill: (s?.skill?._id || s?.skill), level: s.level } })}></SkillPicker>
          </Form.Item>
        </div>
      </Form>
      <div className="px-4 my-3 pt-4 border-top d-flex justify-content-end">
        <button className={`btn bg-jobsicker px-5 ${(!state?.skills?.length && !state?.preferJobType?.length && !cat?.length && !skillsList?.length) ? "disabled" : ""}`
        } onClick={addData}>
          {t("Next")}
        </button>
      </div>
    </section >
  );
}
