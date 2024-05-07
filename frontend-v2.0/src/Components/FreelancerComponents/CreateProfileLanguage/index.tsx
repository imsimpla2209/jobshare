/* eslint-disable no-mixed-operators */
import { useState } from "react";
import { useSubscription } from "src/libs/global-state-hook";
import { EStep, profileFreelancerData, profileStepStore } from "src/pages/FreelancerPages/CreateProfile";
import AddLanguage from "../AddLanguage";
import NewLang from "../NewLang";
import { useTranslation } from "react-i18next";

export default function CreateProfileLanguage() {
  const profileStep = useSubscription(profileStepStore).setState
  const { t } = useTranslation(['main'])
  const { setState, state } = useSubscription(profileFreelancerData);
  const [language, setLanguage] = useState(state?.englishProficiency || "");
  const [addlang, setaddlang] = useState(false);
  const [languagesList, setlanguagesList] = useState(state?.otherLanguages?.length ? state?.otherLanguages : []);

  const toggleAddLang = () => {
    setaddlang(!addlang);
  };

  const lang = ({ target }) => {
    setLanguage(target.value);
  };

  const updateUser = () => {
    setState({ ...state,
      englishProficiency: language,
      otherLanguages: languagesList,
      profileCompletion: 50,
    });
    console.log(language);
    console.log(languagesList);
    profileStep({ step: EStep.HOURLYRATE })
  };

  const addlangToList = newLang => {
    languagesList.push(newLang);
    setlanguagesList([...languagesList]);
  };

  const deleteLang = index => setlanguagesList(
    languagesList.filter(ele => languagesList.indexOf(ele) !== index)
  );

  return (
    <section className=" bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>{t("Languages")}</h4>
      </div>
      <div className="p-4 my-3">
        <p className="fw-bold">What is your English proficiency/Trình độ tiếng anh? <span className="text-danger">*</span></p>
        <select
          className="form-select form-select-lg mb-3 shadow-none w-50"
          aria-label=".form-select-lg example"
          defaultValue={language}
          onChange={lang}
        >
          <option value="English proficiency">English proficiency</option>
          <option value="Basic/Cơ bản">Basic/Cơ bản</option>
          <option value="Conversational/Giao tiếp">Conversational/Giao tiếp</option>
          <option value="Fluent/Thông thạo">Fluent/Thông thạo</option>
          <option value="Native/Như bản địa">Native/Như bản địa</option>
          <option value="None/Chả biết gì">None/Chả biết gì</option>
        </select>
        {addlang ? (
          <NewLang
            toggleAddLang={toggleAddLang}
            addlangToList={addlangToList}
          />
        ) : (
          <AddLanguage
            toggleAddLang={toggleAddLang}
            languagesList={languagesList}
            deleteLang={deleteLang}
          />
        )}
      </div>
      <div className="px-4 my-3 pt-4 border-top d-flex justify-content-between">
        <button className="btn" onClick={() => profileStep({ step: EStep.EDUANDEMP })
        }>
          {t("Back")}
        </button>
        <button className={`btn ${language === "" || language === "English proficiency" ? "disabled" : ""}`}>
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
