import React from "react";
import CustomButtonwithbackground from "../../FreelancerComponents/CustomButtonwithBackground";
import CustomButtonwithoutbackground from "../../FreelancerComponents/CustomButtonwithoutbackground";
export default function ChangePassword() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n    @import url(//db.onlinewebfonts.com/c/3def92f7b2ad644bd382798ecc8ca4c7?family=Canela);\n     {\n        .container {\n             ;\n        }\n    }\n\n    * {\n        margin: 0;\n        padding: 0;\n        \n\n    }\n    body{\n        ;\n\n    }\n",
        }}
      />
      <div className="container card mt-3 mb-3">
        <h5 className=" ps-3 mt-3 fw-bold">Password </h5>
        <hr />
        <div className="row">
          <div className="col-md-6">
            <p className=" mt-3 fw-bold">
              <i className="fas fa-check-circle me-2"></i>Password has been set
            </p>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-default me-2 d-flex justify-content-center border rounded-circle"
              style={{
                width: "30px",
                height: "30px",
                textAlign: "center",
                paddingTop: "3px",
                paddingBottom: "3px",
              }}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal3"
            >
              <div>
                <i className="fas fa-pen"></i>
              </div>
            </button>
          </div>
          <small className="text-muted me-2 mb-3">
            Choose a strong, unique password that’s at least 8 characters long.
          </small>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal3"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Change Password
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className=" mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label fw-bold"
                  >
                    Old password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    style={{ border: "1px solid #6058c4" }}
                  />
                  <small className=" mt-2" style={{ color: "#6058c4" }}>
                    Tips for Creating a stronger password
                  </small>
                </div>
                <div className=" row mb-3 mt-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="exampleFormControlInput2"
                      className="form-label fw-bold"
                    >
                      New password
                    </label>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group-text mt-2 bg-white">
                      <input
                        className="border-0"
                        type="checkbox"
                        id="flexCheckDefault"
                        style={{ color: "lightgreen" }}
                      />
                      <small className="  ms-2">show password</small>
                    </div>
                  </div>
                </div>
                <input
                  type="password"
                  className="form-control"
                  id="exampleFormControlInput1"
                />

                <label
                  htmlFor="exampleFormControlInput3"
                  className="form-label fw-bold"
                >
                  confirm new password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleFormControlInput1"
                />
                <div className="input-group-text mt-2 bg-white">
                  <input
                    className="no-border"
                    type="checkbox"
                    id="flexCheckDefault"
                    style={{ color: "lightgreen" }}
                  />
                  <small className="  ms-2" style={{ color: "#6058c4" }}>
                    All devices will be required to sign in with new password
                  </small>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <CustomButtonwithbackground headers="cancel" />
              <CustomButtonwithoutbackground headers="save" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
