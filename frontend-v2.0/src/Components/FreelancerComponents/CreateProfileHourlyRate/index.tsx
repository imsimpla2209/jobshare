/* eslint-disable */
import { useState } from 'react'
import { useSubscription } from 'src/libs/global-state-hook'
import { EStep, profileFreelancerData, profileStepStore } from 'src/pages/FreelancerPages/CreateProfile'
import './CreateProfileHourlyRate.css'
import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import { EPaymenType } from 'src/utils/enum'

export default function CreateProfileHourlyRate() {
  const { setState, state } = useSubscription(profileFreelancerData)
  const [rate, setRate] = useState(state?.expectedAmount || 0)
  const [type, setType] = useState(state?.expectedPaymentType || EPaymenType.PERHOURS)
  const profileStep = useSubscription(profileStepStore).setState

  const { t } = useTranslation(['main'])

  const rateNum = ({ target }) => {
    setRate(parseInt(target.value))
  }
  const addRate = () => {
    console.log(rate)
    setState({ ...state, expectedAmount: rate, expectedPaymentType: type, profileCompletion: 60 })
    profileStep({ step: EStep.TITLEANDOVERVIEW })
  }
  return (
    <section className=" bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4 pb-3">
        <h4>{t('Expected Amount')}</h4>
      </div>
      <div className="p-4 my-3">
        <p>
          Clients will see this rate on your profile and in search results once you publish your profile. You can adjust
          your rate every time you submit a proposal.
        </p>
        <div>
          <div className="mb-3 d-flex justify-content-between">
            <div>
              <span>
                <strong>{t('Payout Type')}</strong>
                <Select
                  onChange={v => setType(v)}
                  defaultValue={type}
                  style={{ width: 170 }}
                  bordered={false}
                  options={Object.keys(EPaymenType).map(k => {
                    return { value: EPaymenType[k], label: t(EPaymenType[k]) }
                  })}
                />
              </span>
              <p>Total amount the client will see</p>
            </div>
            <div className="me-5 mt-2 position-relative jd-inp-cn">
              <div className="position-absolute">
                <i>VND</i>
              </div>
              <input
                defaultValue={rate}
                className="form-control text-end"
                type="number"
                placeholder="00.00"
                onInput={rateNum}
              />
              {/* <span className="position-absolute">/hr</span> */}
            </div>
          </div>
          <div className="mb-3 d-flex justify-content-between border-top pt-3">
            <div>
              <span>
                <strong>JobShare Service Fee</strong>
                <a className="upw-c-cn fw-normal ms-3" href="">
                  Explain this
                </a>
              </span>
              <p className="w-75">
                The JobShare Service Fee is 10% when you begin a contract with a new client. Once you bill over $500
                with your client, the fee will be 5%.
              </p>
            </div>
            <div className="me-5 mt-4 d-flex">
              <span style={{ position: 'relative', right: '148px' }}>
                <i>VND</i>
              </span>
              <span className="text-end">{(rate * 10) / 100}</span>
              {/* <span style={{ position: "relative", right: "-30px" }}>/hr</span> */}
            </div>
          </div>
          <div className="mb-3 d-flex justify-content-between border-top pt-3">
            <div>
              <span>
                <strong>You'll Receive</strong>
              </span>
              <p>The estimated amount you'll receive after service fees</p>
            </div>
            <div className="me-5 mt-2 position-relative jd-inp-cn">
              <div className="position-absolute">
                <i>VND</i>
              </div>
              <input className="form-control text-end" type="number" placeholder="00.00" value={(rate * 90) / 100} />
              {/* <span className="position-absolute">/{t(type)}</span> */}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 my-3 pt-4 border-top d-flex justify-content-between">
        <button className="btn" onClick={() => profileStep({ step: EStep.LANGUAGE })}>
          {t('Back')}
        </button>
        <button className={`btn ${rate ? '' : 'disabled'}`}>
          <button className="btn bg-jobsicker px-5" onClick={addRate}>
            {t('Next')}
          </button>
        </button>
      </div>
    </section>
  )
}
