import React, { useState } from "react";
import "../Components/Navbar/Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  SigninFailure,
  SigninSuccess,
  signinStart,
} from "../redux/user/userSlice"; // Updated action name
import { useDispatch } from "react-redux";
import Oaoth from "../Oaoth";


const Signin = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch(signinStart()); // Corrected typo
   const res = await fetch("http://localhost:3000/routes/Auth/login", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ email, password }),
   })
     .then((res) => {
       if (res.ok) {
         return res.json().then((data) => {          

           // Check if access_token exists in the response data
           if (data.access_token) {
             // Store the access_token in localStorage
             localStorage.setItem("access_token", data.access_token);
            //  console.log("Access token stored in localStorage");
           } else {
             console.warn("Access token not found in the response");
           }

           return data;
         });
       } else {
         return res.json().then((data) => {
           console.error("Error data:", data);
           throw new Error(data.error);
         });
       }
     })
     .then((data) => {
       dispatch(SigninSuccess(data));
       setSuccessMessage("Login successful");
       navigate("/");
     })
     .catch((error) => {
       setError(error.message);
       setSuccessMessage("");
       dispatch(SigninFailure(error.message)); // Updated to send the correct error message
     });
  };

  return (
    <div>
      <div className="row" style={{ marginTop: "150px", height: "100%" }}>
        <div
          style={{ width: "100vw" }}
          className="my-auto col justify-content-center"
        >
          <Link
            className="navbar-brand border rounded-pill p-2 logo text-center d-flex  align-items-center  justify-content-center"
            to="#"
          >
            UNBOUND VOICES
          </Link>
          <p className="text-center align-items-center justify-content-center">
            Welcome back! Log in to continue exploring blogs, leave comments,
            and stay updated with the latest posts from your favorite authors.
          </p>
        </div>
        <div style={{ width: "100vw", height: "100%" }} className="col">
          <form onSubmit={handleSubmit}>
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
                onChange={(e) => setemail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex flex-column">
              <button
                type="submit"
                className="btn btn-primary mt-2"
                style={{ width: "300px" }}
              >
                Log in
              </button>
              <Oaoth />
              <Link to="/register" className="text-decoration-none">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>          
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signin;
