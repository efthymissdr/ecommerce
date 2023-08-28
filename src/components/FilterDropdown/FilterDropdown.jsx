import s from "./FilterDropdown.module.css";

export default function filterDropdown({ title, options, onSelectOption }) {
  return (
    <select
      className={s.filterDropdown}
      defaultValue={title}
      onChange={onSelectOption}
    >
      <option className={s.title} value={title} disabled hidden>
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
