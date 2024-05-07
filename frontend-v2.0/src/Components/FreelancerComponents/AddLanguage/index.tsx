/* eslint-disable array-callback-return */
import React from "react";

export default function AddLanguage(props) {
    return (
        <>
            <p className="fw-bold">What is other language do you speake?</p>
            <button type="button" className="btn border rounded-pill col-6" onClick={props.toggleAddLang}><i className="fas fa-plus"></i> Add Language</button>
            <ul>
                {props.languagesList.map((e, index) => (
                    <li className="col-5 d-flex justify-content-between py-2" key={index}>
                        <span> <span className="fw-bold">{e["language"]}</span>
                            <span> : {e["langProf"]}</span></span>
                        <i className="fas fa-trash" onClick={() => props.deleteLang(index)}></i>
                    </li>
                ))}
            </ul>
        </>
    )
}