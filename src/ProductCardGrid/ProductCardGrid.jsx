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

function handleClick() {
  console.log("You clicked card ");
}

export default function ProductCardGrid() {
  return (
    <div className={s.container} onClick={handleClick}>
      {products.map((product, index) => (
        <ProductCard key={index} image={product.image} title={product.title} />
      ))}
    </div>
  );
}
