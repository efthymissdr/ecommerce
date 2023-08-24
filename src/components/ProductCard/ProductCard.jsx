import s from "./ProductCard.module.css";

export default function ProductCard({ image, title }) {
  return (
    <div className={s.card}>
      <img src={image} className={s.productimage} />
      <span className={s.description}>{title}</span>
    </div>
  );
}
