/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getJobs } from "src/api/job-apis";
import { EComplexityGet } from "src/utils/enum";
import { currencyFormatter, randomDate } from "src/utils/helperFuncs";

export default function OtherOpenJobsByThisClient({ client }) {
  const { t } = useTranslation(['main']);
  const [data, setData] = React.useState([])
  const [left, setLeft] = React.useState(0)
  React.useEffect(() => {
    if (client) {
      getJobs({
        client: client?._id,
        limit: 4,
        projectBy: 'title, description, payment, budget, createdAt'
      }).then((res) => {
        setData(res.data?.results);
        setLeft(res.data?.totalResults)
      })
    }
  }, [client])
  return (
    <div>
      <div className="bg-white py-lg-1 px-4 mt-4  border  row py-xs-5">
        <h4 className="fw-bold py-3">
          {t("Other open jobs by this Client")}
        </h4>
      </div>
      <div className="bg-white py-lg-1 px-4  border  row py-xs-5">
        {
          data?.map((d) => (
            <div key={d?._id} className="border row rounded mb-3">
              <div className="col-md-9 py-1">
                <a href={`/#/job/${d?._id}`} className="advanced-search-link fw-bold">
                  {d?.title}
                </a>
                <p className="text-muted">
                  {
                    d?.createdAt ? new Date(`${d?.createdAt}`).toLocaleString()
                      : randomDate(new Date(2022, 0, 1), new Date()).toLocaleString()
                  }
                </p>
                <p className="">
                  {d?.description}
                </p>
              </div>
              <div className="col-md-3 py-2">
                <span className="text-muted">{t(`${d?.payment?.type}`)}/ {currencyFormatter(d?.payment?.amount)}</span>
                <div>
                  <span className="fw-bold me-1">{t("Est. Budget")}</span>
                  <span id="client-budget">{currencyFormatter(d?.budget)}</span>
                </div>
              </div>
            </div>
          ))
        }
        <div style={{ textAlign: 'end' }}>
          {
            left > 4 && <Link to={`/client-info/${client?._id}`} className="advanced-search-link">{t("See all jobs from this client")} {`(${left})`}</Link>
          }
        </div>
      </div>
    </div >
  );
}
