import PropTypes from "prop-types";
import { productCategories } from "../../utils/constants";
import "./ProductCategories.scss";

const ProductCategories = ({ activeCategory, applyFilter }) => {
  return (
    <div className="product-category-wrapper">
      {productCategories.map((productCategory) => {
        const { name, slug } = productCategory || {};

        return (
          <button
            onClick={() => applyFilter(slug)}
            key={slug}
            className={`product-category-filter-button ${
              activeCategory === slug ? "active-category-button" : ""
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

ProductCategories.propTypes = {
  applyFilter: PropTypes.func.isRequired,
  activeCategory: PropTypes.string.isRequired,
};

export default ProductCategories;
