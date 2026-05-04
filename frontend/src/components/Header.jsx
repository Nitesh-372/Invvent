import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ cartCount }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();
    navigate(`/search?q=${query}`);
  };

  return (
    <header className="header">
      <div className="header-inner">

        <Link to="/" className="brand">
          <span className="logo">I</span>
          <span className="brand-text">Inventory</span>
        </Link>

        <form className="search" onSubmit={search}>
          <input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <Link to="/cart" className="cart-link">
          Cart ({cartCount})
        </Link>

      </div>
    </header>
  );
}
