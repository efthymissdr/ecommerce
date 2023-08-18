import React from "react";
import s from "./SearchBar.module.css";

function SearchBar(props) {
  return (
    <div className={s.searchbar}>
      <i className="fa-solid fa-magnifying-glass" />
      <input
        className={s.input}
        type="search"
        placeholder="Search products by title"
      />
    </div>
  );
}

export default SearchBar;
