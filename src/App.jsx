import s from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import FiltersList from "./FiltersList/FiltersList";

export default function App() {
  return (
    <>
      <SearchBar />
      <FiltersList />
    </>
  );
}
