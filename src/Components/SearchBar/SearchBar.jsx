import React, { useState, usestate } from "react";
import s from "./SearchBar.module.css";

const searchbar = (props) => (
  <div className={s.searchbar}>
    <i className="fa-solid fa-magnifying-glass" />
    <input
      className={s.input}
      type="text"
      placeholder="Search products by title"
    />
  </div>
);

export default searchbar;
