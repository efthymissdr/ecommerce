import s from "./FilterDropdown.module.css";

export default function FilterDropdown({ title, options, onSelectOption }) {
  return (
    <select className={s.filterDropdown} onChange={onSelectOption}>
      <option selected disabled hidden>
        {title}
      </option>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
