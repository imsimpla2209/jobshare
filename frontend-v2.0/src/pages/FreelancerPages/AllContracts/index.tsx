/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { freelancerStore } from 'src/Store/user.store'
import { getContracts } from 'src/api/contract-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import OneContract from '../../../Components/FreelancerComponents/OneContract'
import { EStatus } from 'src/utils/enum'
import { Tabs } from 'antd'

const tabLists = {
  Pending: EStatus.PENDING,
  Accepted: EStatus.ACCEPTED,
  Rejected: EStatus.REJECTED,
  Archive: EStatus.ARCHIVE,
}

export default function AllContracts() {
  const { t } = useTranslation(['main'])
  const [contracts, setContracts] = useState([])
  const [tab, setTab] = useState(EStatus.PENDING)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [loading, onLoading] = useState(true)
  const [refresh, onRefresh] = useState(true)

  const freelancer = useSubscription(freelancerStore).state

  useEffect(() => {
    if (freelancer?._id) {
      console.log(freelancer)
      getContracts({ freelancer: freelancer?._id, currentStatus: tab }).then(res => setContracts(res.data?.results))
    }
  }, [freelancer, tab])

  return (
    <div className="">
      <div className="container">
        <div className="row px-5">
          <h4 className="col-12 mt-5 text-white">{t('Contracts')}</h4>
          <div className="mt-4 mb-5">
            {/* <div className="card-header bg-white p-3">
                {data && <SearchContract />}
              </div> */}
            <Tabs
              onChange={t => setTab(t as EStatus)}
              type="card"
              style={{
                background: "#ccc",
                borderRadius: 8
              }}
              tabBarStyle={{ color: '#2E6421' }}
              items={Object.keys(tabLists).map((k, i) => {
                return {
                  label: `${t(`${k}`)}`,
                  key: tabLists[k],
                }
              })}
            />
            <div className="card-body">
              <div className="row">
                {contracts ? (
                  contracts?.map((contract, index) => {
                    return (
                      <div className="card mt-3 mb-3 px-4">
                        <OneContract contract={contract} key={index} ind={index} />
                      </div>
                    )
                  })
                ) : (
                  <p className="h3 py-5">You haven't started any contracts yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
