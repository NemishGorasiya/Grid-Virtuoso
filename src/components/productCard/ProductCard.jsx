import PropTypes from "prop-types";
import "./ProductCard.scss";

const ProductCard = ({ product }) => {
  const { title, thumbnail, description, price, rating } = product || {};

  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <img
          className="product-card-image"
          src={thumbnail}
          alt="product card"
        />
      </div>
      <div className="product-details-wrapper">
        <div className="product-detail bold">{title}</div>
        <div className="product-detail product-description">{description}</div>
        <div className="product-detail bold">$ {price}</div>
        <div className="product-detail bold">Rating {rating}/5</div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

ProductCard.displayName = "ProductCard";

export default ProductCard;
