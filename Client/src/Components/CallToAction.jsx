import React from 'react'
import "./CallToAction.css"

const CallToAction = () => {
  return (
    <div className="d-flex justify-content-center align-items-center border custom-border rounded-custom p-3 mb-3">
      <div className="flex-1">
        <h2>Discover Our Latest Stories</h2>
        <p>Stay up-to-date with our latest blog posts, news, and updates.</p>
        <button className="logo btn self-center d-grid">
          <a
            href="your-link-2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-white"
          >
            Button 2
          </a>
        </button>
      </div>
      <div class="rounded p-4 bg-light">
        <img
          src="https://th.bing.com/th/id/OIP.SYP-5TfxfAsf98eAlaJhJQAAAA?rs=1&pid=ImgDetMain"
          alt="Responsive image"
          class="img-fluid border border-secondary rounded shadow"
        />
      </div>
    </div>
  );
}

export default CallToAction