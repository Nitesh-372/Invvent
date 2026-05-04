import React from "react";

export default function CartPage({ cart, removeFromCart }) {
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <main className="container">
      <h2>Cart</h2>

      {cart.length === 0 && <p>No items in cart</p>}

      {cart.map((p, i) => (
        <div key={i} className="cart-item">
          <img src={`${import.meta.env.VITE_API_BASE}${p.image}`} />
          <div className="cart-info">
            <div>{p.product_name}</div>
            <div>₹{p.price}</div>
          </div>
          <button className="btn small" onClick={() => removeFromCart(i)}>Remove</button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>
    </main>
  );
}
