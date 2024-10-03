import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Dashbord from "./Pages/Dashbord";
import "bootstrap-icons/font/bootstrap-icons.css";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Footer from "./Components/Footer/Footer";
import Private from "./Components/Private";
import { useParams } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Dashbord />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/Login" element={<Signin />} />
          <Route element={<Private />}>
            <Route path="/dashboard" element={<Dashbord />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
