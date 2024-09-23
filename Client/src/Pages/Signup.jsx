import React, { useState } from "react";
import "../Components/Navbar/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Renamed to `password` for consistency
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/routes/Auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }), // Consistent naming
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error);
          });
        }
      })
      .then(() => {
        setSuccessMessage(`Signup successful! Welcome, ${username}`);
        setError("");
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
        setSuccessMessage("");
      });
  };

  return (
    <div className="row" style={{ marginTop: "150px", height: "100%" }}>
      <div
        style={{ width: "100vw" }}
        className="my-auto col justify-content-center"
      >
        <Link
          className="navbar-brand border rounded-pill p-2 logo text-center d-flex align-items-center justify-content-center"
          to="#" // Changed `href` to `to`
        >
          UNBOUND VOICES
        </Link>
        <p className="text-center align-items-center justify-content-center">
          Create an account to join our blogging community. Share your thoughts,
          follow your favorite authors, and explore new content. It only takes a
          few seconds!
        </p>
      </div>
      <div
        style={{ width: "100vw", height: "100%" }}
        className="col d-flex justify-content-center"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label text-center justify-content-center">
              Username:
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              style={{ width: "300px" }}
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Fixed the correct state setter
              required
            />
          </div>
          <div>
            <label className="form-label text-center justify-content-center">
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              style={{ width: "300px" }}
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label text-center justify-content-center">
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              style={{ width: "300px" }}
              className="form-control"
              value={password} // Consistent naming
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-flex flex-column" style={{ width: "300px" }}>
            <button className="btn btn-primary mt-2" type="submit">
              Register
            </button>
            <Link to="/Login" className="text-decoration-none">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default Signup;
