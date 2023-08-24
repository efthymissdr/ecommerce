import s from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import FiltersList from "./FiltersList/FiltersList";
import ProductCardGrid from "./ProductCardGrid/ProductCardGrid";

export default function App() {
  return (
    <>
      <div className={s.searchbar}>
        <SearchBar />
      </div>
      <div className={s.bigcontainer}>
        <FiltersList />
        <ProductCardGrid />
      </div>
    </>
  );
}
