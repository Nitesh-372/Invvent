import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const imgSrc = `${import.meta.env.VITE_API_BASE}${product.image}`;

  return (
    <Link to={`/product/${product.product_id}`} className="card">
      <div className="card-image">
        <img
          src={imgSrc}
          alt={product.product_name}
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </div>

      <div className="card-body">
        <div className="name">{product.product_name}</div>
        <div className="price">₹{product.price}</div>
        <div className="brand">{product.brand}</div>
      </div>
    </Link>
  );
}
