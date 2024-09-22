import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetProductsQuery } from "../../features/api/apiSlice";

import styles from "../../styles/Category.module.css";

import Products from "../Products/Products";

const Category = () => {
  const { id } = useParams();
  const { list } = useSelector(({ categories }) => categories);
  const productsRef = useRef(null);

  const defaultValues = {
    title: "",
    price_min: 0,
    price_max: 0,
  };

  const defaultParams = {
    categoryId: id,
    limit: 5,
    offset: 0,
    ...defaultValues,
  };

  const [isEnd, setEnd] = useState(false);
  const [cat, setCat] = useState(null);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState(defaultValues);
  const [params, setParams] = useState(defaultParams);

  const { data = [], isLoading, isSuccess } = useGetProductsQuery(params);

  useEffect(() => {
    if (!id) return;

    setValues(defaultValues);
    setItems([]);
    setEnd(false);
    setParams({ ...defaultParams, categoryId: id });
  }, [id]);

  useEffect(() => {
    if (isLoading) return;

    if (!data.length) {
      setEnd(true);
    } else {
      setItems((_items) => [..._items, ...data]);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (!id || !list.length) return;

    const category = list.find((item) => item.id === id * 1);
    setCat(category);
  }, [list, id]);

  useEffect(() => {
    if (isSuccess && !isLoading && items.length > 0) {
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isSuccess, isLoading, items.length]);

  const handleChange = useCallback(({ target: { value, name } }) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    setItems([]);
    setEnd(false);
    setParams((prevParams) => ({ ...prevParams, ...values }));
  }, [values]);

  const handleReset = useCallback(() => {
    setValues(defaultValues);
    setParams(defaultParams);
    setEnd(false);
  }, [defaultValues, defaultParams]);

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>{cat?.name}</h2>

      <form className={styles.filters} onSubmit={handleSubmit}>
        <div className={styles.filter}>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            placeholder="Product name"
            value={values.title}
          />
        </div>
        <div className={styles.filter}>
          <input
            type="number"
            name="price_min"
            onChange={handleChange}
            placeholder="0"
            value={values.price_min}
          />
          <span>Price from</span>
        </div>
        <div className={styles.filter}>
          <input
            type="number"
            name="price_max"
            onChange={handleChange}
            placeholder="0"
            value={values.price_max}
          />
          <span>Price to</span>
        </div>

        <button type="submit" hidden />
      </form>

      <div ref={productsRef}>
        {isLoading ? (
          <div className="preloader">Loading...</div>
        ) : !isSuccess || !items.length ? (
          <div className={styles.back}>
            <span>No products found in this category</span>
            <button onClick={handleReset}>Reset filters</button>
          </div>
        ) : (
          <Products
            title=""
            products={items}
            style={{ padding: 0 }}
            amount={items.length}
          />
        )}
      </div>

      {!isEnd && items.length > 0 && (
        <div className={styles.more}>
          <button
            onClick={() =>
              setParams((prevParams) => ({
                ...prevParams,
                offset: prevParams.offset + prevParams.limit,
              }))
            }
          >
            See more
          </button>
        </div>
      )}
    </section>
  );
};

export default Category;