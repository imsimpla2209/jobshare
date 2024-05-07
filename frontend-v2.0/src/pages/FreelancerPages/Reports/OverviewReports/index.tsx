/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import Available from "Components/FreelancerComponents/Available";
import InReview from "Components/FreelancerComponents/InReviewComponent";
import Pending from "Components/FreelancerComponents/Pending";
import WorkinProgress from "Components/FreelancerComponents/WorkinProgress";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";

export default function OverviewReports() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  pathname === "/overview" && navigate("/overview/work-in-progress");
  const { t } = useTranslation(['main']);
  const inreview = '0';

  useEffect(() => {
    // dispatch(inReviewAction());
    console.log(inreview);
    // db.collection("freelancer")
    //   .doc(auth.currentUser.uid)
    //   .collection("jobProposal")
    //   .where("status", "==", "contract").get().then(res => res.docs.map(item => {

    //   }))
  }, []);

  return (
    <>
      <>

        <div className="W-100%">
          <br />
        </div>
        <div className="container card">
          <div className="row">
            <ul className="nav nav-tabs nav-fill " id="ex1" role="tablist">
              <li
                className="nav-item"
                role="presentation"
              // style={{ backgroundColor: "#f1f2f4" }}
              >
                <NavLink
                  id="ex2-tab-1"
                  to="/overview/work-in-progress"
                  data-mdb-toggle="tab"
                  role="tab"
                  aria-controls="ex2-tabs-1"
                  aria-selected="true"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <h4 className="nowrap m-0-bottom">
                    {t("Work in progress")}
                    <span className="m-0-left-right d-lg-inline">
                      <i
                        className="far fa-question-circle"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="This includes hours logged for the current work week. They will be automatically sent to the client for review Sunday night UTC (the close of the work week).
                        This also includes any fixed-price milestones that have been assigned to you. Unlike hourly timesheets, work on fixed-price milestones must be submitted when ready."
                      />
                    </span>
                  </h4>
                  <h1 className="m-xs-top-bottom nowrap ">
                    <strong className="lead-lg">{t("$0.00")}</strong>
                  </h1>
                  <p className="m-0-bottom text-muted nowrap d-none d-lg-block">
                    &nbsp;
                  </p>
                </NavLink>
              </li>
              <li className="nav-item" role="presentation">
                <NavLink
                  id="ex2-tab-1"
                  data-mdb-toggle="tab"
                  to="/overview/in-review"
                  role="tab"
                  style={{ textDecoration: "none" }}
                >
                  <h4 className="nowrap m-0-bottom">
                    {t("In review")}
                    <span className="m-0-left-right d-lg-inline">
                      <i
                        className="far fa-question-circle"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="This represents hours logged last week that are now under review by your clients. Clients have 5 days to review your work diary.
                       This also includes any fixed-price milestones you've submitted for review. Clients have 14 days to accept (or ask for changes on) submitted milestones."
                      />
                    </span>
                  </h4>
                  <h1 className="m-xs-top-bottom nowrap ">
                    <strong className="lead-lg">{t("$0.00")}</strong>
                  </h1>
                  <p className="m-0-bottom text-muted nowrap d-lg-block">
                    &nbsp;
                  </p>
                </NavLink>
              </li>
              <li className="nav-item" role="presentation">
                <NavLink
                  id="ex2-tab-3"
                  to="/overview/pending"
                  data-mdb-toggle="tab"
                  role="tab"
                  style={{ textDecoration: "none" }}
                >
                  <h4 className="nowrap m-0-bottom">
                    {t("Pending")}
                    <span className="m-0-left-right  d-lg-inline">
                      <i
                        className="far fa-question-circle"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="This represents the standard security hold period in which funds cannot be withdrawn.

                       Hourly payments are in the security period from the time the client review ends on Friday to when the funds are released on Wednesday.
                       
                       Payments for fixed-price milestones (and bonuses) have a 5-day security period from the time payment is made to funds availability."
                      />
                    </span>
                  </h4>
                  <h1 className="m-xs-top-bottom nowrap ">
                    <strong className="lead-lg">${inreview}</strong>
                  </h1>
                  <p className="m-0-bottom text-muted nowrap d-lg-block">
                    &nbsp;
                  </p>
                </NavLink>
              </li>

              <li className="nav-item" role="presentation">
                <NavLink
                  id="ex2-tab-4"
                  data-mdb-toggle="tab"
                  to="/overview/available"
                  role="tab"
                  style={{ textDecoration: "none" }}
                >
                  <h4 className="nowrap m-0-bottom">
                    {t("Available")}
                    <span className="m-0-left-right  d-lg-inline">
                      <i
                        className="far fa-question-circle"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="These are funds available to withdraw. If you've set up automatic payments, this will usually show a zero balance, with the last payment indicated below. Click this tab to see a history of payments already sent."
                      />
                    </span>
                  </h4>
                  <h1 className="m-xs-top-bottom nowrap ">
                    <strong className="lead-lg">{t("$0.00")}</strong>
                  </h1>
                  <p className="m-0-bottom text-muted nowrap d-lg-block">
                    &nbsp;
                  </p>
                  <p className="m-0-bottom text-muted nowrap d-lg-block">
                    {t("Last payment")} :$0.00
                  </p>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </>

      <Routes>
        <Route path="/overview/work-in-progress" element={<WorkinProgress />}>

        </Route>
        <Route path="/overview/in-review" element={<InReview />
        }>
        </Route>
        <Route path="/overview/pending" element={<Pending />
        }>
        </Route>
        <Route path="/overview/available" element={<Available />
        }>
        </Route>
      </Routes>
    </>
  );
}
