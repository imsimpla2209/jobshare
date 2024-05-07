import React from "react";
import "../../../assets/style/style.css";
import LoginHeader from "../../../Components/BeforeLoginComponents/LoginHeader";
import LoginTemp from "../../../Components/BeforeLoginComponents/LoginTemp";
import SignupFooter from "../../../Components/BeforeLoginComponents/SignupFooter";

export default function Login() {
  return (
    <>
      <LoginHeader />
      <LoginTemp />
      <SignupFooter />
    </>
  );
}
