/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { AutoComplete, ConfigProvider, Input } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { jobLoad, jobsDataStore, refreshStore } from 'src/Store/job.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { miniSearch } from 'src/utils/handleData'
import './SearchBarJobsFreelancer.css'

export default function SearchBarJobsFreelancer({
  showPath = true,
  useIndexSearch = true,
  textSearch,
  setSearchText,
}: any) {
  const { i18n, t } = useTranslation(['main'])
  const { setState } = useSubscription(jobsDataStore)
  const refreshPage = useSubscription(refreshStore).setState
  const jobLoader = useSubscription(jobLoad)

  const handle = e => {
    setSearchText && setSearchText(e.target.value)
  }

  const [searchResults, setSearchResults] = useState([])

  const handleSearch = React.useCallback(
    (text: string) => {
      const results = miniSearch.autoSuggest(text, { fuzzy: 0.3 })
      setSearchResults(results)
    },
    [searchResults]
  )

  const onSelect = React.useCallback(
    (text: string) => {
      if (useIndexSearch) {
        let results = miniSearch.search(text, { fuzzy: 0.2, prefix: true })
        setState(results)
        jobLoader.setState({
          ...jobLoader.state,
          pageSize: results?.length,
          page: 1,
          categories: [],
          skills: [],
          filter: '',
        })
        refreshPage({ isRefresh: true })
      } else {
        setSearchText(text)
      }
    },
    [searchResults]
  )

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Select: {
              optionFontSize: 16,
              optionSelectedBg: '#a2eaf2',
              optionLineHeight: 0.7,
            },
          },
        }}
      >
        <AutoComplete
          style={{ width: '100%' }}
          status="warning"
          popupMatchSelectWidth={true}
          size="large"
          notFoundContent={`${t('Nothing matches the search')}😏🥱`}
          options={searchResults?.map(s => {
            return {
              value: s.suggestion,
              label: (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <span>
                    <p style={{ color: '#0E4623', paddingTop: 3 }}>{s.suggestion}</p>
                  </span>
                </div>
              ),
            }
          })}
          onSelect={onSelect}
          onSearch={handleSearch}
        >
          {useIndexSearch ? (
            <Input.Search
              id="input"
              size="large"
              enterButton
              type="search"
              // style={{ height: "44px", borderTopLeftRadius: 20, borderBottomLeftRadius: 20, border: '2px solid #ccc', padding: '0 12' }}
              // className={`form-control text-dark bg-white`}
              placeholder={t('Search For Jobs')}
            />
          ) : (
            <Input.Search
              onChange={handle}
              size="large"
              placeholder={t('Search For Jobs')}
              enterButton
              value={textSearch}
            ></Input.Search>
          )}
        </AutoComplete>
      </ConfigProvider>
      {/* <div className="col-8 input-group form-outline has-success">
          <Link onClick={searchDatabase} to={""}>
            <button
              id="search-button"
              type="button"
              style={{ borderRadius: 0, height: "44px", fontSize: '10px' }}
              className={`btn bg-jobsicker bg-invert search rounded-end`}
            >

              <i className="fas fa-search" style={{ lineHeight: '22px' }} />
            </button>
          </Link>
        </div> */}
      {showPath ? (
        <span className="d-block pt-2">
          <Link
            to="/Search"
            className="advanced-search-link"
            style={{ fontSize: '17px', color: '#000000', fontWeight: '600' }}
          >
            {t('AdvancedSearch')}
          </Link>
        </span>
      ) : null}
    </div>
  )
}
