/* eslint-disable */
import { Carousel } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import getsomemoney from 'src/assets/img/getsomemoney.gif'
import conversation from 'src/assets/img/confidence.gif'
import carousel1 from 'src/assets/videos/carousel1.gif'

const contentStyle: React.CSSProperties = {
  height: '100%',
  lineHeight: '160px',
  textAlign: 'center',
  borderRadius: 14,
  display: 'flex',
}

export default function HeadOfCenterSection() {
  const { t } = useTranslation(['main'])
  return (
    <div className="">
      {/* <div className="list-group-item my-lg-2 pt-3 rounded text-center ">
        <h6>
          <a href="#" className="text-decoration-none" style={{ color: '#3CAF24' }}>
            {" "}
            {t("There are new jobs. Click to see them")}
          </a>
        </h6>
      </div> */}
      <div className="mb-3 d-none d-lg-block">
        <Carousel
          autoplaySpeed={4000}
          effect="fade"
          autoplay
          style={{
            borderRadius: 20,
          }}
        >
          <div>
            <div
              style={{
                ...contentStyle,
                background: 'linear-gradient(92.88deg, #fff0c2, #ffb8fd)',
                justifyContent: 'space-around',
                padding: 4,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignContent: 'start',
                  marginLeft: 14,
                }}
              >
                <h3 style={{ fontSize: 23, fontWeight: 600, color: '#fc2683' }}>{t('HOT!!! This June')}</h3>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#6e6247', lineHeight: 2 }}>
                  {t('Start launching a money-making contest at home for girls')}
                </p>
              </div>
              <img src={carousel1} alt="this slowpoke moves" width="227" />
            </div>
          </div>
          <div>
            <div
              style={{
                ...contentStyle,
                background: 'linear-gradient(92.88deg, #245b88, #3e74e0)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                padding: 28,
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'start',
                alignItems: 'center',
                color: '#cccccc',
              }}
            >
              <img src={conversation} alt="this slowpokess moves" width="180" />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignContent: 'start',
                  marginLeft: 14,
                }}
              >
                <h3 style={{ fontSize: 23, fontWeight: 600, color: '#e7e6e6' }}>{t('Engage with confidence')}</h3>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                ...contentStyle,
                background: 'linear-gradient(92.88deg, #23cf79, #38d6c9)',
                justifyContent: 'space-around',
                padding: 4,
                alignItems: 'center',
                height: '100%',
              }}
            >
              <img src={getsomemoney} alt="this slowpokess moves" width="227" />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignContent: 'start',
                  marginLeft: 14,
                }}
              >
                <h3 style={{ fontSize: 23, fontWeight: 600, color: '#295b99' }}>{t('Why so serious')}</h3>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#11403d', lineHeight: 2 }}>
                  {t("If you're good at something, never do it for free.")}
                </p>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  )
}
