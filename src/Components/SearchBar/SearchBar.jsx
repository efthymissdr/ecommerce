import s from "./SearchBar.module.css";

export default function SearchBar(props) {
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
