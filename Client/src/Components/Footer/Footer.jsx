import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <footer
      style={{
        color: "white",
        position: "sticky",
        bottom: 0,
        width: "100%",
        zIndex: 10,
      }}
      className={`sidebar ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
    >
      <div className="row">
        <div className="col text-decoration-none">
          <h3>About</h3>
          <ul>
            <li>
              <a href="#" className="text-decoration-none">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div className="col">
          <h3>Contact Us</h3>
          <p>Email: contact@unboundvoices.com</p>
          <p>Phone: +1 123-456-7890</p>
          <p>Address: 123 Main St, Anytown, USA</p>
        </div>
        <div className="col">
          <h3>Categories</h3>
          <ul>
            <li>
              <a href="#" className="text-decoration-none">
                Technology
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                Business
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                Sports
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                World
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                Entertainment
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="d-flex justify-content-between mx-3">
        <a href="#">
          <i className="bi bi-facebook"></i>
        </a>
        <a href="#">
          <i className="bi bi-twitter-x"></i>
        </a>
        <a href="#">
          <i className="bi bi-instagram"></i>
        </a>
        <a href="#">
          <i className="bi bi-linkedin"></i>
        </a>
        <a href="#">
          <i className="bi bi-youtube"></i>
        </a>
      </div>
      <p className="text-center mt-2">
        Copyright © {new Date().getFullYear()} Unbound voices. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
