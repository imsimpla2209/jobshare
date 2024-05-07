/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { locationStore } from "src/Store/commom.store";
import { useSubscription } from "src/libs/global-state-hook";
import { EStep, profileFreelancerData, profileStepStore, userData } from "src/pages/FreelancerPages/CreateProfile";
import { EComplexityGet } from "src/utils/enum";
import { currencyFormatter, fetchAllToCL } from "src/utils/helperFuncs";
import img from "../../../assets/svg/createProfileSubmit.svg";
import { userStore } from "src/Store/user.store";
import { switchToFreelancer, updateUser } from "src/api/user-apis";
import { useState } from "react";
import { updateFreelancer, updateProfileFreelancer } from "src/api/freelancer-apis";
import toast from "react-hot-toast";
import { cloneDeep } from "lodash";
import { getMe } from "src/api/auth-apis";



export default function CreateProfileSubmit() {
  const { t } = useTranslation(['main']);
  const { state } = useSubscription(profileFreelancerData);
  const userProfile = useSubscription(userData).state;
  const { setState: setUser, state: user } = useSubscription(userStore);
  const { setState: setFreelancer } = useSubscription(userStore);
  const locations = useSubscription(locationStore).state;
  const profileStep = useSubscription(profileStepStore).setState
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams()
  const isReview = searchParams.get('isReview')

  const submitProfile = async () => {
    setLoading(true)
    try {
      let avatar = userProfile?.avatar;
      if (userProfile?.avatar !== user?.avatar) {
        const fileNameList = await fetchAllToCL(userProfile?.avatar)
        avatar = fileNameList[0]
      }
      await updateUser({ avatar, phone: userProfile.phone }, user?.id).then(() => {

      })
      let skillList = cloneDeep(state?.skills)

      if (state?.skills[0]?.skill?._id) {
        skillList = state.skills.map((s: any) => {
          return { skill: s?.skill?._id, level: s.level }
        })
      }

      let catList = cloneDeep(state?.preferJobType)

      if (state?.preferJobType[0]?._id) {
        catList = state.skills.map((s: any) => {
          return s?._id
        })
      }

      await updateProfileFreelancer({
        title: state?.title
        , intro: state?.intro
        , skills: skillList
        , preferJobType: catList
        , currentLocations: state?.currentLocations
        , available: state?.available
        , expertiseLevel: Number(state?.expertiseLevel)
        , education: state?.education
        , historyWork: state?.historyWork
        , englishProficiency: state?.englishProficiency
        , otherLanguages: state?.otherLanguages
        // , profileCompletion: state?.profileCompletion
        , expectedAmount: state?.expectedAmount
        , expectedPaymentType: state?.expectedPaymentType
      })

      toast.success(`Profile updated successfully/ It will navigate you back to homepage in 2 seconds 😉`);
      switchToFreelancer().then((res) => {
        setFreelancer(res?.data)
      })
      getMe().then((res) => {
        setUser(res?.data)
      })
      setTimeout(() => navigate('/'), 3000)
    } catch (error) {
      toast.error('Something went wrong when updating your profile')
    } finally {
      setLoading(false)
    }
  }

  const editProfile = () => {
    profileStep({ step: EStep.START })
    setSearchParams('')
  }

  return (
    <>
      <section className="bg-white border rounded mt-3 pt-4">
        <div className="border-bottom ps-4 pb-3">
          <h4>{t("Review profile")}</h4>
        </div>
        <div className="px-4 my-4 row">
          <div className="col-md-9">
            <p>
              <strong>Looking good, {state?.name?.slice(0, state?.name?.indexOf(' '))}!</strong>
            </p>
            <p className="my-4 text-truncate">
              {t("Make any necessary edits and then submit your profile. You can still edit it after you submit it.")}
            </p>
          </div>
          <div className="col-md-3 text-center">
            <img src={img} className="w-50" alt="" />
          </div>
        </div>
      </section>
      <section className="my-5">
        <div className="row">
          <div className="col-md-9">
            <div className="bg-white border rounded p-4">
              <div className="d-flex">
                <div style={{ width: "100px", height: "100px" }}>
                  <img
                    src={user?.avatar}
                    className="rounded-circle w-100 h-100"
                    alt=""
                  />
                </div>
                <div className="mt-3 ms-3">
                  <h4>
                    {state?.name}
                  </h4>
                  <span className="fw-bold text-muted" style={{ display: 'flex', marginTop: 2 }}>
                    <i className="fas fa-map-marker-alt" />
                    {
                      state?.currentLocations?.map(l => (
                        <span key={l} style={{ marginLeft: 8 }}>
                          {locations?.find(s => s?.code === l?.toString())?.name} |
                        </span>
                      ))
                    }
                  </span>
                  <p>{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="mt-5">
                <p><i className="fas fa-phone-alt" />  {userProfile?.phone}</p>
                <h4>{state?.title}</h4>
                <p>{state?.intro}</p>
              </div>
            </div>
            <div className="bg-white border rounded p-4 mt-5">
              <div className="border-bottom pb-3">
                <h4 className="text-muted">{t("Employment history")}</h4>
              </div>
              {state?.historyWork?.map((e, ix) =>
                <div className="mt-4" key={ix}>
                  <h4>{e?.jobName}</h4>
                  <h5>{e?.jobTitle}</h5>
                  {e?.stillWork ? <p>Still Work</p> : null}
                </div>
              )}
            </div>
            <div className="bg-white border rounded p-4 mt-5">
              <div className="border-bottom pb-3">
                <h4 className="text-muted">{t("Education")}</h4>
              </div>
              <div className="mt-4">
                <h4>{state?.education?.school}</h4>
                <h5>{state?.education?.areaOfStudy}</h5>
                <h6>{state?.education?.degree}</h6>
                <h6>{state?.education?.gradYear}</h6>
              </div>
            </div>
          </div>
          <div className="col-md-3 ">
            <div className="border-top" style={{ backgroundColor: "#FFFFFF", padding: 16, borderRadius: 8 }}>
              <div className="border-bottom py-4">
                <h4 className="text-muted">{t("Location")}</h4>
                {
                  state?.currentLocations?.map(l => (
                    <span key={l} style={{ marginLeft: 8 }}>
                      {locations?.find(s => s?.code === l?.toString())?.name} |
                    </span>
                  ))
                }
              </div>
              <div className="mt-5">
                <h4 className="fw-bold">{t("Languages")}</h4>
                <p>{t("English")} {" : "} {state?.englishProficiency}</p>
                {state?.otherLanguages?.map((langItem, ix) => <p key={ix}>
                  {[langItem?.language, ' ', ':', ' ', langItem?.langProf]}
                </p>)}
              </div>
              <div className="border-top pt-5">
                <h5>
                  <span className="text-muted">Hourly rate: </span>
                  {currencyFormatter(state?.expectedAmount)} \ {t(state?.expectedPaymentType)}
                </h5>
                <h5 className="my-3">
                  <Space size="small" wrap>
                    <div className='fw-bold me-1 text-muted' style={{ fontSize: "0.9em" }}>{t("Categories") + ":"}</div>
                    {state?.preferJobType?.map((c, index) => (
                      <div key={index}>
                        <Link to={`/search?categoryId=${c?._id}`}
                          key={index}
                          type="button"
                          className="btn text-light btn-sm rounded-pill cats mx-1"
                        >
                          {c?.name}
                        </Link>
                      </div>
                    ))}
                  </Space>
                </h5>
                <h5 className="my-">
                  <span className="text-muted">Experience level: </span>
                  {t(EComplexityGet[state?.expertiseLevel])}
                </h5>
              </div>
            </div>
          </div>
          <div className="my-3 text-start mt-5">
            {
              !isReview && <button className="btn" onClick={() => profileStep({ step: EStep.PHONENUMBER })
              }>
                {t("Back")}
              </button>
            }
            <Button loading={loading} className="bg-jobsicker px-5" onClick={isReview ? () => editProfile() : () => submitProfile()}>
              {isReview ? t("Edit Profile") : 'Submit Profile'}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}