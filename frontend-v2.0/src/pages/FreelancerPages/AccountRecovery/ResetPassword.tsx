/* eslint-disable */
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "src/api/auth-apis";

export default function ResetPassword() {
  const [user, setUser] = useState({ password: "", rePassword: "" });
  const [emailError, setEmailErorr] = useState("");
  const [PasswordError, setPasswordErrorr] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()

  const { t } = useTranslation(['main']);
  const token = searchParams.get('token')

  const getUserData = (e) => {
    const name = e.target.name;
    const val = e.target.value;
    switch (name) {
      case "password":
        setUser({
          ...user,
          password: val,
        });
        setEmailErorr(
          val === ""
            ? t("This is Required")
            : !val.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
              ? t("Password Should be More 8 Character")
              : null
        );
        break;
      case "rePassword":
        setUser({
          ...user,
          rePassword: val,
        });
        setPasswordErrorr(
          val === ""
            ? t("This is Required")
            : val !== user.password
              ? t("Must Match Password")
              : null
        );
        break;
      default:
        break;
    }
  };

  const sendResetPassword = async (e) => {
    console.log(user);
    e.preventDefault();
    await resetPassword({ password: user?.password }, token)
      .then((res) => {
        toast.success('Password Reset Successfully');
        setTimeout(() => navigate('/login'), 1200)
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage(error.message);
        toast.error(error.message)
      });
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-5  mx-auto">
            <div className="shadow-sm p-5 mb-5 bg-white rounded mx-auto mt-5 w-100  border ">
              <h5 data-v-904d5b16 className="text-center m-0">
                <span data-v-733406b2 data-v-44072c38>
                  {t("Reset Password")}
                </span>
              </h5>
              <form>
                <div className="form-group col-8 mx-auto mt-3">
                  <span className="text-danger">{emailError}</span>
                  <Input.Password
                    prefix={<LockOutlined />}
                    size={'large'}
                    type="password"
                    name="password"
                    className={`shadow-none ${emailError ? "border-danger" : ""
                      }`}
                    aria-describedby="emailHelp"
                    placeholder={t("Password")}
                    onInput={getUserData}
                  />
                </div>
                <div className="form-group col-8 mx-auto mt-3">
                  <span className="text-danger">{PasswordError}</span>
                  <Input.Password
                    prefix={<LockOutlined />}
                    size={'large'}
                    type="rePassword"
                    name="rePassword"
                    className={`shadow-none ${PasswordError ? "border-danger" : ""}`}
                    aria-describedby="emailHelp"
                    placeholder={t("Confirm") + ' ' + t("Password")}
                    onInput={getUserData}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </div>
                <div className="d-grid gap-2 col-8 mx-auto mt-3 hitbtn-className loginpcolor">
                  <button
                    className="btn bg-jobsicker "
                    onClick={sendResetPassword}
                    disabled={PasswordError != null || emailError != null}
                  >
                    {t("Update Password")}
                  </button>
                </div>
                <span className="text-danger text-center ms-md-5 " >{errorMessage}</span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
