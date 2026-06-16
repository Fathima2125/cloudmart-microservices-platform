import { useState, useContext}
from "react";

import {
  loginUser
}
from "../services/authApi";

import {
  AuthContext
} from "../context/authContextValue";

import "../styles/Login.css";



function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const { login } =
    useContext(AuthContext);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await loginUser({
            email,
            password
            
          });
          localStorage.setItem(
          "token",
          response.data.token
          );
        
          login(
           response.data.user
           );


        console.log(
          response.data

        );

        alert("Login successful");

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Login failed"
        );

      }

    };

  return (

    <section className="auth-page">

      <div className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>
        <p>Access your CloudMart account to manage your cart and orders.</p>

      <form
        onSubmit={handleSubmit}
      >

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button type="submit">
          Login
        </button>

      </form>

      </div>

    </section>

  );
}

export default Login;
