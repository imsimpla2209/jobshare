/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url */
import { Flex, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { getFreelancer } from "src/api/freelancer-apis";
import { EStatus } from "src/utils/enum";
import { currencyFormatter, formatDay } from "src/utils/helperFuncs";
import acceptimg from '../../../assets/img/accept.png'
import archiveimg from '../../../assets/img/archive.png'
import pendingimg from '../../../assets/img/pending.png'
import rejectimg from '../../../assets/img/reject.png'

export const { Title, Paragraph, Text } = Typography

export default function OneContract({ contract, ind }) {
  const { t } = useTranslation(['main'])
  const navigate = useNavigate()
  const currentJob = contract.job
  const [freelancer, setFreelancer] = useState(contract.freelancer || {})
  // useEffect(() => {
  //   getFreelancer(contract.freelancer).then(res => setFreelancer(res.data))
  // }, [contract])
  console.log(contract)
  return (
    <section className="air-card-hover py-3">
      <Flex align="start" justify="space-between">
        <Flex vertical gap={10}>
          <Flex align="baseline" gap={8}>
            <Text className="text-muted">Job name:</Text>
            <Link to={`/job-details/${currentJob._id}`} className="fw-bold">
              {currentJob?.title}
            </Link>
          </Flex>

          <Flex align="baseline" gap={8}>
            <Text className="text-muted">Client name:</Text>
            <Link to={`/client-info/${contract?.client?._id}`}>
              <strong className="m-0 ellipsis d-block ng-binding">{contract?.client?.user?.name}</strong>
            </Link>
          </Flex>

          <Flex align="baseline" gap={8}>
            <Text className="text-muted">Contract overview:</Text>
            <span className="text-muted fw-bold">{contract?.overview}</span>
          </Flex>

          <Flex align="baseline" gap={8}>
            <Text className="text-muted">Time range:</Text>

            <small className="text-muted">
              <span>{formatDay(new Date(contract?.startDate))}</span> -{' '}
              <span>{contract?.endDate ? formatDay(new Date(contract?.endDate)) : 'active'}</span>
            </small>
          </Flex>

          <div>
            <span className="text-muted">Payment amount: </span>
            <span>
              <strong>{currencyFormatter(contract?.agreeAmount)}</strong> | {t(contract?.paymentType)}
            </span>
          </div>
        </Flex>
        <>
          {contract?.currentStatus === EStatus.ACCEPTED && <img src={acceptimg} alt="ok" width={50} height={50} />}
          {contract?.currentStatus === EStatus.REJECTED && <img src={rejectimg} alt="ok" width={50} height={50} />}
          {contract?.currentStatus === EStatus.PENDING && <img src={pendingimg} alt="ok" width={50} height={50} />}
          {contract?.currentStatus === EStatus.ARCHIVE && <img src={archiveimg} alt="ok" width={50} height={50} />}
        </>
      </Flex>
    </section>
  )
}
