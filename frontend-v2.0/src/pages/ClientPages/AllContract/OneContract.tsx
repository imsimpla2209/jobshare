/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url */
import { Flex, Space } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFreelancer } from 'src/api/freelancer-apis'
import { EStatus } from 'src/utils/enum'
import { currencyFormatter, formatDay } from 'src/utils/helperFuncs'
import acceptimg from '../../../assets/img/accept.png'
import archiveimg from '../../../assets/img/archive.png'
import pendingimg from '../../../assets/img/pending.png'
import rejectimg from '../../../assets/img/reject.png'
import { Text } from '../JobDetailsBeforeProposols'
import { useTranslation } from 'react-i18next'

export default function OneContract({ contract }) {
  const { t } = useTranslation(['main'])
  const currentJob = contract.job
  const { freelancer } = contract

  return (
    <section className="air-card-hover py-3">
      <Flex align="start" justify="space-between">
        <Flex vertical gap={10}>
          <Flex align="baseline" gap={8}>
            <Text className="text-muted">{t('Job name')}:</Text>
            <Link to={`/job-details/${currentJob._id}`} className="fw-bold">
              {currentJob?.title}
            </Link>
          </Flex>

          <Flex align="baseline" gap={8}>
            <Text className="text-muted">Freelancer name:</Text>
            <Link to={`/freelancer-profile/${freelancer?.id}`}>
              <strong className="m-0 ellipsis d-block ng-binding">{freelancer?.name}</strong>
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
        <Flex vertical justify="space-between" align="end" gap={20}>
          {contract?.currentStatus === EStatus.ACCEPTED && <img src={acceptimg} alt="ok" width={50} height={50} />}
          {contract?.currentStatus === EStatus.REJECTED && <img src={rejectimg} alt="ok" width={50} height={50} />}
          {contract?.currentStatus === EStatus.PENDING && <img src={pendingimg} alt="ok" width={50} height={50} />}
          {contract?.currentStatus === EStatus.ARCHIVE && <img src={archiveimg} alt="ok" width={50} height={50} />}
          <small className="text-muted">
            <span>Created at: {formatDay(new Date(contract?.createdAt))}</span>
          </small>
        </Flex>
      </Flex>
    </section>
  )
}
