import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
   const [isExpanded, setIsExpanded] = useState(false);

   const toggleSearchBar = () => {
     setIsExpanded(!isExpanded);
   };
  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand border rounded-pill p-2 logo" href="#">
            UNBOUND VOICES
          </a>
          <div className="mx-auto d-flex">
            <form
              id="SEARCH"
              role="search"
              className={`search-container ${
                isExpanded ? "expanded" : ""
              } d-flex `}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                style={{
                  visibility:
                    isExpanded || window.innerWidth > 768
                      ? "visible"
                      : "hidden",
                }}
              />
              <i className="bi bi-search" onClick={toggleSearchBar}></i>
            </form>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">
                    About
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">
                    Contact
                  </a>
                </li>
                <li class="nav-item">
                  <div class="border rounded mx-4">
                    <i class="bi bi-moon-fill fs-3"></i>
                  </div>
                </li>
                <li class="nav-item">
                  <button type="button" class="btn btn-success">
                    Sign in
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>          
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;
