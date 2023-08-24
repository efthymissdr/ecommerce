import React from "react";
import s from "./ProductCard.module.css";

const text = ["Product Name", "Product Name", "Product Name"];
const images = [
  "https://placehold.co/60x60",
  "https://placehold.co/60x60",
  "https://placehold.co/60x60",
];

export default function App() {
  const [data, setData] = React.useState([1, 2, 3]);
  return (
    <div className={s.container}>
      <div className="productcard">
        {data.map((el, idx) => (
          <div className={s.card} key={el}>
            <img src={images[idx]} className={s.productimage} />
            <span className={s.description}>{text[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
