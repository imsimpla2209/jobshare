/* eslint-disable jsx-a11y/no-redundant-roles */
import { Button, Result } from "antd"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { forgotPassword } from "src/api/auth-apis"

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isSent, onSent] = useState(false)
  const [loading, onLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation(['main'])

  const getEmail = ({ target }) => {
    const checkErr = target.value === "" ? t("Email required") : !target.value.match(/^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)
      ? t("Please inter Valid Email") : null
    setErrorMessage(checkErr);
    if (checkErr) {
      return
    }
    setEmail(target.value)
  }

  const sendResetPassword = () => {
    onLoading(true)
    forgotPassword({ email }).then(() => {
      onSent(true)
    }).finally(() => onLoading(false))
  }
  const onEnter = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (!errorMessage) {
        sendResetPassword();
      }
    }
  }
  return (
    <>
      {!isSent ? <>
        <div className="form-gap w-100" style={{ paddingTop: 70 }}></div>
        <div className="container w-100">
          <div className="row justify-content-center">
            <div className="col-md-4 col-md-offset-4">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="text-center">
                    <h3><i className="fa fa-lock fa-4x"></i></h3>
                    <h2 className="text-center">Forgot Password?</h2>
                    <p>You can reset your password here.</p>
                    <div className="panel-body">

                      <form id="register-form" role="form" autoComplete="off" className="form">

                        <div className="form-group">
                          <div className="input-group">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
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
                          </div>
                        </div>
                        <div className="form-group">
                          <Button disabled={errorMessage != null}
                            className="btn bg-jobsicker mt-4" onClick={sendResetPassword} loading={loading} > Send Reset Mail</Button>
                        </div>

                        <input type="hidden" className="hide" name="token" id="token" value="" />
                      </form>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </> : <Result
          status="success"
          title="Reset mail has been sent to your email/ mail cài lại mật khẩu đã được gửi đến email của bạn"
          extra={
            <a href="https://mail.google.com/mail" type="primary" style={{ padding: 8, fontSize: 16, borderRadius: 4, background: '#f0f2f5' }} key="console">
              Go to Mail
            </a>
          }
        />}
    </>
  )
}

export default ForgotPassword