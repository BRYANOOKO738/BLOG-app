import React from 'react'
import "./CallToAction.css"

const CallToAction = () => {
  return (
    <div className="row justify-content-center align-items-center border custom-border rounded-custom p-3 mb-3 bg-light">
      <div className="flex-1 col-md-6 " style={{color:"blue"}}>
        <h2>Discover Our Latest Stories</h2>
        <p>Stay up-to-date with our latest blog posts, news, and updates.</p>
        <button className="logo btn self-center d-grid">
          <a
            href="/more"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-white"
          >
            Study More
          </a>
        </button>
      </div>
      <div class="rounded p-1 bg-light col-md-6">
        <img
          src="https://th.bing.com/th/id/OIP.3oAp5gRTGyo854lePMmz8wHaE8?rs=1&pid=ImgDetMain"
          alt="Responsive image"
          class="img-fluid border border-secondary rounded shadow"
        />
      </div>
    </div>
  );
}

export default CallToAction