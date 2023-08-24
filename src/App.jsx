import s from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import FiltersList from "./FiltersList/FiltersList";
import ProductCard from "./components/ProductCard/ProductCard";

export default function App() {
  return (
    <>
      <SearchBar />
      <FiltersList />
      <ProductCard />
    </>
  );
}
