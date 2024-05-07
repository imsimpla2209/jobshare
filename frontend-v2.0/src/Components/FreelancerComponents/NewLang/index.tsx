import { useState } from "react";

export default function NewLang(props) {
  let [language, setlanguage] = useState("");
  const lang = (e) => {
    language = e.target.value;
    setlanguage(language);
    console.log(language)
  };
  let [proficiency, setproficiency] = useState("");
  const prof = (e) => {
    proficiency = e.target.value;
    setproficiency(e.target.value);
    console.log(proficiency)
  };
  const add = () => {
    props.toggleAddLang();
    props.addlangToList({ "language": language, "langProf": proficiency });
  }
  return (
    <>
      <p className="fw-bold">Language</p>
      <div className="d-flex ">
        <select
          className="form-select form-select-lg mb-3 shadow-none w-50"
          aria-label=".form-select-lg example"
          onChange={lang}
        >
          <option selected>Select Language</option>
          <option value="Chinese">Chinese</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
          <option value="Russia">Russia</option>
        </select>
        <div className="col-4 mx-auto">
          <i className="fas fa-trash fs-2" onClick={props.toggleAddLang}></i>
        </div>
      </div>

      <p className="fw-bold">Proficiency</p>
      <select
        className="form-select form-select-lg mb-3 shadow-none w-50"
        aria-label=".form-select-lg example"
        onChange={prof}
      >
        <option value="English proficiency">English proficiency</option>
        <option value="Basic/Cơ bản">Basic/Cơ bản</option>
        <option value="Conversational/Giao tiếp">Conversational/Giao tiếp</option>
        <option value="Fluent/Thông thạo">Fluent/Thông thạo</option>
        <option value="Native/Như bản địa">Native/Như bản địa</option>
        <option value="None/Chả biết gì">None/Chả biết gì</option>
      </select>
      <button
        className="btn bg-jobsicker px-5"
        onClick={add}
      >
        Add
      </button>
    </>
  )
}