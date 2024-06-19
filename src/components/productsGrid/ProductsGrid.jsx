// hooks and external libraries imports
import { useCallback, useEffect, useRef, useState } from "react";
import { VirtuosoGrid } from "react-virtuoso";

// custom components imports
import ProductCard from "../productCard/ProductCard";
import ProductCategories from "../productsCategories/ProductCategories";
import { httpRequest } from "../../services/services";

// style imports
import "./ProductsGrid.scss";

const ESTIMATED_ROW_HEIGHT = 400; // in px
const LIMIT = 5; // limit per API call
const OVERSCAN = 0; // in px

const ProductsGrid = () => {
  const [products, setProducts] = useState({
    list: [],
    isLoading: true,
    hasMore: false,
  });
  const [category, setCategory] = useState("all");

  // To abort ongoing requests which are not required any more
  const currentAbortController = useRef(null);

  const { list, isLoading, hasMore } = products;

  const applyFilter = (category) => {
    // abort currently ongoing requests
    if (currentAbortController.current) {
      currentAbortController.current.abort();
    }

    // create and assign new abort controller to upcoming requests
    currentAbortController.current = new AbortController();
    setCategory(category);
    setProducts({
      list: [],
      isLoading: true,
      hasMore: false,
    });
    getProducts({ category, abortController: currentAbortController.current });
  };

  const getProducts = async ({
    category,
    abortController,
    queryParams,
  } = {}) => {
    try {
      const url =
        category === "all"
          ? "https://dummyjson.com/products"
          : `https://dummyjson.com/products/category/${category}`;
      const res = await httpRequest({
        url,
        queryParams: {
          limit: LIMIT,
          ...queryParams,
        },
        abortController,
      });
      if (res) {
        const { products, total } = res;
        setProducts((prevProducts) => {
          const newList = list.length
            ? [...prevProducts.list, ...products]
            : [...products];
          const hasMore = newList.length < total;
          return { list: newList, isLoading: false, hasMore };
        });
      }
    } catch (error) {
      setProducts((prevProducts) => {
        return { ...prevProducts, isLoading: false };
      });
      console.error(error);
    }
  };

  // load more products
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      if (currentAbortController.current) {
        currentAbortController.current.abort();
      }

      // create and assign new abort controller to upcoming requests
      currentAbortController.current = new AbortController();
      setProducts((prevProducts) => {
        return { ...prevProducts, isLoading: true };
      });
      getProducts({
        category,
        queryParams: { skip: list.length },
        abortController: currentAbortController.current,
      });
    }
  }, [category, hasMore, isLoading, list.length]);

  // Check condition for infinite scrolling
  const handleLoadMore = useCallback(() => {
    const productGridContainer = document.querySelector(
      ".product-grid-container"
    );
    const { scrollHeight, scrollTop, clientHeight } =
      productGridContainer || {};
    if (
      clientHeight + scrollTop + OVERSCAN + ESTIMATED_ROW_HEIGHT >=
      scrollHeight
    ) {
      loadMore();
    }
  }, [loadMore]);

  // initial request
  useEffect(() => {
    currentAbortController.current = new AbortController();
    getProducts({
      category: "all",
      abortController: currentAbortController.current,
    });
    return () => {
      currentAbortController.current.abort();
    };
  }, []);

  // Feel empty screen with product cards if more products are available
  useEffect(() => {
    handleLoadMore();
  }, [handleLoadMore, list]);

  // Infinite scrolling on scroll
  useEffect(() => {
    const productGridContainer = document.querySelector(
      ".product-grid-container"
    );
    productGridContainer.addEventListener("scroll", handleLoadMore);
    window.addEventListener("resize", handleLoadMore);
    return () => {
      productGridContainer.removeEventListener("scroll", handleLoadMore);
      window.removeEventListener("resize", handleLoadMore);
    };
  }, [handleLoadMore]);

  return (
    <>
      <ProductCategories activeCategory={category} applyFilter={applyFilter} />
      <VirtuosoGrid
        totalCount={list.length}
        listClassName="product-grid"
        className="product-grid-container"
        itemContent={(index) => {
          const product = list[index];
          return <ProductCard product={product} />;
        }}
      />
    </>
  );
};

export default ProductsGrid;
