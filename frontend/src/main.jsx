import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./styles/Global.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <AuthProvider>

    <BrowserRouter>

      <CartProvider>

        <App />

      </CartProvider>

    </BrowserRouter>

  </AuthProvider>

);
