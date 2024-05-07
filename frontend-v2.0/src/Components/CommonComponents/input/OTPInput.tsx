import React, { useRef, useState } from 'react';
import './styles.css';

export default function OtpInput({otp, setOtp}: any) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    // Update the current digit
    if (value) {
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    }

    // Update the OTP value
    const newOtp = otp.slice(0, index) + value + otp.slice(index + 1);
    setOtp(newOtp);
  };

  function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
      key = evt.clipboardData.getData('text/plain');
    } else {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  return (
    <div className="otp-input-container">
      {Array.from({ length: 6 }, (_, index) => (
        <input
          onKeyPress={(event) => validate(event)}
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          className="otp-input"
          type="text"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e) => handleOtpChange(e, index)}
        />
      ))}
    </div>
  );
}