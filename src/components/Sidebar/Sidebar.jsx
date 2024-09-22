import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { useGetProductsQuery } from "../../features/api/apiSlice";

import styles from "../../styles/Sidebar.module.css";

const Sidebar = () => {
  const { list } = useSelector(({ categories }) => categories);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);

  const { data: products = [] } = useGetProductsQuery({ limit: 100 });

  useEffect(() => {
    if (products.length && list.length) {
      const categoriesWithProducts = list.filter(category =>
        products.some(product => product.category.id === category.id)
      );
      setCategoriesWithProducts(categoriesWithProducts);
    }
  }, [products, list]);

  return (
    <section className={styles.sidebar}>
      <div className={styles.title}>CATEGORIES</div>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {categoriesWithProducts.map(({ id, name }) => (
            <li key={id}>
              <NavLink
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
                to={`/categories/${id}`}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <a href="/help" target="_blank" className={styles.link}>
          Help
        </a>
        <a
          href="/terms"
          target="_blank"
          className={styles.link}
          style={{ textDecoration: "underline" }}
        >
          Terms & Conditions
        </a>
      </div>
    </section>
  );
};

export default Sidebar;