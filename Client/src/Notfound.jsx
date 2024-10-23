import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div>
      <div className="container text-center mt-5">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

export default Notfound;
