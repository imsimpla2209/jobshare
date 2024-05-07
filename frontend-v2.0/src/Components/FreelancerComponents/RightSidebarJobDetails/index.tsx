import { Result } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ClientInfo from "./../ClientInfo";
import ConnectsAndSubmit from "./../ConnectsAndSubmit";
import JobLink from "./../JobLink";

export default function RightSidebarJobDetails({ job, freelancer }) {
  const { t } = useTranslation(['main'])

  
  return (
    <div className="col-lg-3 col-xs-3 d-flex flex-column">
      {!!freelancer?.jobs?.includes(job?._id) ? (
        <div className="bg-white">
          <Result
            title={t('You got this job')}
            extra={
              <Link to={`/proposals`} type="primary" key="console">
                {t('Go to my job')}
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {job?.appliedFreelancers?.includes(freelancer?._id) ? (
            <div className="bg-white">
              <Result
                title={t('You already applied for this Job')}
                extra={
                  <Link to={`/proposals`} type="primary" key="console">
                    {t('Review proposal')}
                  </Link>
                }
              />
            </div>
          ) : (
            <ConnectsAndSubmit />
          )}
        </>
      )}
      <ClientInfo client={job?.client} />
      <JobLink id={job?._id} />
    </div>
  )
}
