import React, { useEffect, useState } from "react";
import { API } from "../api";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    API.get("/categories").then((res) => setCategories(res.data));
    API.get("/products").then((res) => setProducts(res.data));
    API.get("/user/recently-bought").then((res) => setRecent(res.data)).catch(()=>{});
  }, []);

  return (
    <main className="container">

      <h2>Categories</h2>
      <div className="category-row">
        {categories.map((c) => (
          <Link to={`/category/${c.id}`} key={c.id} className="category-box">
            {c.name}
          </Link>
        ))}
      </div>

      <h2>All Products</h2>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard product={p} key={p.product_id} />
        ))}
      </div>

    </main>
  );
}
