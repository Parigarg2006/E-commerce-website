import { useState } from "react";
import "./PlaceOrder.css";

function PlaceOrder({ cart, foods, onOrderPlaced }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    street: "", city: "", state: "", zip: "", phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const cartItems = foods.filter((f) => cart[f._id]);
  const cartTotal = cartItems.reduce((sum, f) => sum + f.price * cart[f._id], 0);
  const deliveryFee = 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.phone || !form.street) {
      alert("Please fill all required fields!");
      return;
    }

    const orderData = {
      userId: "guest_" + Date.now(),
      items: cartItems.map((f) => ({ ...f, quantity: cart[f._id] })),
      amount: cartTotal + deliveryFee,
      address: form,
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (onOrderPlaced) onOrderPlaced();
      } else {
        alert("Order failed! Try again.");
      }
    } catch (err) {
      alert("Server error! Make sure backend is running.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="order-success">
        <div className="success-box">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Your food is being prepared. Delivery in 30 minutes!</p>
          <button className="back-btn" onClick={() => window.location.reload()}>
            Order More Food 🍅
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="placeorder-page">
      <div className="placeorder-container">

        {/* LEFT — Delivery Info */}
        <div className="delivery-form">
          <h2 className="form-title">Delivery Information</h2>

          <div className="form-row">
            <div className="input-wrap">
              <label>First Name *</label>
              <input name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} />
            </div>
            <div className="input-wrap">
              <label>Last Name</label>
              <input name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="input-wrap">
            <label>Email Address *</label>
            <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
          </div>

          <div className="input-wrap">
            <label>Street Address *</label>
            <input name="street" placeholder="123 Main Street" value={form.street} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="input-wrap">
              <label>City</label>
              <input name="city" placeholder="Ghaziabad" value={form.city} onChange={handleChange} />
            </div>
            <div className="input-wrap">
              <label>State</label>
              <input name="state" placeholder="Uttar Pradesh" value={form.state} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="input-wrap">
              <label>Zip Code</label>
              <input name="zip" placeholder="201001" value={form.zip} onChange={handleChange} />
            </div>
            <div className="input-wrap">
              <label>Phone *</label>
              <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="order-summary">
          <h2 className="form-title">Order Summary</h2>

          <div className="summary-items">
            {cartItems.map((item) => (
              <div className="summary-item" key={item._id}>
                <img src={`http://localhost:4000/images/${item.image}`} alt={item.name} />
                <div className="summary-item-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {cart[item._id]}</p>
                </div>
                <span>₹{item.price * cart[item._id]}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee</span>
              <span className="free">FREE 🎉</span>
            </div>
            <div className="total-row grand">
              <span>Total</span>
              <strong>₹{cartTotal}</strong>
            </div>
          </div>

          <button
            className="place-order-btn"
            onClick={handleSubmit}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? "Placing Order..." : "Place Order →"}
          </button>

          {cartItems.length === 0 && (
            <p className="empty-warning">Your cart is empty!</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default PlaceOrder;
