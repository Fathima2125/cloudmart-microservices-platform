import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../services/productApi";
import { addToCart } from "../services/cartApi";

import { CartContext } from "../context/cartContextValue";
import { getProductImage } from "../utils/productImages";

import "../styles/Products.css";

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cartItems, setCartItems } = useContext(CartContext);

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await getProductById(id);

        setProduct(response.data.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  // ---------------------------
  // ADD TO CART FUNCTION
  // ---------------------------
  const handleAddToCart = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login first");
        return;
      }

      const response = await addToCart({
        user_id: user.id,
        product_id: product.id,
        quantity: 1
      });

      setCartItems([
        ...cartItems,
        response.data.data
      ]);

      alert("Added to cart");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to add to cart"
      );

    }

  };

  // ---------------------------
  // LOADING STATE
  // ---------------------------
  if (loading) {
    return <div className="page-container"><h2>Loading...</h2></div>;
  }

  // ---------------------------
  // PRODUCT NOT FOUND
  // ---------------------------
  if (!product) {
    return <div className="page-container"><h2>Product not found</h2></div>;
  }

  // ---------------------------
  // UI
  // ---------------------------
  return (

    <section className = "product-detail page-container">

      <div className="product-detail-visual">
        <img
          src={getProductImage(product)}
          alt={product.name}
        />
      </div>

      <div className="product-detail-info">
        <span className="eyebrow">{product.category}</span>

        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <div className="product-facts">
          <span>Price: AED {Number(product.price).toFixed(2)}</span>
          <span>Stock: {product.stock_quantity}</span>
        </div>

        <button onClick={handleAddToCart}>
          Add To Cart
        </button>
      </div>

    </section>

  );

}

export default ProductDetails;
