import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route,useLocation } from "react-router-dom";
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
import Search from "./Components/Search";
import ContactForm from "./Pages/Contact";
import ContactPage from "./Pages/Contact";
import Notfound from "./Notfound";
import Footer from "./Components/Footer/Footer";
import "./App.css"
import {  useSelector } from "react-redux";
import DashSubscribers from "./Components/DashSubscribers";

function App() {
  const location = useLocation();

  // Routes where the Navbar and Footer should NOT be shown
  const hideNavbarFooterRoutes = ["/Login", "/register"];

  // Check if the current pathname is a known route
  const isRouteNotFound =
    ![
      "/",
      "/Login",
      "/register",
      "/Aboutus",
      "/Contactus",
      "/dashboard",
      "/RegisterGroup",
      "/about",
      "/contact",
      "dashSubscribers",
    ].includes(location.pathname) &&
    !location.pathname.startsWith("/dashboard");

  // Check if the Navbar and Footer should be hidden (either it's a specific route or an undefined route)
  const shouldHideNavbarFooter =
    hideNavbarFooterRoutes.includes(location.pathname) || isRouteNotFound;
const { currentUser, loading } = useSelector((state) => state.user);
  return (
    <>
      <div className="container1">
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route exact path="/" element={<Home />} />
            <Route path="/post/:postSlug" element={<Post />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<Search />} />
            <Route element={<Private />}>
              <Route path="/dashboard" element={<Dashbord />} />
              <Route element={<ISAdminPrivate />}>
                <Route path="/Create_post" element={<Create_post />} />
                <Route path="/Update-post/:postid" element={<UpdatePost />} />
              </Route>
            </Route>
          </Route>
          <Route path="/dashSubscribers" element={<DashSubscribers />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/Login" element={<Signin />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
      {!shouldHideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
