import React, { useEffect, useState } from "react";
import { API } from "../api";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products", { params: { category: categoryId } })
      .then((res) => setProducts(res.data));
  }, [categoryId]);

  return (
    <main className="container">
      <h2>{categoryId}</h2>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard product={p} key={p.product_id} />
        ))}
      </div>
    </main>
  );
}
