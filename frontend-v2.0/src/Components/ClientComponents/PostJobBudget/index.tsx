import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StepContext } from 'src/pages/ClientPages/PostJop'
import { postJobSubscribtion } from '../PostJobGetStarted'
import './style.css'
import { EPaymenType } from 'src/utils/enum'
import { IJobPayment } from 'src/types/job'
import { InputNumber, Select } from 'antd'
import { useSubscription } from 'src/libs/global-state-hook'
import { currencyFormatter } from 'src/utils/helperFuncs'

const paymentTypeOptions = [
  { label: 'per task', type: 'PerTask' },
  { label: 'per hour', type: 'PerHour' },
  { label: 'per week', type: 'PerWeek' },
  { label: 'per month', type: 'PerMonth' },
  { label: 'in total', type: 'WhenDone' },
]

export default function Postbudget({ setBtns, btns }) {
  const { setStep } = useContext(StepContext)
  const {
    state: { payment, budget },
  } = useSubscription(postJobSubscribtion, ['payment', 'budget'])

  const { t } = useTranslation(['main'])
  const [job, setJob] = useState<{ payment: IJobPayment; budget: number }>({
    payment,
    budget,
  })

  const addData = () => {
    postJobSubscribtion.updateState({
      ...job,
    })

    setBtns({ ...btns, review: false })
    setStep('review')
  }

  const handleChangeAmount = (amount: string) => {
    console.log(amount)
    setJob({ ...job, payment: { ...job.payment, amount: parseInt(amount) } })
  }
  const handleChangeBudget = (amount: string) => {
    setJob({ ...job, budget: parseInt(amount) })
  }

  const selectAfter = (
    <Select
      defaultValue={EPaymenType.PERHOURS}
      value={job.payment.type}
      style={{ width: 120 }}
      onChange={(type: EPaymenType) => {
        setJob({ ...job, payment: { ...job.payment, type } })
      }}
    >
      {paymentTypeOptions.map(option => (
        <Select.Option value={option.type}>{option.label}</Select.Option>
      ))}
    </Select>
  )
  return (
    <>
      <section className=" bg-white border rounded pt-4">
        <div className="border-bottom ps-4">
          <h4>{t('Budget')}</h4>
          <p>{t('Step 6 of 7')}</p>
        </div>
        <div className="px-4 mt-3 mb-3">
          <p className="fw-bold mt-2">{t('How would you like to pay your freelancer?')}</p>
          <div style={{ width: '100%' }}>
            <InputNumber
              addonBefore="VND"
              addonAfter={selectAfter}
              onInput={handleChangeAmount}
              value={job.payment.amount}
            />
          </div>
          <p className="fw-bold mt-2">{t('Enter your specific budget:')}</p>
          <div style={{ width: '100%' }}>
            <InputNumber addonBefore="VND" min={1} onInput={handleChangeBudget} value={job.budget} />
          </div>
        </div>
        {/* {job.payment?.type === EPaymenType.WHENDONE ? (
          <div className="px-4 my-3">
            <p className="fw-bold mt-2">{t('Do you have a specific budget?')}</p>
            <div className="me-5 mt-2 position-relative jd-inp-cn w-25">
              <div className="position-absolute">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <input
                className="form-control text-end shadow-none"
                onInput={getData}
                name="budget"
                type="number"
                placeholder="00.00"
              />
            </div>
          </div>
        ) : (
          job.payment?.type === EPaymenType.PERHOURS && (
            <div className="px-4 my-3">
              <p className="fw-bold mt-2">{t('Set your own hourly rate')}</p>
              <div className="me-5 mt-2 position-relative jd-inp-cn w-25">
                <div className="position-absolute">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <input
                  className="form-control text-end shadow-none"
                  onInput={getData}
                  name="budget"
                  type="number"
                  placeholder="00.00"
                />
                <span className="position-absolute">/hr</span>
              </div>
            </div>
          )
        )} */}
      </section>

      <section className="bg-white border rounded mt-3">
        <div className="ps-4 my-3">
          <button className="btn" onClick={() => setStep('visibility')}>
            <span className="btn border text-success me-4 px-5">{t('Back')}</span>
          </button>
          <button className={`btn ${!job.payment.amount ? 'disabled' : ''}`}>
            <span className="btn bg-jobsicker px-5" onClick={addData}>
              {t('Next')}
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
