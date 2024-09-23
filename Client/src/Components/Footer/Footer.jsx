import React from 'react'

const Footer = () => {
  return (
    <div style={{ backgroundColor: "#050819", color: "white" }}>
      <div className="row">
        <div className="col text-decoration-none">
          <h3>About</h3>
          <ul>
            <li>
              <a href="#" className="text-decoration-none text-white">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none text-white">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none text-white">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none text-white">
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
        {/* <div className='col'>
                  <h3>Subscribe</h3>
                  <form>
                    <input type="email" placeholder="Enter your email address" />
                    <button type="submit">Subscribe</button>
                  </form>
              </div> */}
        <div className="col">
          <h3>Categories</h3>
          <ul>
            <li>
              <a href="#" className="text-decoration-none text-white">
                Technology
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none text-white">
                Business
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none text-white">
                Sports
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none text-white">
                World
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none text-white">
                Entertainment
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="d-flex justify-content-between mx-3">
        <a href="#">
          <i class="bi bi-facebook"></i>
        </a>
        <a href="#">
          <i class="bi bi-twitter-x"></i>
        </a>
        <a href="#">
          <i class="bi bi-instagram"></i>
        </a>
        <a href="#">
          <i class="bi bi-linkedin"></i>
        </a>
        <a href="#">
          <i class="bi bi-youtube"></i>
        </a>
      </div>
      <p className="text-center mt-2">
        Copyright © {new Date().getFullYear()} Unbound voices. All rights
        reserved.
      </p>
    </div>
  );
}

export default Footer