import React from "react";
import s from "./FilterDropDown.module.css";

const filterdropdown = (props) => {
  return (
    <div className={s.filterdropdown}>
      <select onChange={props.onSelectOption}>
        <option selected disabled hidden>
          {props.title}
        </option>
        {props.options.map((option, index) => {
          return <option key={index}>{option}</option>;
        })}
      </select>
    </div>
  );
};

export default filterdropdown;
