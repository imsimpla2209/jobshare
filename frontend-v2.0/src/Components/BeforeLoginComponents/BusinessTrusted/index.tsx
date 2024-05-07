import React from "react";
import freelancerMainSectionLogoMicrosoftDevIT from "../../../assets/img/talent_main-section-logo-microsoft-Dev-IT.svg";
import freelancerMainSectionLogoAirbnbDevIT from "../../../assets/img/talent_main-section-logo-airbnb-Dev-IT.svg";
import freelancerMainSectionLogoGeDevIT from "../../../assets/img/talent_main-section-logo-ge-Dev-IT.svg";
import freelancerMainSectionLogoAutomaticDevIT from "../../../assets/img/talent_main-section-logo-automatic-Dev-IT.svg";
import freelancerMainSectionLogoBissellDevIT from "../../../assets/img/talent_main-section-logo-bissell-Dev-IT.svg";
import freelancerMainSectionLogoCotyDevIT from "../../../assets/img/talent_main-section-logo-coty-Dev-IT.svg";
import freelancerMainSectionLogoGoDaddyDevIT from "../../../assets/img/talent_main-section-logo-GoDaddy-Dev-IT.svg";

export default function BusinessTrusted() {
  return (
    <div>
      <div
        className="d-flex flex-wrap justify-content-evenly mx-5 my-md-5 mb-5"
        id="trusted-by-ID"
      >
        <div className="col-4 col-lg-2 pe-5 border-end small text-secondary">
          Trusted by 5M+businesses
        </div>
        <div className="col-4 col-lg-2">
          <img
            className="mx-auto d-block"
            src={freelancerMainSectionLogoMicrosoftDevIT}
            alt=""
          />
        </div>
        <div className="col-3 col-lg-1">
          <img
            className="mx-auto d-block"
            src={freelancerMainSectionLogoAirbnbDevIT}
            alt=""
          />
        </div>
        <div className="col-1 col-lg-1">
          <img
            className="mx-auto d-block"
            src={freelancerMainSectionLogoGeDevIT}
            alt=""
          />
        </div>
        <div className="col-5 col-lg-2">
          <img
            className="mx-auto d-block"
            src={freelancerMainSectionLogoAutomaticDevIT}
            alt=""
          />
        </div>
        <div className="col-2 col-lg-1">
          <img
            className="mx-auto d-block"
            src={freelancerMainSectionLogoBissellDevIT}
            alt=""
          />
        </div>
        <div className="col-3 col-lg-1">
          <img
            className="mx-auto d-block"
            src={freelancerMainSectionLogoCotyDevIT}
            alt=""
          />
        </div>
        <div className="col-3 col-lg-1">
          <img
            className="mx-auto d-block"
            src={freelancerMainSectionLogoGoDaddyDevIT}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
