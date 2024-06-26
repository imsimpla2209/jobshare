/* eslint-disable */
import React, { useState } from 'react'
import { updateUserData } from './../../../Network/Network'

export default function SubmitProposalFixed({ rate, setrate }) {
  // let [rate, setrate] = useState(0);
  const rateNum = e => {
    rate = e.target.value
    setrate(rate)
    console.log(rate)
  }

  return (
    <section className=" bg-white mt-3 pt-4">
      <div className="ps-1 pb-3">
        <h4>What is the rate you'd like to bid for this job?</h4>
      </div>
      <div className="p-4 my-3">
        <div>
          <div className="mb-4 d-flex justify-content-between  border-bottom">
            <div>
              <span>
                <strong>Bid</strong>
              </span>
              <p>Total amount the client will see on your proposal</p>
            </div>
            <div className="me-5 mt-2 position-relative jd-inp-cn">
              <div className="position-absolute">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <input className="form-control text-end" type="number" placeholder="00.00" onChange={rateNum} />
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <div>
              <span className="w-100">
                <strong>JobShare Service Fee</strong>
                <a className="upw-c-cn fw-normal ms-3" href="">
                  Explain this
                </a>
              </span>
            </div>
            <div className="me-5 mb-3 d-flex">
              <span style={{ position: 'relative', right: '148px' }}>
                <i className="fas fa-dollar-sign"></i>
              </span>
              <span className="text-end pe-4">{(rate * 20) / 100}</span>
            </div>
          </div>
          <div className="mb-3 d-flex  justify-content-between border-top pt-3">
            <div>
              <span>
                <strong>You'll Receive</strong>
              </span>
              <p className="w-75">The estimated amount you'll receive after service fees</p>
            </div>
            <div className="me-5 mt-2 position-relative jd-inp-cn">
              <div className="position-absolute">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <input className="form-control text-end" type="number" placeholder="00.00" value={(rate * 80) / 100} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
