import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "../styles/Home.css";

function Home() {
  const categories = [
    "Laptops",
    "Accessories",
    "Storage",
    "Networking",
    "Audio"
  ];

  return (
    <section className="home-page">
      <div className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Cloud-native electronics store</span>
          <h1>CloudMart</h1>
          <p>
            Discover laptops, accessories, storage, networking, and audio gear
            in one clean ecommerce experience.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="primary-link">
              Shop Products
            </Link>
            <Link to="/cart" className="secondary-link">
              View Cart
            </Link>
          </div>
        </div>

        <div className="hero-device" aria-hidden="true">
          <img src={heroImage} alt="" />
        </div>
      </div>

      <div className="category-strip">
        {categories.map((category) => (
          <Link key={category} to="/products">
            {category}
          </Link>
        ))}
      </div>

      <div className="value-grid">
        <article>
          <span>01</span>
          <h3>Curated Electronics</h3>
          <p>Focused catalog structure for high-value tech products.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Fast Checkout</h3>
          <p>Cart and order flows connected to backend services.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Cloud Ready</h3>
          <p>Built as a portfolio-ready microservice ecommerce platform.</p>
        </article>
      </div>
    </section>
  );
}

export default Home;
