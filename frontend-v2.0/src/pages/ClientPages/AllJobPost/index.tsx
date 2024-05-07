/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import { SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Divider,
  InputNumber,
  Pagination,
  Radio,
  Result,
  Slider,
  Space,
  Tag,
} from 'antd'
import searching from 'assets/img/searching.jpg'
import { isArray, isEmpty } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ClientJobCard from 'src/Components/ClientComponents/ClientJobCard'
import CategoriesPicker from 'src/Components/SharedComponents/CategoriesPicker'
import Loader from 'src/Components/SharedComponents/Loader/Loader'
import LocationPicker from 'src/Components/SharedComponents/LocationPicker'
import { MultiSkillPicker } from 'src/Components/SharedComponents/SkillPicker'
import { locationStore } from 'src/Store/commom.store'
import { advancedSearchJobs, advancedSearchPage, emptyFilterOptions } from 'src/Store/job.store'
import { clientStore, freelancerStore } from 'src/Store/user.store'
import { filterJobs } from 'src/api/job-apis'
import { useSubscription } from 'src/libs/global-state-hook'
import { EComplexityGet, EJobStatus, EPaymenType } from 'src/utils/enum'
import styled from 'styled-components'
import SearchBarJobsFreelancer from '../../../Components/FreelancerComponents/SearchBarJobsFreelancer'

export interface IFilterOptions {
  complexity?: any[]
  categories?: any[]
  skills?: any[]
  locations?: any[]
  type?: any[]
  currentStatus?: any[]
  duration?: any
  budget?: any
  amount?: any
  proposals?: any
  nOEmployee?: any
}

export default function AllJobPosts() {
  const { i18n, t } = useTranslation(['main'])
  let lang = i18n.language
  const [searchData, setsearchData] = useState([])
  const [text, searchFilterText] = useState('')
  const [total, setTotal] = useState(0)
  const locationss = useSubscription(locationStore).state
  const freelancer = useSubscription(freelancerStore).state
  const client = useSubscription(clientStore).state
  const [filterOption, setfilterOption] = useState<IFilterOptions>({})
  const [refresh, onRefresh] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const advancedSearchData = useSubscription(advancedSearchJobs)
  const advancedSearchPageData = useSubscription(advancedSearchPage)

  const handleSearh = useCallback(
    (p?: number, ps?: number) => {
      const filter = Object.fromEntries(
        Object.entries(advancedSearchData.state).filter(([_, v]) => v != null || (isArray(v) && v?.length === 0))
      )
      advancedSearchPageData.setState({ ...advancedSearchPageData.state, isFirstLoad: false })
      const searchText = !!text ? { searchText: text || '' } : null
      setLoading(true)
      filterJobs(
        { ...filter, ...searchText },
        {
          limit: ps || advancedSearchPageData.state.pageSize,
          page: p || advancedSearchPageData.state.page,
        }
      )
        .then(res => {
          setsearchData(res.data?.results)
          setTotal(res.data?.totalResults)
        })
        .catch(err => {
          console.log('advanced search err', err)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [advancedSearchData, filterOption]
  )

  useEffect(() => {
    handleSearh()
  }, [])

  const handleChangeComp = (c: any[]) => {
    advancedSearchData.setState({ ...advancedSearchData.state, complexity: c })
    const complexity = c?.map((cc, ix) => `${t(`${EComplexityGet[cc]}`)}`)
    setfilterOption({ ...filterOption, complexity })
  }

  const handleDurationRange = useCallback(
    (c: any) => {
      console.log('time', c)
      advancedSearchData.setState({ ...advancedSearchData.state, duration: { from: c[0], to: c[1] } })
      setfilterOption({ ...filterOption, duration: `${c[0]}-${c[1]} ${t('days')}` })
    },
    [advancedSearchData, filterOption]
  )

  const handlePayAmount = useCallback(
    (c: any = 0, d: any = 1000000) => {
      advancedSearchData.setState({ ...advancedSearchData.state, paymentAmount: { from: c, to: d } })
      setfilterOption({ ...filterOption, amount: `${t('Payment Amount')}: ${c}-${d}(VND)` })
    },
    [advancedSearchData, filterOption]
  )

  const handleProposalsAmount = useCallback(
    (c: any) => {
      advancedSearchData.setState({ ...advancedSearchData.state, proposals: { from: c[0], to: c[1] } })
      setfilterOption({ ...filterOption, proposals: `${c[0]}-${c[1]} ${t('Proposals')}` })
    },
    [advancedSearchData, filterOption]
  )

  const handleBudgetAmount = useCallback(
    (c: any = 0, d: any = 1000000) => {
      advancedSearchData.setState({ ...advancedSearchData.state, budget: { from: c, to: d } })
      setfilterOption({ ...filterOption, budget: `${t('Budget')}: ${c}-${d}(VND)` })
    },
    [advancedSearchData, filterOption]
  )

  const onNoEmployeeChange = useCallback(
    (c: any) => {
      const v = c?.target?.value
      const display = !v ? 'All' : v === 1 ? '1' : 'Many'
      advancedSearchData.setState({ ...advancedSearchData.state, nOEmployee: v })
      setfilterOption({ ...filterOption, nOEmployee: `${display} Freelancers` })
    },
    [advancedSearchData, filterOption]
  )

  const onSkillsChange = useCallback(
    (c: any) => {
      advancedSearchData.setState({ ...advancedSearchData.state, skills: c?.map((cc, ix) => cc.value) })
      const skills = c?.map((cc, ix) => cc.label)
      setfilterOption({ ...filterOption, skills })
    },
    [advancedSearchData, filterOption]
  )

  const onCatsChange = useCallback(
    (c: any) => {
      advancedSearchData.setState({ ...advancedSearchData.state, categories: c?.map((cc, ix) => cc.value) })
      const categories = c?.map((cc, ix) => cc.label)
      setfilterOption({ ...filterOption, categories })
    },
    [advancedSearchData, filterOption]
  )

  const onLocationChange = useCallback(
    (l: any) => {
      advancedSearchData.setState({ ...advancedSearchData.state, locations: l })
      const locations = l?.map((cc, ix) => locationss?.find(s => s.code === cc.toString()).name)
      setfilterOption({ ...filterOption, locations })
    },
    [advancedSearchData, filterOption]
  )

  const onStatusChange = useCallback(
    (l: any) => {
      advancedSearchData.setState({ ...advancedSearchData.state, currentStatus: l })
      const currentStatus = l?.map((cc, ix) => `${t(`${cc}`)}`)
      setfilterOption({ ...filterOption, currentStatus })
    },
    [advancedSearchData, filterOption]
  )

  const onPayTypeChange = useCallback(
    (l: any) => {
      advancedSearchData.setState({ ...advancedSearchData.state, paymentType: l })
      const type = l?.map((cc, ix) => `${t(`${cc}`)}`)
      setfilterOption({ ...filterOption, type })
    },
    [advancedSearchData, filterOption]
  )

  const removeFilterOptions = useCallback(() => {
    advancedSearchData.setState(emptyFilterOptions)
    setfilterOption({})
    onRefresh(true)
    setTimeout(() => onRefresh(false), 2000)
  }, [advancedSearchData, filterOption])

  return (
    <div className="container-md container-fluid-sm ">
      <div className="row" style={{ paddingTop: 20 }}>
        <div className="col">
          <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
            <h5 className="display-inline-block" style={{ color: 'white' }}>
              {t('FilterBy')}
            </h5>

            <Card title={t('Category')}>
              <ul className="list-group sidebar-homebage-ul mb-lg-3 " style={{ fontSize: '0.9em' }}>
                <CategoriesPicker reset={refresh} handleChange={onCatsChange} istakeValue={true}></CategoriesPicker>
              </ul>
            </Card>

            <Card title={t('Freelancers needed')}>
              <Radio.Group onChange={onNoEmployeeChange} value={advancedSearchData.state?.nOEmployee}>
                <Radio value={null} style={{ width: '100%' }}>
                  {t('All')}
                </Radio>
                <Radio value={1} style={{ width: '100%' }}>
                  {t('Singlefreelancer')}
                </Radio>
                <Radio value={1000} style={{ width: '100%' }}>
                  {t('Multiplefreelancers')}
                </Radio>
              </Radio.Group>
            </Card>

            <Card title={t('Complexity')}>
              <Checkbox.Group
                style={{ width: '100%' }}
                onChange={handleChangeComp}
                value={advancedSearchData.state?.complexity}
              >
                <Space direction="vertical">
                  {EComplexityGet.map((l, ix) => (
                    <span key={l}>
                      <Checkbox value={ix}>{t(`${l}`)}</Checkbox>
                    </span>
                  ))}
                </Space>
              </Checkbox.Group>
            </Card>

            <Card title={t('JobType')}>
              <Checkbox.Group
                style={{ width: '100%' }}
                onChange={onPayTypeChange}
                value={advancedSearchData.state?.paymentType}
              >
                <Space direction="vertical">
                  {Object.keys(EPaymenType).map(l => (
                    <span key={l}>
                      <Checkbox value={EPaymenType[l]}>{t(`${EPaymenType[l]}`)}</Checkbox>
                    </span>
                  ))}
                </Space>
              </Checkbox.Group>
            </Card>

            <Card title={`${t('Payment Amount')} ${`(${t('VND')})`}`}>
              <Space wrap>
                <InputNumber
                  prefix="From"
                  addonBefore=""
                  addonAfter={<> VND</>}
                  defaultValue={0}
                  controls
                  onKeyPress={event => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                  value={advancedSearchData.state?.paymentAmount?.from}
                  onChange={(v: any) => handlePayAmount(v)}
                  decimalSeparator=","
                  max={advancedSearchData.state?.paymentAmount?.to || Number.MAX_SAFE_INTEGER}
                />
                <InputNumber
                  prefix="To"
                  addonBefore=""
                  addonAfter={<> VND</>}
                  defaultValue={1}
                  value={advancedSearchData.state?.paymentAmount?.to}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  onKeyPress={event => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  onChange={(v: any) => handlePayAmount(advancedSearchData.state?.paymentAmount?.from || 0, v)}
                  min={advancedSearchData.state?.paymentAmount?.from || 1}
                  controls
                />
              </Space>
              {/* <Slider className="mb-5" marks={{ 0: 'From(0)', 3000: 'to(30Tr)' }} min={1} max={3000}
							onAfterChange={handlePayAmount}
							range={{ draggableTrack: true }}
							defaultValue={[1, 1]}
							tooltip={{ formatter: (value: number) => `${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(value * 10000)}` }} /> */}
            </Card>

            <Card title={`${t('Budget')} ${`(${t('VND')})`}`}>
              <Space wrap>
                <InputNumber
                  prefix="From"
                  addonBefore=""
                  addonAfter={<> VND</>}
                  defaultValue={0}
                  controls
                  onKeyPress={event => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                  value={advancedSearchData.state?.paymentAmount?.from}
                  onChange={(v: any) => handleBudgetAmount(v)}
                  decimalSeparator=","
                  max={advancedSearchData.state?.paymentAmount?.to || Number.MAX_SAFE_INTEGER}
                />
                <InputNumber
                  prefix="To"
                  addonBefore=""
                  addonAfter={<> VND</>}
                  defaultValue={1}
                  value={advancedSearchData.state?.paymentAmount?.to}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  onKeyPress={event => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  onChange={(v: any) => handleBudgetAmount(advancedSearchData.state?.paymentAmount?.from || 0, v)}
                  min={advancedSearchData.state?.paymentAmount?.from || 1}
                  controls
                />
              </Space>
            </Card>
            {/* <Slider className="mb-5" marks={{ 0: 'From(0)', 3000: 'to(3T)' }} min={1} max={3000}
							onAfterChange={handleBudgetAmount}
							range={{ draggableTrack: true }}
							defaultValue={[1, 1]}
							tooltip={{ formatter: (value: number) => `${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(value * 1000000)}` }} /> */}

            <Card title={t('Skills')}>
              <MultiSkillPicker reset={refresh} handleChange={onSkillsChange} istakeValue={true}></MultiSkillPicker>
            </Card>

            <Card title={t('Status')}>
              <Checkbox.Group
                style={{ width: '100%' }}
                onChange={onStatusChange}
                value={advancedSearchData.state?.currentStatus}
              >
                <Space direction="vertical">
                  {Object.keys(EJobStatus).map(l => (
                    <span key={l}>
                      <Checkbox value={EJobStatus[l]}>{t(`${EJobStatus[l]}`)}</Checkbox>
                    </span>
                  ))}
                </Space>
              </Checkbox.Group>
            </Card>

            <Card title={t('NumberofProposals')}>
              <Slider
                className="mb-5"
                marks={{ 0: 'From(0)', 40: 'To(40)' }}
                min={0}
                max={40}
                onAfterChange={handleProposalsAmount}
                range={{ draggableTrack: true }}
                defaultValue={[0, 0]}
                tooltip={{ formatter: (value: number) => `${value} ${t('Proposals')}` }}
              />
            </Card>

            <Card title={t('ClientInfo')}>
              <div className="form-check py-2 my-0">
                <input
                  className="form-check-input btn-outline-success"
                  type="checkbox"
                  defaultValue={''}
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {t('MyPreviousClients')}
                </label>
              </div>
              <div className="form-check py-2 my-0">
                <input
                  className="form-check-input btn-outline-success"
                  type="checkbox"
                  defaultValue={''}
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {t('PaymentVerified')}
                </label>
              </div>
            </Card>

            <Card title={t('ClientLocation')}>
              <div className="input-group rounded-3">
                <LocationPicker reset={refresh} handleChange={onLocationChange}></LocationPicker>
              </div>
            </Card>

            <Card title={`${t('ProjectLength')} ${`(${t('days')})`}`}>
              <h6 className="mb-lg-2 display-inline-block mt-lg-3 fw-bold">
                {t('ProjectLength')} {`(${t('days')})`}
              </h6>
              <Slider
                className="mb-5"
                marks={{ 1: 'From(1)', 365: 'to(365)' }}
                min={1}
                max={365}
                onAfterChange={handleDurationRange}
                range={{ draggableTrack: true }}
                defaultValue={[1, 1]}
                tooltip={{ formatter: (value: number) => `${value} ${t('days')}` }}
              />
            </Card>

            <Card title={t('Hours Per Week')}>
              <div className="form-check py-2 my-0">
                <input
                  className="form-check-input btn-outline-success"
                  type="checkbox"
                  defaultValue={''}
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {t('Lessthan30hrsweek')}
                </label>
              </div>
              <div className="form-check py-2 my-0">
                <input
                  className="form-check-input btn-outline-success"
                  type="checkbox"
                  defaultValue={''}
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {t('Morethan30hrsweek')}
                </label>
              </div>
            </Card>
          </div>
        </div>

        <div className="col-lg-9 col-xs-12">
          <div>
            <div className="row">
              <div className="col-11">
                <SearchBarJobsFreelancer
                  showPath={false}
                  useIndexSearch={false}
                  textSearch={text}
                  setSearchText={searchFilterText}
                />
              </div>
              <Button
                onClick={() => handleSearh()}
                className="col-1"
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
              />
            </div>

            {!isEmpty(filterOption) ? (
              <div
                style={{
                  borderRadius: 8,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 8,
                  paddingBottom: 8,
                  width: '100%',
                }}
              >
                <Space wrap>
                  {filterOption?.amount && <FilterTag color="#ff8c00">{filterOption.amount}</FilterTag>}
                  {filterOption?.budget && <FilterTag color="#ff8c00">{filterOption.budget}</FilterTag>}
                  {filterOption?.duration && <FilterTag color="#3fa182">{filterOption.duration}</FilterTag>}
                  {filterOption?.nOEmployee && <FilterTag color="#0e569e">{filterOption.nOEmployee}</FilterTag>}
                  {filterOption?.skills &&
                    filterOption?.skills?.map((c, ix) => (
                      <FilterTag key={c} color="#6c0ba1">
                        {c}
                      </FilterTag>
                    ))}
                  {filterOption?.proposals && <FilterTag color="#ab0c56">{filterOption?.proposals}</FilterTag>}
                  {filterOption?.categories &&
                    filterOption?.categories?.map((c, ix) => (
                      <FilterTag key={c} color="#e807d4">
                        {c}
                      </FilterTag>
                    ))}
                  {filterOption?.complexity &&
                    filterOption?.complexity?.map((c, ix) => (
                      <FilterTag key={c} color="#1f9914">
                        {c}
                      </FilterTag>
                    ))}
                  {filterOption?.currentStatus &&
                    filterOption?.currentStatus?.map((c, ix) => (
                      <FilterTag key={c} color="#06cccc">
                        {c}
                      </FilterTag>
                    ))}
                  {filterOption?.type &&
                    filterOption?.type?.map((c, ix) => (
                      <FilterTag key={c} color="#b06810">
                        {c}
                      </FilterTag>
                    ))}
                  {filterOption?.locations &&
                    filterOption?.locations?.map((c, ix) => (
                      <FilterTag key={c} color="#104bb0">
                        {c}
                      </FilterTag>
                    ))}
                  <Button
                    type="text"
                    onClick={removeFilterOptions}
                    style={{ color: '#0E4623', fontSize: 17, padding: 2 }}
                  >
                    {t('Clear Filter')}
                  </Button>
                </Space>
              </div>
            ) : null}

            <Divider style={{ marginTop: 16 }} />
          </div>
          {advancedSearchPageData?.state?.isFirstLoad ? (
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <h4 className="text-center " style={{ color: '#124C82', marginTop: 16, fontWeight: 600 }}>
                {t('Please try adjusting your search keywords or filters')}
              </h4>
              <img src={searching} alt="advanced search" />
            </div>
          ) : (
            <>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
                  <Loader />
                </div>
              ) : (
                <div className="mt-3">
                  {searchData.length === 0 ? (
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
                  ) : (
                    <>
                      {searchData?.map((item, ix) => (
                        <div key={ix}>
                          <ClientJobCard item={item} client={client} lang={lang} />
                        </div>
                      ))}
                      <Card style={{ marginBottom: 20 }}>
                        <Pagination
                          total={total}
                          pageSize={advancedSearchPageData.state?.pageSize}
                          current={advancedSearchPageData.state?.page}
                          showSizeChanger={false}
                          responsive
                          onChange={p => handleSearh(p)}
                          onShowSizeChange={(_, s) => handleSearh(null, s)}
                          showTotal={total => `Total ${total} items`}
                        />
                      </Card>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const FilterTag = styled(Tag)`
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 32px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  text-shadow: rgba(0, 0, 0, 0.25) 0 3px 8px;
`
// background: linear-gradient(92.88deg, #12582D 9.16%, #316027 43.89%, #1F8346 64.72%);
