import ProductCard from "../components/ProductCard/ProductCard";
import s from "./ProductCardGrid.module.css";

function handleClick(id) {
  console.log("You clicked card ", id);
}
const ProductCardGrid = (props) => {
  const products = props.products;
  return (
    <div className={s.container}>
      {products.map((product, id) => (
        <ProductCard
          key={id}
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
