/* eslint-disable */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { updateUserData } from './../../../Network/Network'
import { useTranslation } from 'react-i18next'
import { currencyFormatter } from 'src/utils/helperFuncs'

export default function SubmitProposalHourly({ rate, setrate, currentValue }) {
  const { t } = useTranslation(['main'])
  const rateNum = e => {
    rate = e.target.value
    setrate(rate)
  }

  return (
    <section className=" bg-white mt-3 pt-4">
      <div className="ps-1 pb-3">
        <h4>{t("What is the rate you'd like to bid for this job?(Optional)")}</h4>
      </div>
      <div className="p-4 my-3">
        <div>
          <div className="mb-4 d-flex justify-content-between  border-bottom">
            <div>
              <span>
                <strong>
                  {t('Hourly Rate')} {`(${t('Original')}/${currencyFormatter(currentValue)})`}
                </strong>
              </span>
              <p>{t('Total amount the client will see on your proposal')}</p>
            </div>
            <div className="me-5 mt-2 position-relative jd-inp-cn">
              <div className="position-absolute">VND</div>
              <input
                className="form-control text-end"
                type="number"
                defaultValue={rate}
                placeholder="00.00"
                onInput={rateNum}
              />
              <span className="position-absolute">/hr</span>
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <div>
              <span className="w-100">
                <strong>JobShare Service Fee</strong>
                <a className="upw-c-cn fw-normal ms-3" href="">
                  Explain this
                </a>
              </span>
            </div>
            <div className="me-5 mb-3 d-flex">
              <span style={{ position: 'relative', right: '148px' }}>VND</span>
              <span className="text-end">{(rate * 20) / 100}</span>
              <span style={{ position: 'relative', right: '-30px' }}>/hr</span>
            </div>
          </div>
          <div className="mb-3 d-flex  justify-content-between border-top pt-3">
            <div>
              <span>
                <strong>{t("You'll Receive")}</strong>
              </span>
              <p className="w-75">{t("The estimated amount you'll receive after service fees")}</p>
            </div>
            <div className="me-5 mt-2 position-relative jd-inp-cn">
              <div className="position-absolute">VND</div>
              <input className="form-control text-end" type="number" placeholder="00.00" value={(rate * 80) / 100} />
              <span className="position-absolute">/hr</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
