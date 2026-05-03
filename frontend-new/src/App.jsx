import { useEffect, useState } from "react";
import "./App.css";
import PlaceOrder from "./PlaceOrder";

const CATEGORIES = ["All", "Fast Food", "Rolls", "Pasta"];

function App() {
  const [foods, setFoods] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("home");

  useEffect(() => {
    fetch("http://localhost:4000/api/food/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFoods(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id]--;
      else delete updated[id];
      return updated;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartItems = foods.filter((f) => cart[f._id]);
  const cartTotal = cartItems.reduce((sum, f) => sum + f.price * cart[f._id], 0);

  const filteredFoods = foods.filter((f) => {
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const goToCheckout = () => {
    setShowCart(false);
    setPage("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onOrderPlaced = () => {
    setCart({});
    setPage("home");
  };

  // CHECKOUT PAGE
  if (page === "checkout") {
    return (
      <div className="app">
        <nav className="navbar">
          <a className="logo" href="#home">Tomato <span>🍅</span></a>
          <button className="back-to-home" onClick={() => setPage("home")}>← Back to Menu</button>
        </nav>
        <PlaceOrder cart={cart} foods={foods} onOrderPlaced={onOrderPlaced} />
      </div>
    );
  }

  // HOME PAGE
  return (
    <div className="app">

      {showLogin && (
        <div className="overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLogin(false)}>✕</button>
            <div className="modal-logo">Tomato 🍅</div>
            <h2 className="modal-title">{isRegister ? "Create Account" : "Welcome Back"}</h2>
            <p className="modal-sub">{isRegister ? "Join us for amazing food!" : "Sign in to continue ordering"}</p>
            {isRegister && (
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input type="text" placeholder="Full Name" />
              </div>
            )}
            <div className="input-group">
              <span className="input-icon">✉</span>
              <input type="email" placeholder="Email Address" />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input type="password" placeholder="Password" />
            </div>
            <button className="btn-primary full-width">
              {isRegister ? "Create Account" : "Sign In"}
            </button>
            <p className="modal-switch">
              {isRegister ? "Already have an account?" : "New to Tomato?"}{" "}
              <span onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Sign In" : "Register here"}
              </span>
            </p>
          </div>
        </div>
      )}

      {showCart && (
        <div className="overlay" onClick={() => setShowCart(false)}>
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>🛒 Your Cart</h2>
              <button className="modal-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🍽</div>
                <p>Your cart is empty</p>
                <span>Add some delicious items!</span>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item._id}>
                      <img src={`http://localhost:4000/images/${item.image}`} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price} each</p>
                      </div>
                      <div className="cart-qty">
                        <button onClick={() => removeFromCart(item._id)}>−</button>
                        <span>{cart[item._id]}</span>
                        <button onClick={() => addToCart(item._id)}>+</button>
                      </div>
                      <strong className="cart-item-total">₹{item.price * cart[item._id]}</strong>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total-row">
                    <span>Delivery</span><span>Free 🎉</span>
                  </div>
                  <div className="cart-total-row total">
                    <span>Total</span><strong>₹{cartTotal}</strong>
                  </div>
                  <button
                    className="btn-primary full-width checkout-btn"
                    onClick={goToCheckout}
                  >
                    Proceed to Checkout →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <nav className="navbar">
        <a className="logo" href="#home">Tomato <span>🍅</span></a>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
          <li><a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a></li>
          <li><a href="#why" onClick={() => setMenuOpen(false)}>Offers</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
        <div className="nav-actions">
          <button className="cart-btn" onClick={() => setShowCart(true)}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="btn-primary" onClick={() => setShowLogin(true)}>Sign In</button>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-badge">🔥 Free Delivery on First Order</div>
          <h1>Craving Something <br /><span className="hero-highlight">Delicious?</span></h1>
          <p>Order fresh meals from the best restaurants near you.<br />Hot food at your door in 30 minutes.</p>
          <div className="hero-actions">
            <button className="btn-primary large" onClick={() => document.getElementById("menu").scrollIntoView({ behavior: "smooth" })}>Order Now →</button>
            <button className="btn-outline large" onClick={() => setShowLogin(true)}>View Menu</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>50+</strong><span>Restaurants</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>10k+</strong><span>Happy Customers</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>30 min</strong><span>Avg Delivery</span></div>
          </div>
        </div>
        <div className="hero-image-wrap">
          <div className="hero-blob" />
          <img className="hero-img" src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80" alt="Delicious food" />
          <div className="hero-float card1">⭐ 4.9 Rating</div>
          <div className="hero-float card2">🚴 Fast Delivery</div>
        </div>
      </section>

      <section className="categories-section" id="menu">
        <div className="section-header">
          <h2>Our Menu</h2>
          <p>Choose from a wide range of freshly prepared dishes</p>
        </div>
        <div className="search-bar">
          <span>🔍</span>
          <input type="text" placeholder="Search for food..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {searchQuery && (<button className="clear-search" onClick={() => setSearchQuery("")}>✕</button>)}
        </div>
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`cat-tab ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>
      </section>

      <section className="food-section">
        {filteredFoods.length === 0 ? (
          <div className="no-results">
            <div>😔</div>
            <p>No dishes found</p>
            <span>Try a different category or search</span>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map((item) => (
              <div className="food-card" key={item._id}>
                <div className="food-img-wrap">
                  <img src={`http://localhost:4000/images/${item.image}`} alt={item.name} />
                  <span className="food-badge">{item.category}</span>
                </div>
                <div className="food-info">
                  <div className="food-rating">⭐ 4.8</div>
                  <h3>{item.name}</h3>
                  <p className="food-desc">{item.description || "Fresh & delicious, made with love."}</p>
                  <div className="food-bottom">
                    <span className="food-price">₹{item.price}</span>
                    {cart[item._id] ? (
                      <div className="qty-control">
                        <button onClick={() => removeFromCart(item._id)}>−</button>
                        <span>{cart[item._id]}</span>
                        <button onClick={() => addToCart(item._id)}>+</button>
                      </div>
                    ) : (
                      <button className="add-btn" onClick={() => addToCart(item._id)}>+ Add</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="why-section" id="why">
        <div className="section-header">
          <h2>Why Choose Tomato?</h2>
          <p>We deliver more than just food — we deliver happiness</p>
        </div>
        <div className="why-grid">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Get your food delivered hot and fresh in 30 minutes or less, guaranteed." },
            { icon: "🍽", title: "Top Quality", desc: "Partnered with the best restaurants using fresh, premium ingredients only." },
            { icon: "💳", title: "Easy Payment", desc: "Pay with UPI, cards, wallets or cash. 100% secure and encrypted." },
            { icon: "🎁", title: "Daily Offers", desc: "Exclusive deals, combo offers and loyalty rewards every single day." },
          ].map((item) => (
            <div className="why-card" key={item.title}>
              <div className="why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-content">
          <h2>Get 20% Off Your First Order!</h2>
          <p>Use code <strong>TOMATO20</strong> at checkout</p>
          <button className="btn-white large" onClick={() => document.getElementById("menu").scrollIntoView({ behavior: "smooth" })}>Order Now 🍅</button>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2 className="logo">Tomato 🍅</h2>
            <p>Fresh taste. Fast delivery. Happy customers. Order from the best restaurants near you.</p>
            <div className="socials">
              <span>📘</span><span>📸</span><span>🐦</span><span>▶</span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#menu">Menu</a>
            <a href="#why">Offers</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">FAQ</a>
            <a href="#">Track Order</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <p>📞 +91 98765 43210</p>
            <p>✉ support@tomato.com</p>
            <p>🕒 9 AM – 11 PM Daily</p>
            <p>📍 Ghaziabad, UP, India</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Tomato. All Rights Reserved.</p>
          <p>Made with ❤ in India</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
