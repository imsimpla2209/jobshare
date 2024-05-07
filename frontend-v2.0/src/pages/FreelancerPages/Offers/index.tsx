/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Loader from '../../../Components/SharedComponents/Loader/Loader'
import OfferCard from './OfferCard'
import { useTranslation } from 'react-i18next'
import { Pagination, Tabs } from 'antd'
import { EInvitationType, EStatus } from 'src/utils/enum'
import { getInvitations } from 'src/api/message-api'
import { useSubscription } from 'src/libs/global-state-hook'
import { userStore } from 'src/Store/user.store'
import ContractInviCard from './ContractInviCard'

const tabLists = {
  Pending: EStatus.PENDING,
  Accepted: EStatus.ACCEPTED,
  Rejected: EStatus.REJECTED,
  Archive: EStatus.ARCHIVE,
  Sent: EStatus.PAID,
}

export default function Offers() {
  const { t } = useTranslation(['main'])
  const [invitations, setInvitations] = useState([])
  const [tab, setTab] = useState(EStatus.PENDING)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [loading, onLoading] = useState(true)
  const [refresh, onRefresh] = useState(true)
  const user = useSubscription(userStore).state

  useEffect(() => {
    if (user) {
      getOffers()
    }
  }, [tab, user, refresh])

  const getOffers = (p?: number) => {
    onLoading(true)
    let request
    if (tab !== tabLists.Sent) {
      request = getInvitations({ currentStatus: tab, to: user?.id ?? user?._id, page: p ?? page })
    } else {
      request = getInvitations({ from: user?._id ?? user?.id, page: p ?? page })
    }
    request
      .then(res => {
        setInvitations(res.data.results)
        setTotal(res.data.totalResults)
      })
      .catch(err => {
        console.log('ERROR - getInvitations', err)
      })
      .finally(() => onLoading(false))
  }

  const handleChangePage = (page: number) => {
    setPage(page)
    getOffers(page)
  }

  return (
    <div className=" bg-gray">
      <div className="container">
        <div className="row px-5">
          <div className="col-12 mt-5">
            <h3>{t('Invitations')}</h3>
          </div>
          <div className="col-12 bg-white mb-3 pb-5 p-3 border border-gray rounded">
            <Tabs
              onChange={t => setTab(t as EStatus)}
              type="card"
              tabBarStyle={{ color: '#2E6421' }}
              items={Object.keys(tabLists).map((k, i) => {
                return {
                  label: `${t(`${k}`)}`,
                  key: tabLists[k],
                }
              })}
            />
            {loading ? (
              <Loader />
            ) : (
              <>
                {invitations.length > 0 ? (
                  <>
                    {invitations.map((invitation, index) => {
                      if (invitation.type === EInvitationType.MESSAGE) {
                        return (
                          <OfferCard
                            key={index}
                            onRefresh={onRefresh}
                            user={user}
                            invitation={invitation}
                            getOffers={getOffers}
                          />
                        )
                      } else if (invitation.type === EInvitationType.CONTRACT) {
                        return (
                          <ContractInviCard
                            key={index}
                            onRefresh={onRefresh}
                            setTab={setTab}
                            user={user}
                            invitation={invitation}
                            getOffers={getOffers}
                          />
                        )
                      }
                    })}
                  </>
                ) : (
                  <p className="h3 py-3">{t('No Invitations Yet')}</p>
                )}
              </>
            )}
            <Pagination defaultCurrent={1} current={page} onChange={p => handleChangePage(p)} total={total} />
          </div>
        </div>
      </div>
    </div>
  )
}
