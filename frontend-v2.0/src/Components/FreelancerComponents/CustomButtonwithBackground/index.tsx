import React from "react";
export default function CustomButtonwithbackground({ headers }) {
  return (
    <div className="CustomButton2">
      <button
        className="btn -btn-default  border rounded"
        type="button"
        style={{ backgroundColor: "#6058c4", color: "white" }}
      >
        {headers}
      </button>
    </div>
  );
}
