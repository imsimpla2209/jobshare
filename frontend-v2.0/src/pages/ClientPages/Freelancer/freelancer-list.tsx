import { Card, ConfigProvider, Input, Pagination, Result, Row, Spin } from 'antd'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import Saved from 'src/Components/ClientComponents/SavedComponent'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import { clientStore } from 'src/Store/user.store'
import { filterFreelancers } from 'src/api/freelancer-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { IFreelancer } from 'src/types/freelancer'

export default function FreelancerListCards({ filterOption, saved, searchKey }) {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [listFreelancers, setListFreelancers] = useState<IFreelancer[]>([])
  let {
    state: { favoriteFreelancers },
  } = useSubscription(clientStore)

  const [total, setTotal] = useState(0)

  const getFilteredListFreelancers = async (p = null) => {
    setLoading(true)
    if (saved) {
      filterOption['id'] = favoriteFreelancers
    }
    if (!filterOption?.skills?.length) delete filterOption?.skills
    if (!filterOption?.preferJobType?.length) delete filterOption?.preferJobType
    if (!filterOption?.currentLocations?.length) delete filterOption?.currentLocations
    if (searchKey.trim()) {
      filterOption['name'] = searchKey.trim()
    }
    await filterFreelancers({ ...filterOption }, { limit: 10, page: p || page })
      .then(res => {
        setListFreelancers(res.data.results)
        setTotal(res.data.totalResults)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setPage(1)
    getFilteredListFreelancers()
  }, [filterOption, favoriteFreelancers, searchKey])

  const handleChangePageJob = (p: number) => {
    if (p === page) return
    setPage(p)
    getFilteredListFreelancers(p)
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : listFreelancers?.length ? (
        <>
          {listFreelancers.map(freelancer => (
            <Row style={{ marginBottom: 16 }}>
              <Saved freelancer={freelancer} key={freelancer._id} />
            </Row>
          ))}

          <Card>
            <Pagination
              total={total}
              pageSize={10}
              current={page}
              showSizeChanger={false}
              responsive
              onChange={p => handleChangePageJob(p)}
              showTotal={total => `Total ${total} freelancers`}
            />
          </Card>
        </>
      ) : (
        <div className="col-12 bg-white">
          <Result
            status="404"
            title="Oops, sorry mah bro"
            subTitle={
              <>
                <h3 className="fw-bold text-center py-2 pt-5 " style={{ color: '#124C82' }}>
                  {t('There are no results that match your search')}
                </h3>

                <h6 className="text-center " style={{ color: '#124C82' }}>
                  {t('Please try adjusting your search keywords or filters')}
                </h6>
              </>
            }
            // extra={<Button type="primary">Back Home</Button>}
          />
        </div>
      )}
    </>
  )
}
