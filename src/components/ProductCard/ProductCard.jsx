import s from "./ProductCard.module.css";

export default function ProductCard({ image, title }) {
  return (
    <div className={s.card}>
      <img src={image} className={s.productImage} />
      <h2 className={s.description}>{title}</h2>
    </div>
  );
}
