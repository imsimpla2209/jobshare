/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clientStore } from 'src/Store/user.store'
import { getContracts } from 'src/api/contract-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import OneContract from './OneContract'
import { Card, Radio } from 'antd'
import { EStatus } from 'src/utils/enum'
import toast from 'react-hot-toast'
import Loader from 'src/Components/SharedComponents/Loader/Loader'

export default function AllContracts() {
  const { t } = useTranslation(['main'])
  const [contracts, setContracts] = useState([])
  const [loading, setloading] = useState(false)
  const {
    state: { id: clientId },
  } = useSubscription(clientStore, ['id'])

  const [contractStatus, setContractStatus] = useState(EStatus.ACCEPTED)

  useEffect(() => {
    if (!clientId) return

    setloading(true)
    getContracts({ client: clientId, currentStatus: contractStatus, sortBy: 'updatedAt:desc' })
      .then(res => setContracts(res.data.results))
      .catch(err => toast.error(err))
      .finally(() => setloading(false))
  }, [clientId, contractStatus])

  return (
    <div style={{ padding: '40px 100px' }}>
      <Card
        title={t('Contracts')}
        extra={
          <Radio.Group
            value={contractStatus}
            onChange={e => setContractStatus(e.target.value)}
            buttonStyle="solid"
            size="large"
            style={{ marginBottom: 8 }}
          >
            <Radio.Button value={EStatus.ACCEPTED}>{t('Accepted')}</Radio.Button>
            <Radio.Button value={EStatus.PENDING}>{t('Pending')}</Radio.Button>
            <Radio.Button value={EStatus.REJECTED}>{t('Rejected')}</Radio.Button>
          </Radio.Group>
        }
      >
        {loading ? (
          <Loader />
        ) : contracts?.length ? (
          contracts.map((contract, index) => {
            return (
              <div className="card mt-3 mb-3 px-4">
                <OneContract contract={contract} key={index} />
              </div>
            )
          })
        ) : (
          <p className="h3 py-5">You don't have any {t(contractStatus)} contracts.</p>
        )}
      </Card>
    </div>
  )
}
