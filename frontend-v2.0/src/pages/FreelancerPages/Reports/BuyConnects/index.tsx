/* eslint-disable */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Divider, InputNumber, Radio, RadioChangeEvent, Select, Space } from 'antd'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { userStore } from 'src/Store/user.store'
import { useSubscription } from 'src/libs/global-state-hook'
import { EPaymentMethod, EPaymentPurpose } from 'src/utils/enum'
import { currencyFormatter } from 'src/utils/helperFuncs'
import CustomButtonwithoutbackground from '../../../../Components/FreelancerComponents/CustomButtonwithoutbackground'
import { PayPalButton } from 'react-paypal-button-v2'
import { buyjobsPoints } from 'src/api/payment-api'
import { BlueColorButton } from 'src/Components/CommonComponents/custom-style-elements/button'
import toast from 'react-hot-toast'
import { appInfoStore } from 'src/Store/commom.store'

export default function BuyConnects() {
  const { t } = useTranslation(['main'])
  const { state, setState } = useSubscription(userStore)

  const { state: appInfo } = useSubscription(appInfoStore)

  const amountRef = useRef(null)

  const [paymentType, setPaymentType] = useState(EPaymentMethod.PAYPAL)

  const [buy, setBuy] = useState(0)
  const [items, setItems] = useState([3, 5, 10, 20, 40, 60])
  const [newOptions, setOptions] = useState(0)
  const inputRef = useRef<any>(null)

  const onOptionChange = v => {
    setOptions(Number(v))
  }

  const handleChangeBuy = v => {
    setBuy(v)
  }

  const handleBuySick = () => {
    return buyjobsPoints(
      {
        from: state?._id || state?.id,
        isToAdmin: true,
        purpose: EPaymentPurpose.BUYSICK,
        amount: buy * appInfo?.pointsCost,
        paymentMethod: paymentType,
        note: `User {${state.name}} ${t('Buy jobsPoints Payment', { amount: buy })}`,
      },
      buy,
      state?._id || state?.id
    )
  }

  const handleBuyViaBalance = () => {
    const amount = buy * appInfo?.pointsCost
    if (amount > (state?.balance || 0)) {
      return toast.error(`${t("You Don't Have Enough")} ${t('Balance')}`)
    }
    handleBuySick()
      .then(res => {
        console.log('after buy', res.data)
        toast.success(`${t('Successfully')} ${t('Buy jobsPoints Payment', { amount: buy })} ${t(
          'Pay a fixed price'
        )} ${currencyFormatter(amount)}
      ${t('Pay by your JobShare Balance, your balance:')} {${currencyFormatter(state?.balance)}`)
        setState({ ...state, jobsPoints: state?.jobsPoints + res.data?.jobsPoints, balance: state?.balance - amount })
      })
      .catch(err => {
        return toast.error(`${t('Buy jobsPoints Payment', { amount: buy })} ${t('Fail')}`)
      })
  }

  const handleBuyViaPaypal = () => {
    const amount = buy * appInfo?.pointsCost
    handleBuySick()
      .then(res => {
        console.log('after buy', res.data)
        toast.success(`${t('Successfully')} ${t('Buy jobsPoints Payment', { amount: buy })} ${t(
          'Pay a fixed price'
        )} ${currencyFormatter(amount)}
      ${t('Pay via PayPal(recommened)')}`)
        setState({ ...state, jobsPoints: state?.jobsPoints + res.data?.jobsPoints })
      })
      .catch(err => {
        return toast.error(`${t('Buy jobsPoints Payment', { amount: buy })} ${t('Fail')}`)
      })
  }

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: t('Buy jobsPoints Payment', { amount: buy }),
          amount: {
            currency_code: 'USD',
            value: (((buy || 1) * appInfo?.pointsCost) / 24000).toFixed(2).toString(),
          },
        },
      ],
    })
  }

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    setItems([...items, newOptions || items[5] + 1])
    setOptions(0)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }
  return (
    <div style={{ padding: '20px 100px' }}>
      <Card
        title={
          <h2 id="heading" className="mb-4 pt-3 fs-1 fw-bold ">
            {t('Buy jobsPoints')}
          </h2>
        }
      >
        <div className="d-flex">
          <h4 className="mb-0 pt-3 para ">{t('AvalableSicks')}: </h4>
          <h4 className="mb-0 pt-3 para" style={{ color: '#6058c4', paddingLeft: 4 }}>
            {state?.jobsPoints}
          </h4>
        </div>
        <div className="row">
          <h4 className="mb-0 pt-3 d-flex" style={{ alignItems: 'center', gap: 8 }}>
            {t('Select the amount to buy')}:{' '}
            <Select
              ref={amountRef}
              style={{ width: 269 }}
              placeholder="Select jobsPoints Pack"
              onChange={v => handleChangeBuy(v)}
              dropdownRender={menu => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <InputNumber
                      ref={inputRef}
                      addonAfter={<> jobsPoints</>}
                      defaultValue={1}
                      value={newOptions}
                      onKeyPress={event => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault()
                        }
                      }}
                      onKeyDown={e => e.stopPropagation()}
                      onChange={(v: any) => onOptionChange(v)}
                      min={0}
                      controls
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                      {t('Add')}
                    </Button>
                  </Space>
                </>
              )}
              options={items.map(item => ({
                label: `${item} jobsPoints ~ ${currencyFormatter(item * appInfo?.pointsCost)}`,
                value: item,
              }))}
            />
          </h4>
        </div>

        <Space align="baseline" className="mb-0 pt-3" style={{ width: '100%' }}>
          <h4 className="para">{t('Your account will be charged')}:</h4>
          <span style={{ fontSize: 18, fontWeight: 600 }}>{currencyFormatter(buy * appInfo?.pointsCost)}</span>
        </Space>

        <Space align="baseline" className="mb-0 pt-3" style={{ width: '100%' }}>
          <h4 className="para">{t('Your new jobsPoints balance will be')}:</h4>
          <span style={{ fontSize: 18, fontWeight: 600 }}>{state?.jobsPoints + buy} jobsPoints</span>
        </Space>

        <Space align="baseline" className="mb-0 pt-3" style={{ width: '100%' }}>
          <h4 className="para">{t('These Sickpoints will expire on')}:</h4>
          <div style={{ fontSize: 16, fontWeight: 600 }}>03/17/2026</div>
        </Space>

        {/* <h4 className="mt-3 mb-2 para">
          <label htmlFor="promoCodeInput" className="up-label mb-0">
            Promo code
          </label>
        </h4>
        <form>
          <div className="row mb-2">
            <div className="col-sm-7 col-md-5 col-lg-5 col-xl-5 mt-10">
              <input
                id="promoCodeInput"
                type="text"
                placeholder="Enter code"
                maxLength={30}
                autoComplete="off"
                aria-describedby="promoInputError"
                aria-required="true"
                className="up-input form-control promo-code"
              />
            </div>
            <div className="col-sm-5 col-md-7 col-lg-7 col-xl-7 mt-10">
              <CustomButtonwithoutbackground headers=" Apply" />
            </div>
          </div>
          <div></div>
        </form> */}
        <div className="mt-3 pt-10 mb-3 text-muted">
          {/* <span className="d-none-mobile-app">This bundle of Connects will expire 1 year from today.</span>
          Unused Connects rollover to the next month (maximum of 200).
          <a
            aria-label="Learn more about Connects"
            href="https://support.upwork.com/entries/61069964"
            rel="noopener noreferrer"
            target="_blank"
            className="d-none-mobile-app"
            style={{ color: '#6058c4', textDecoration: 'none' }}
          >
            Learn more
          </a> */}
        </div>
        <div className="mt-20 mb-3 text-muted d-none-mobile-app">
          You're authorizing JobShare to charge your account. If you have sufficient funds, we will withdraw from your
          account balance. If not, the full amount will be charged to your primary billing method.
          <a
            aria-label="Learn more about billing methods"
            href="https://support.upwork.com/entries/61070164"
            rel="noopener noreferrer"
            target="_blank"
            style={{ color: '#6058c4', textDecoration: 'none' }}
          >
            Learn more
          </a>
        </div>
        <div className="mb-5 mt-4 py-4 position-relative">
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              height: '100%',
              width: '97%',
              background: 'rgba(89, 47, 214, .4)',
              zIndex: 1000,
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              display: buy ? 'none' : 'flex',
            }}
          >
            <h2
              style={{
                fontWeight: 600,
                marginBottom: 28,
                color: 'white',
              }}
            >
              {t('Select the amount to buy')}
            </h2>
          </div>
          <div className="row ms-md-4" style={{ opacity: !!buy ? 1 : 0.4 }}>
            <h2>{t('Payment method')}</h2>
            <div className="col-md-9 col-12 col-sm-8 mb-4">
              <Radio.Group
                onChange={(e: RadioChangeEvent) => {
                  console.log('radio checked', e.target.value)
                  setPaymentType(e.target.value)
                }}
                value={paymentType}
              >
                <Space direction="vertical">
                  <Radio style={{ fontSize: 18 }} value={EPaymentMethod.PAYPAL}>
                    {t('Pay via PayPal(recommened)')}
                  </Radio>
                  {/* <Radio style={{ fontSize: 18 }} value={EPaymentMethod.BALANCE}>
                    {t('Pay by your JobShare Balance, your balance:')}
                    {` (${currencyFormatter(state?.balance)})`}
                  </Radio> */}
                  <Radio style={{ fontSize: 18 }} value={3} disabled>
                    {t('Pay via VNPay(maintain😓)')}
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
            <div className="col-md-3 col-sm-4  d-flex justify-content-center mb-2">
              {paymentType === EPaymentMethod.BALANCE ? (
                <BlueColorButton onClick={handleBuyViaBalance}>{t('Buy jobsPoints')}</BlueColorButton>
              ) : (
                <PayPalButton
                  style={{ color: 'silver' }}
                  createOrder={createOrder}
                  onSuccess={(details, data) => {
                    handleBuyViaPaypal()
                  }}
                ></PayPalButton>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
