import React, { useEffect, useState } from "react";
import { API } from "../api";
import { useParams } from "react-router-dom";

export default function ProductPage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [frequent, setFrequent] = useState([]);

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  useEffect(() => {
    if (!product) return;

    API.post("/recommend/similar", { product_name: product.product_name })
      .then((res) => setSimilar(res.data));
  }, [product]);

  const handleAdd = () => {
    addToCart(product);

    API.post("/recommend/frequent", { product_name: product.product_name })
      .then((res) => setFrequent(res.data));
  };

  if (!product) return <main className="container">Loading…</main>;

  const imgSrc = `${import.meta.env.VITE_API_BASE}${product.image}`;

  return (
    <main className="container">

      <div className="product-page">

        <div className="image-side">
          <img src={imgSrc} />
        </div>

        <div className="info-side">
          <h1>{product.product_name}</h1>
          <div className="price">₹{product.price}</div>
          <div className="desc">{product.description}</div>
          <button onClick={handleAdd} className="btn">Add to Cart</button>
        </div>

      </div>

      <h3>Similar Products</h3>
      <div className="product-grid">
        {similar.map((s) => (
          <div className="mini-card" key={s.product_id}>
            <img src={`${import.meta.env.VITE_API_BASE}${s.image}`} />
            <div>{s.product_name}</div>
            <div>₹{s.price}</div>
          </div>
        ))}
      </div>

      <h3>Frequently Bought Together</h3>
      <div className="product-grid">
        {frequent.map((f) => (
          <div className="mini-card" key={f.product_id}>
            <img src={`${import.meta.env.VITE_API_BASE}${f.image}`} />
            <div>{f.product_name}</div>
            <div>₹{f.price}</div>
          </div>
        ))}
      </div>

    </main>
  );
}
