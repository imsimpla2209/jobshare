/* eslint-disable */
import React from "react";
import "./HomeSecondSection.css";
import { useTranslation } from "react-i18next";  

export default function HomeSecondSection() {
  const { i18n, t } = useTranslation(['main']);
    let lang = i18n.language;
  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="text-center">
            <div className="fs-1 mt-4">
              <i className="fas fa-chevron-down scrol-d-icon-cn"></i>
            </div>
            <p className={`my-5 fw-bold ss-p-cn`}>{t("FORCLIENTS")}</p>
            <h2 className="ss-h2-cn">{t("Findfreelanceryourway")}</h2>
            <p className={`my-5 ss-p2-cn`}>
            {t("Developtrustedrelationships")}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <div className="shadow my-4 ss-box-cn position-relative">
              <a className="d-inline-block p-5" href="#">
                <h3>{t("Postajobandhireapro")}</h3>
                <p className={`mb-5 pb-5`}>{t("FreelancerMarketplace")}</p>
                <div className="position-absolute py-3 px-4 fs-2">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </a>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="shadow my-4 ss-box-cn position-relative">
              <a className="d-inline-block p-5" href="#">
                <h3>{t("Browseandbuyprojects")}</h3>
                <p className={`mb-5 pb-5`}>{t("ProjectCatalog")}</p>
                <div className="position-absolute py-3 px-4 fs-2">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </a>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="shadow my-4 ss-box-cn position-relative">
              <a className="d-inline-block p-5" href="#">
                <h3>{t("Letusfindtherightfreelancer")}</h3>
                <p className={`mb-5 pb-5`}>{t("FreelancerScout")}</p>
                <div className="position-absolute py-3 px-4 fs-2">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </a>
            </div>
          </div>
          <p className={`text-center my-3 fw-bold`}>
          {t("Needasolutionforlargeorganizations")}{" "}
            <a href="#" className="text-success">
            {t("EnterpriseSuitehasyoucovered")}
            </a>
          </p>
        </div>
        <div className="row mt-5">
          <div className="col-md-6 col-sm-12">
            <ul>
              <li>
                <a href="#" className="ss-ul-a-cn" style={{ color: "#6f2dc4" }}>
                {t("DevelopmentIT")}
                </a>
              </li>
              <li>
                <a href="#" className="ss-ul-a-cn">
                {t("DesignCreative")}
                </a>
              </li>
              <li>
                <a href="#" className="ss-ul-a-cn">
                {t("SalesMarketing")}
                </a>
              </li>
              <li>
                <a href="#" className="ss-ul-a-cn">
                {t("Writing")}
                </a>
              </li>
              <li>
                <a href="#" className="ss-ul-a-cn">
                {t("CustomerSupport")}
                </a>
              </li>
              <li>
                <a href="#" className="ss-ul-a-cn">
                {t("Accounting")}
                </a>
              </li>
              <li>
                <a href="#" className="ss-ul-a-cn" style={{ color: "#6f2dc4" }}>
                {t("Seeallcatrgories")}
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="ms-5 mt-4">
              <span>
                <a href="#" className="ss-span-a-cn ">
                {t("ARVRDevelopment")}
                </a>
              </span>
              <span>
                <a href="#" className="ss-span-a-cn">
                {t("AutomationTesting")}
                </a>
              </span>
              <span>
                <a href="#" className="ss-span-a-cn">
                {t("BackEndDevelopment")}
                </a>
              </span>
              <span>
                <a href="#" className="ss-span-a-cn">
                {t("BusinessApplicationsDevelopment")}
                </a>
              </span>
              <span>
                <a href="#" className="ss-span-a-cn">
                {t("CMSDevelopment")}
                </a>
              </span>
              <span>
                <a href="#" className="ss-span-a-cn">
                {t("CloudEngineering")}
                </a>
              </span>
              <span>
                <a href="#" className="ss-span-a-cn">
                {t("CodingTutoring")}
                </a>
              </span>
              <span>
                <a href="#" className="ss-span-a-cn">
                {t("DatabaseAdministration")}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
