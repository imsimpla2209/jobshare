import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/img/jobshare1.jpg'

export default function Logo() {
  return (
    <>
      <Link to="/" className="in-small-screen-cn">
        <img src={logo} alt="" id="air-2-5-logo" style={{}} width={136} height={34} role="img" aria-hidden="true" />
      </Link>
    </>
  )
}
