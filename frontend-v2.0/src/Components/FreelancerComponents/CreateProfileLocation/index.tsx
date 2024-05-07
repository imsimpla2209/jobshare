import React, { useState } from "react";
import CountrySelect from "react-bootstrap-country-select";
import "react-bootstrap/dist/react-bootstrap";
import "react-bootstrap-country-select/dist/react-bootstrap-country-select.css";
import { useSubscription } from "src/libs/global-state-hook";
import { EStep, profileFreelancerData, profileStepStore } from "src/pages/FreelancerPages/CreateProfile";
import LocationPicker from "src/Components/SharedComponents/LocationPicker";
import { Form } from "antd";
import { useTranslation } from "react-i18next";

export default function CreateProfileLocation() {
  const profileStep = useSubscription(profileStepStore).setState
  const { setState, state } = useSubscription(profileFreelancerData);

  const { t } = useTranslation(['main'])
  const onChangeLocation = (locs: any[]) => {
    setState({ ...state, currentLocations: locs })
  }
  const addData = () => {
    profileStep({ step: EStep.PHONENUMBER })
  };
  return (
    <section className="bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>Location</h4>
      </div>
      <div className="px-4 my-4">
        <p>
          <strong>Where are you based?</strong>
        </p>
        <p>
          We take your privacy very seriously. Only your city and country will
          be shown to clients.
        </p>
        <Form.Item
          name="location"
          label={t("Location")}
          rules={[{ required: true, message: 'Please choose the type' }]}
        >
          <LocationPicker handleChange={onChangeLocation} data={state?.currentLocations}></LocationPicker>
        </Form.Item>
      </div>
      <div className="px-4 my-3 pt-4 border-top d-flex justify-content-between">
        <button className="btn" onClick={() => profileStep({ step: EStep.PROFILEPHOTO })}>
          {t("Back")}
        </button>
        <button className={`btn ${!state?.currentLocations ? "disabled" : ""}`}>
          <button
            className="btn bg-jobsicker px-5"
            onClick={addData}
          >
            {t("Next")}
          </button>
        </button>
      </div>
    </section>
  );
}
