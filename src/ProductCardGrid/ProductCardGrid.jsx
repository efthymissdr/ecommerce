import React from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import s from "./ProductCardGrid.module.css";

const products = [
  {
    title: "Product Name",
    image: "https://placehold.co/60x60",
  },
  {
    title: "Product Name",
    image: "https://placehold.co/60x60",
  },
  {
    title: "Product Name",
    image: "https://placehold.co/60x60",
  },
  {
    title: "Product Name",
    image: "https://placehold.co/60x60",
  },
  {
    title: "Product Name",
    image: "https://placehold.co/60x60",
  },
  {
    title: "Product Name",
    image: "https://placehold.co/60x60",
  },
  {
    title: "Product Name",
    image: "https://placehold.co/60x60",
  },
  {
    title: "Product Name",
    image: "https://placehold.co/60x60",
  },
];

export default function ProductCardGrid() {
  return (
    <div className={s.container}>
      {products.map((product, index) => (
        <ProductCard image={product.image} title={product.title} key={index} />
      ))}
    </div>
  );
}
