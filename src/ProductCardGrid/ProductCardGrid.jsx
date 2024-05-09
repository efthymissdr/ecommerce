import { useContext } from "react";
import { ProductsContext } from "../App";
import ProductCard from "../components/ProductCard/ProductCard";
import s from "./ProductCardGrid.module.css";

function handleClick(id) {
  console.log("You clicked card ", id);
}
const ProductCardGrid = () => {
  const { products, setProducts } = useContext(ProductsContext); // object distracturing
  // console.log(contextValue);
  return (
    <div className={s.container}>
      {products.map((product, id) => (
        <ProductCard
          key={product.id}
          image={product.image}
          title={product.title}
          onClick={() => {
            handleClick(id);
          }}
        />
      ))}
    </div>
  );
};

export default ProductCardGrid;
