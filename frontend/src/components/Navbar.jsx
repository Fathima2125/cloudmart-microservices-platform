import { Link } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/authContextValue";

import "../styles/Navbar.css";

function Navbar() {

  const {
    user,
    logout
  } = useContext(AuthContext);

  return (

    <nav className ="navbar">

      <Link to="/" className= "logo">
        <span className="logo-mark">C</span>
        <span>CloudMart</span>
      </Link>

     <div className="nav-links">

      <Link to="/">
        Home
      </Link>

      <Link to="/products">
        Products
      </Link>

      <Link to="/cart">
        Cart
      </Link>

      <Link to="/orders">
        Orders
      </Link>

      <Link to="/notifications">Notifications</Link>

      {user ? (

        <>

          <span className="nav-user">
            Hi, {user.name}
          </span>

          <button
            className="nav-button"
            onClick={logout}
          >
            Logout
          </button>

        </>

      ) : (

        <>

          <Link to="/login" className="nav-auth-link">
            Login
          </Link>

          <Link to="/register" className="nav-cta">
            Register
          </Link>

        </>

      )}
    </div>

    </nav>

  );
}

export default Navbar;
