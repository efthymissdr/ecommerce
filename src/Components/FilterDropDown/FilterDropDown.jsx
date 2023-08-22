import s from "./FilterDropDown.module.css";

export default function FilterDropDown(props) {
  return (
    <div className={s.filterdropdown}>
      <select onChange={props.onSelectOption}>
        <option selected disabled hidden>
          {props.title}
        </option>
        {props.options.map((option, index) => {
          return <option key={option}>{option}</option>;
        })}
      </select>
    </div>
  );
}
