import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div
      className="rounded mt-4 "
      style={{
        backgroundColor: "#050819",
        color: "whitesmoke",
        marginBottom: "0px",
      }}
    >
      <div className="mx-lg-5 mx-md-2 row justify-content-center">
        <div className="col mt-2">
          <div className="logo btn rounded-pill">Unbound Voices</div>
          <p>
            At Unbound Voices, we believe every story deserves to be heard and
            every perspective valued. Founded in 2024, our platform is a digital
            sanctuary for writers and storytellers from all backgrounds to share
            their unique narratives.
          </p>
          <div className="row">
            <div className="col">
              <i class="bi bi-tiktok tiktok"></i>
            </div>
            <div className="col">
              <i class="bi bi-youtube youtube"></i>
            </div>
            <div className="col">
              <i class="bi bi-instagram instagram"></i>
            </div>
            <div className="col">
              <i class="bi bi-facebook facebook"></i>
            </div>
          </div>
        </div>
        <div className="col mt-2 mx-3">
          <h2>Contact Us</h2>

          <p>
            <span>
              <i class="bi bi-geo-alt-fill fs-4"></i>
            </span>
            123 Main St, City, State, ZIP
            <br />
            <span>
              <i class="bi bi-telephone-fill fs-4"></i>
            </span>
            (123) 456-7890
            <br />
            <span>
              <i class="bi bi-envelope-at-fill fs-4"></i>
            </span>
            support@unboundvoices.org
          </p>
        </div>
        <div className="col mt-2">
          <h2>Quick links</h2>
          <ul>
            <li>
              <a
                href="#"
                className="text-decoration-none"
                style={{ color: "inherit" }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-decoration-none"
                style={{ color: "inherit" }}
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-decoration-none"
                style={{ color: "inherit" }}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-decoration-none"
                style={{ color: "inherit" }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="col mt-2">
          <div class="newsletter-signup">
            <h5 class="text-center">Subscribe to our weekly Newsletter</h5>
            <form>
              <div class="mb-3">
                <label for="email" class="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" class="btn btn-warning w-100">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <hr />
      <p className="text-center">
        &copy; {new Date().getFullYear()} Unbound Voices. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
