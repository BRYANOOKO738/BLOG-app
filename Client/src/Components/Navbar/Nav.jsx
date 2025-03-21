import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/Theme/themeSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const toggleSearchBar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tetiary">
        <div className="container-fluid">
          <a className="navbar-brand border rounded-pill p-2 logo" href="#">
            UNBOUND VOICES
          </a>
          <div className="mx-auto d-flex">
            <form
              id="SEARCH"
              role="search"
              className={`search-container d-flex ${
                isExpanded ? "expanded" : ""
              }`}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                style={{
                  display: isExpanded ? "block" : "none",
                  transition: "all 0.3s ease",
                }}
              />
              <i
                className="bi bi-search"
                onClick={toggleSearchBar}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#050819",
                  marginLeft: "5px",
                }}
              ></i>
            </form>
            <div
              className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0 ">
                <li className="nav-item">
                  <Link to="/" className="nav-link active" aria-current="page">
                    Home
                  </Link>
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
                <div className=" d-lg-flex justify-content-between flex-wrap lg">
                  <li className="nav-item dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle p-0"
                      type="button"
                      id="dropdownThemeButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ background: "transparent", border: "none" }}
                    >
                      {theme === "light" ? (
                        <i
                          className="bi bi-brightness-high-fill"
                          style={{ fontSize: "1.5rem", color: "#050819" }}
                        ></i>
                      ) : (
                        <i
                          className="bi bi-moon-fill"
                          style={{ fontSize: "1.5rem", color: "#050819" }}
                        ></i>
                      )}
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownThemeButton"
                      style={{ marginTop: "0.5rem" }}
                    >
                      <li
                        className="dropdown-item"
                        onClick={() => dispatch(toggleTheme())}
                      >
                        {theme === "light"
                          ? "Switch to Dark Mode"
                          : "Switch to Light Mode"}
                      </li>
                    </ul>
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
                          src={currentUser.image}
                          alt="User Avatar"
                          className="rounded-circle"
                          style={{ width: "40px", height: "40px" }}
                          onError={(e) => {
                            e.target.src =
                              "https://www.pngkit.com/png/full/281-2812821_user-account-management-logo-user-icon-png.png";
                          }}
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
                            className="text-decoration-none text-dark dropdown-item"
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
                </div>
              </ul>
            </div>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavCollapse}
            aria-controls="navbarSupportedContent"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span
              className={`navbar-toggler-icon ${
                isNavCollapsed ? "" : "d-none"
              }`}
            ></span>
            <span className={`${isNavCollapsed ? "d-none" : ""}`}>
              &#x25B2;
            </span>
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;
