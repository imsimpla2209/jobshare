import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import img7 from '../../../assets/img/moneyimg2.jpg'
import img6 from '../../../assets/img/moneyimg1.webp'
import img2 from '../../../assets/svg/Airbnb_Logo.svg'
import img1 from '../../../assets/svg/Microsoft_logo.svg'
import img4 from '../../../assets/svg/ge.svg'
import img3 from '../../../assets/svg/godaddy.d9459f1.svg'
import './HomeFirstSection.css'
export default function HomeFirstSection() {
  const { i18n, t } = useTranslation(['main'])
  const lang = i18n.language
  return (
    <section style={{ marginTop: '10%' }} className="overflow-hidden">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <div>
              <p className="my-5 h1">{t('Theworldsworkmarketplace')}</p>
              <p className="fs-3 fs-p-cn">{t('Engagethelargestnetwork')}</p>
              <div className="my-5">
                <Link className="btn py-3 px-4 me-4 fs-btns-cn text-decoration-none" to="/freelancer">
                  {t('FindFreelancer')}
                </Link>
                <Link className={`btn py-3 px-4 border ${lang === 'vi' && 'fs-6'}`} to="/find-work">
                  {t('FindWork')}
                </Link>
              </div>
              <ul className="d-flex justify-content-between p-0">
                <li>
                  <img src={img1} width="70" height="26" />
                </li>
                <li>
                  <img src={img2} width="70" height="26" />
                </li>
                <li>
                  <img src={img3} width="70" height="26" />
                </li>
                <li>
                  <img src={img4} width="70" height="26" />
                </li>
                {/* <li><img src={img5} width="70" height="26" /></li> */}
              </ul>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="position-relative">
              <div className="w-75">
                <img className="w-75" src={img6} />
              </div>
              <div className="w-75 position-absolute fs-abs-img-cn">
                <img className="w-75" src={img7} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
