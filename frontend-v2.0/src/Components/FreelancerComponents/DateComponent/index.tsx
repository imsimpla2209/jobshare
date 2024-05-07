/* eslint-disable */
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function DateComponent() {
  const { t } = useTranslation(['main'])
  return (
    <div className="Date">
      <form action="#">
        <a
          className="btn btn-defualt  border rounded text-start"
          data-bs-toggle="collapse"
          href="#collapseExample2"
          role="button"
          aria-expanded="false"
          aria-controls="collapseExample"
          style={{ width: '100%' }}
        >
          {t('mm/dd/yyyy')}
        </a>
        <div className="collapse" id="collapseExample2">
          <div className="dropdown2" style={{ width: '100%' }}>
            <input type="date" id="birthday1" name="birthday1" style={{ width: '40%' }} />
            <input type="date" id="birthday2" name="birthday2" style={{ width: '40%' }} />
            <button
              className="btn -btn-default btn-sm border rounded"
              type="button"
              style={{
                background: 'linear-gradient(92.88deg, #12582D 9.16%, #316027 43.89%, #1F8346 64.72%)',
                color: 'white',
                width: '40px',
                height: '33px',
              }}
            >
              {t('go')}
            </button>
            <button
              className="btn btn-default dropdown-toggle"
              type="button"
              id="dropdownMenuButton2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: '80%' }}
            >
              {t('choose the date')}
            </button>
            <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton2" style={{ width: '80%' }}>
              <li>
                <a className="dropdown-item " href="#">
                  current activity
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  This week
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  last Week
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Statement- Mar21
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Statement- Feb21
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Statement- Jan21
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Statement- Dec21
                </a>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}
