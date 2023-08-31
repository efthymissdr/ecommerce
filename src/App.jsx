import { useState } from "react";
import s from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import FiltersList from "./FiltersList/FiltersList";
import ProductCardGrid from "./ProductCardGrid/ProductCardGrid";

export default function App() {
  const [products, setProducts] = useState([
    {
      id: "Number 1",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 2",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 3",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 4",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 5",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 6",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 7",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 8",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 9",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 10",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 11",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 12",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 13",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 14",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 15",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 16",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 17",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 18",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 19",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
    {
      id: "Number 20",
      title: "Product Name",
      image: "https://placehold.co/60x60",
    },
  ]);

  return (
    <>
      <div className={s.searchBarContainer}>
        <SearchBar />
      </div>
      <div className={s.bigContainer}>
        <FiltersList />
        <ProductCardGrid products={products} />
      </div>
    </>
  );
}
