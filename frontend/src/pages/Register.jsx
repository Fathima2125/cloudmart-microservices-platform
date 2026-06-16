import { useState }
from "react";

import {
  registerUser
}
from "../services/authApi";

import "../styles/Login.css";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await registerUser({
            name,
            email,
            password
          });

        alert(
          response.data.message
        );

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Registration failed"
        );

      }

    };

  return (

    <section className="auth-page">

      <div className="auth-card">
        <span className="eyebrow">Create account</span>
        <h1>Register</h1>
        <p>Join CloudMart and start shopping cloud-ready electronics.</p>

      <form
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

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
          Register
        </button>

      </form>

      </div>

    </section>

  );
}

export default Register;
