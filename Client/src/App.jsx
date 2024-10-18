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
import Private from "./Components/Private";
import { useParams } from "react-router-dom";
import Create_post from "./Pages/Create_post";
import ISAdminPrivate from "./Components/iSAdminPrivate"; 
import UpdatePost from "./Pages/UpdatePost";
import Post from "./Pages/Post";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route exact path="/" element={<Home />} />
          <Route  path="/post/:postSlug" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Dashbord />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/Login" element={<Signin />} />
          <Route element={<Private />}>
            <Route path="/dashboard" element={<Dashbord />} />
            <Route element={<ISAdminPrivate />}>
              <Route path="/Create_post" element={<Create_post />} />
              <Route path="/Update-post/:postid" element={<UpdatePost />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
