/* eslint-disable */
import { useTranslation } from "react-i18next";
import SearchBarJobsFreelancer from "../SearchBarJobsFreelancer";

export default function FindWorkFreelancerHome() {
  const { t } = useTranslation(['main']);
  

  return (
    <div className="d-lg-block mb-4 mb-md-0" >
      <div className="row my-lg-4">
        <div className="col d-none d-lg-block">
          {/* <h4 style={{ fontWeight: '500', color:"white" }}>{t("FindWork")}</h4> */}
        </div>
        <div className="col-md-7 col-12">
          <SearchBarJobsFreelancer />
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
}
