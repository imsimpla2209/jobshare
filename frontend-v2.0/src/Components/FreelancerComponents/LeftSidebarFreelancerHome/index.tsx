/* eslint-disable array-callback-return */

/* eslint-disable react-hooks/exhaustive-deps */
import { fakeJobsState } from 'Store/fake-state'
import { Checkbox, Col, ConfigProvider, Radio, Space } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { EJobFilter, jobLoad } from 'src/Store/job.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { pickName } from 'src/utils/helperFuncs'

export default function LeftSidebarFreelancerHome({ freelancer }) {
  // const { arr, setarr, setitemSearchList, setsearchList, setswitchJobs} = useContext(SearchContext);
  const { t, i18n } = useTranslation(['main'])
  const lang = i18n.language
  const navigate = useNavigate()

  const jobLoader = useSubscription(jobLoad)

  useEffect(() => {
    // user.searchHistory != null ?
    //   sessionStorage.setItem("searchArray", user?.searchHistory) :
    //   setarr(user?.searchHistory)
  }, [])

  const handleVal = textSearch => {
    // setitemSearchList(textSearch);
    // let tempArr = [];
    // jobs.map((e) => e.skills.includes(textSearch) && tempArr.push(e))
    // setsearchList(tempArr)
    navigate({ pathname: '/search' })
  }

  const switchJobs = txt => {
    jobLoader.setState({ ...jobLoader.state, filter: txt.target.value, isFirstLoad: true })
  }

  const switchCats = txt => {
    jobLoader.setState({ ...jobLoader.state, categories: txt, isFirstLoad: true })
  }

  const switchSkills = txt => {
    jobLoader.setState({ ...jobLoader.state, skills: txt, isFirstLoad: true })
  }

  return (
    <div className="d-none d-lg-block">
      <ul
        id="list-homepage"
        className="list-group sidebar-homebage-ul mb-lg-4"
        style={{
          background: 'white',
          border: '1.4px solid #ccc',
          height: 'auto',
          borderRadius: 8,
          padding: 8,
          width: '100%',
        }}
      >
        <li className="list-group-item sidebar-homebage-ul-li" aria-current="true">
          <Link
            className=" list-group-item-action sidebar-homebage-ul-li-aa activeside"
            aria-current="true"
            style={{ fontSize: '16px', fontWeight: 'bold' }}
            onClick={() => switchJobs('My Feed')}
            to={''}
          >
            {t('My Feed')}
          </Link>
        </li>
        <ConfigProvider
          theme={{
            components: {
              Radio: {
                buttonSolidCheckedBg: 'linear-gradient(92.88deg, #13661E 9.16%, #8319cf 43.89%, #803ade 64.72%)',
                buttonSolidCheckedHoverBg: 'linear-gradient(92.88deg, #a32ed1 9.16%, #8b31cc 43.89%, #803ade 64.72%)',
              },
            },
          }}
        >
          <Radio.Group
            onChange={switchJobs}
            buttonStyle="solid"
            value={jobLoader?.state?.filter}
            style={{ marginLeft: 34, marginTop: 8 }}
          >
            <Space direction="vertical" align="center">
              <Radio.Button value={EJobFilter.RCMD}>{t('Best Matches')}</Radio.Button>
              <Radio.Button value={EJobFilter.RECENT}>{t('Recent')}</Radio.Button>
              <Radio.Button value={EJobFilter.OTHER}>{t('All')}</Radio.Button>
            </Space>
          </Radio.Group>
        </ConfigProvider>
      </ul>

      {/* {arr != null ? (
        <h5 className="mb-lg-2 display-inline-block end">
          {t("RecentSearch")}
        </h5>
      ) : null
      } */}
      {/* {arr?.slice().reverse()?.map((item, index) =>
        index >= arr.length - 4 ? (
          <ul
            className="list-group sidebar-homebage-ul mb-lg-3 btn"
            style={{ fontSize: "0.9em" }}
          >
            <li
              className="list-group-item sidebar-homebage-ul-li text-success "
              aria-current="true"

            >

              <a
                onClick={() => handleVal(item)}
                className=" list-group-item-action advanced-search-link text-jobsicker"
                aria-current="true"
              >

                {item}
              </a>
            </li>
          </ul>
        ) : null
      )} */}

      <ConfigProvider
        theme={{
          token: {
            colorBorder: '#13661E',
            colorText: '#0E4623',
            colorPrimary: '#13661E',
          },
        }}
      >
        <div
          style={{
            background: 'white',
            border: '1.4px solid #ccc',
            height: 'auto',
            borderRadius: 8,
            padding: 8,
            width: '100%',
          }}
        >
          <h5 className="mb-lg-2 display-inline-block end">{t('My Category')}</h5>
          <Checkbox.Group onChange={c => switchCats(c)}>
            <Space direction="vertical" style={{ fontSize: '0.9em' }}>
              {freelancer?.preferJobType?.map((jobType, ix) => (
                <Checkbox value={jobType?._id} key={jobType?._id}>
                  {jobType?.name}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
        <div
          style={{
            background: 'white',
            border: '1.4px solid #ccc',
            height: 'auto',
            borderRadius: 8,
            padding: 8,
            width: '100%',
            marginTop: 24,
          }}
        >
          <h5 className="mb-lg-2 display-inline-block end">{t('My Skills')}</h5>
          <Checkbox.Group onChange={s => switchSkills(s)}>
            <Space direction="vertical" style={{ fontSize: '0.9em' }}>
              {freelancer?.skills?.map((skill, ix) => (
                <Checkbox key={skill?.skill?._id} value={skill?.skill?._id}>
                  {pickName(skill?.skill, lang)}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
      </ConfigProvider>
    </div>
  )
}
