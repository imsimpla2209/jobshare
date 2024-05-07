import { useTranslation } from 'react-i18next'
import { useSubscription } from 'src/libs/global-state-hook'
import { EStep, profileStepStore } from 'src/pages/FreelancerPages/CreateProfile'

export default function CreateProfileGetStart() {
  const profileStep = useSubscription(profileStepStore).setState
  const { t } = useTranslation(['main'])
  return (
    <section className=" bg-white border rounded mt-3 pt-4">
      <div className="border-bottom ps-4">
        <h4>{t('Fill out your profile to apply')}</h4>
      </div>
      <div className="px-4 mt-3">
        <p className="fw-bold mt-2">
          {t('To provide a high quality experience to all customers, admission to JobShare is highly competitive.')}
        </p>
        <div className="my-4">
          <p>{t("Here's how it works")}:</p>
          <ol className="list">
            <li>{t('Fill out your profile thoroughly and accurately')}</li>
            <li>{t('Submit your profile')}</li>
            <li>{t("You'll receive an email within 24 hours to let you know if you were accepted")}</li>
          </ol>
          <p>
            {t(
              'We are currently experiencing a high number of applications. Create a stand-out profile to increase your chances of getting approved!'
            )}
          </p>
        </div>
        <div className="my-4 text-end">
          <button
            className="btn bg-jobsicker"
            onClick={() => {
              profileStep({ step: EStep.CATEGORY })
            }}
          >
            {t('Start')}
          </button>
        </div>
      </div>
    </section>
  )
}
