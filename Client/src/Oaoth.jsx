import React from 'react'
import {GoogleAuthProvider} from '/firebase/auth'

const Oaoth = () => {
    const handleGoogleClick = async() => {
        // Google OAuth Code
        // Navigate to the Google OAuth Page
        const provider = new GoogleAuthProvider();
    };

  return (
    <div className="mt-2">
      <button
        type="button"
        className="btn btn-outline-warning "
              style={{ width: "300px" }}
              onClick={handleGoogleClick}
      >
        <i className="bi bi-google m-2"></i>
        <span className="ml-1">Continue With Google</span>
      </button>
    </div>
  );
}

export default Oaoth