/* eslint-disable jsx-a11y/alt-text */

import verify from "../../assets/svg/verifyEmail.svg";
// import { auth } from "../../firebase";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import Loader from "src/Components/SharedComponents/Loader/Loader";
import { userStore } from "src/Store/user.store";
import { verifyEmail } from "src/api/auth-apis";
import { useSubscription } from "src/libs/global-state-hook";
import { EUserType } from "src/utils/enum";

export default function EmailVerified() {
  const navigate = useNavigate();
  const { t } = useTranslation(['main'])
  const user = useSubscription(userStore).state
  const userSet = useSubscription(userStore).setState
  const [searchParams, setSearchParams] = useSearchParams()
  const [isVerify, setVerify] = useState(false)
  const [loading, setLoading] = useState(false)
  const tokenParam = searchParams.get('token')
  useEffect(() => {
    if (tokenParam) {
      console.log('token parameter', tokenParam)
      verifyEmail(tokenParam).then((res) => {
        setVerify(true)
      }).catch((err) => {
        setVerify(false)
      }).finally(() => {
        setSearchParams('')
      })
    }
  }, [user, tokenParam]);


  return (
    <div className="text-center" style={{ margin: "67px 12px", background: "white", padding: 24 }}>
      {
        loading ? <Loader /> : <>
          {isVerify ? <>
            <img src={verify} style={{ width: "150px" }} />
            <h3 className="my-3">{t("Email is verfied successfully")}</h3>
            <button className="btn bg-jobsicker"
              onClick={() => user.lastLoginAs === EUserType.FREELANCER ? navigate("/create-profile") : navigate("/post-job")} >
              {user.lastLoginAs === EUserType.FREELANCER ? t("CompleteProfile") : t("Post a job")}
            </button>
            <br />
          </> : <>
            <img src={verify} style={{ width: "150px" }} />
            <h3 className="my-3">{t("Your mail is not verified")}</h3>
            <br />
          </>}
        </>
      }
    </div>
  );
}
