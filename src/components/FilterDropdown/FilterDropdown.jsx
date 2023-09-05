import React from "react";
import s from "./FilterDropdown.module.css";

export default function FilterDropdown({ options, title, onSelectOption }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={s.filterDropDownButton}>
      <button onClick={handleOpen}>{title}</button>
      {open ? (
        <ul className={s.menu}>
          {options.map((option) => {
            return (
              <li className="menu-item" key={option}>
                <button
                  className={s.filterDropDownButton}
                  onClick={() => onSelectOption(option)}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/* <select
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
} */
