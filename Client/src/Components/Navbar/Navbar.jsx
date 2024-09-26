import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import AvatarDropdown from "../AvatarDropdown";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const toggleSearchBar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand border rounded-pill p-2 logo" href="#">
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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Contact
                  </a>
                </li>
                <li className="nav-item">
                  <div className="border rounded mx-4">
                    <i className="bi bi-moon-fill fs-3"></i>
                  </div>
                </li>
                {currentUser ? (
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle p-0"
                      type="button"
                      id="dropdownAvatarButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ background: "transparent", border: "none" }}
                    >
                      <img
                        src={currentUser.image} // Your avatar image
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px" }} // Set the size of the avatar
                      />
                    </button>
                    <ul
                      className="dropdown-menu m-3"
                      aria-labelledby="dropdownAvatarButton"
                    >
                      <li>
                        <div className="text-danger dropdown-item">
                          @{currentUser.username}
                        </div>
                      </li>
                      <li>
                        <span className="dropdown-item text-truncate">
                          {currentUser.email}
                        </span>
                      </li>
                      <hr />
                      <li>
                        <Link
                          to="/dashboard"
                          className="text-decoration-none text-dark  dropdown-item"
                        >
                          <div>Profile</div>
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item" href="#/logout">
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link to="/Login" type="button" className="btn btn-success">
                    Sign in
                  </Link>
                )}
              </ul>
            </div>
          </div>
          <button
            className="navbar-toggler"
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
