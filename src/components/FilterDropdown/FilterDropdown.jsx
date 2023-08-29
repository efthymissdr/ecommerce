import s from "./FilterDropdown.module.css";

export default function FilterDropdown({ title, options, onSelectOption }) {
  return (
    <select
      className={s.filterDropdown}
      defaultValue={title}
      onChange={onSelectOption}
    >
      <option value={title} disabled hidden>
        {title}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
