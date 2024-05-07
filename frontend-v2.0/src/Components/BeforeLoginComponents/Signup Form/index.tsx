
import { Button } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { loginGoogle } from "src/api/auth-apis";
import { checkUniqueField } from "src/api/user-apis";
import { ESignupStep } from "src/pages/BeforeLoginPages/SignUp";

export default function SignupForm({ setEmail, setStep, errorMessage, setErrorMessage }: any) {
  const { t }=useTranslation(['main']);
  const [loading, setLoading] = useState(false)
  const [email, setemail] = useState('')

  const getEmail = ({ target }) => {
    const checkErr = target.value === "" ? t("Email required") : !target.value.match(/^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)
    ? t("Please inter Valid Email") : null
    setErrorMessage(checkErr);
    if(checkErr) {
      return
    }
    setemail(target.value)
    setEmail(target.value)
  }

  const signUpContinue = async () => {
    setLoading(true);
    checkUniqueField({ email }).then((res) => {
      if(res.data) {
        return toast.error('Email already used!!')
      }
      setStep(ESignupStep.DETAIL)
    }).finally(() => {
      setLoading(false)
    })
  }

  const onLoginGoogle = async () => {
    const res = await loginGoogle()
    console.log(res)
  }

  const onEnter = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if(!errorMessage) {
        setStep(ESignupStep.DETAIL);
      }
    }
  }

  return (
    <div className="col-sm-12 col-md-6 mx-auto">
      <div className="shadow-sm p-3 mb-5 bg-white rounded mx-auto mt-5 w-100 border">
        <h4 data-v-904d5b16 className="text-center m-0">
          <span style={{ fontFamily: "serif", fontWeight: "bold" }}>
          {t("Get your free account")}
          </span>
        </h4>
        <div className="google-btn  gap-2 mx-auto mt-3 rounded hitbtn-class" onClick={() => onLoginGoogle()}>
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
          </div>
          <div className="text-justify ">
            <p
              className="text-center text-white"
              style={{ paddingTop: ".3em" }}
            >
              {t("Continue with Google")}
            </p>
          </div>
        </div>
        <div className="google-btn  gap-2 mx-auto mt-3 rounded hitbtn-class">
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
              
            />
          </div>
          <div className="text-justify ">
            <p
              className="text-center text-white"
              style={{ paddingTop: ".3em" }}
            >
              {t("Continue with Facebook")}
            </p>
          </div>
        </div>
        <div className="separator mt-3 col-8 mx-auto">or</div>
        <form>
          <div className="form-group col-8 mx-auto mt-3">
            <span className='text-danger'>{errorMessage}</span>
            <input
              type="email"
              name="email"
              className="form-control mt-1"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder={t("Work email address")}
              onInput={getEmail}
              onKeyDown={onEnter}
            />
          </div>
          <div className="d-grid gap-2 col-8 mx-auto mt-3 hitbtn-class loginpcolor mb-4">

            <Button
              disabled={errorMessage != null}
              className="btn bg-jobsicker"
              onClick={signUpContinue}
              loading={loading}
            >
              {t("Continue with Email")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
