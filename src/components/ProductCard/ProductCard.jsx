import s from "./ProductCard.module.css";

export default function ProductCard({ image, title, onClick }) {
  return (
    <div className={s.card} onClick={onClick}>
      <img src={image} height={120} width={120} className={s.productImage} />
      <h2 className={s.description}>{title}</h2>
    </div>
  );
}
