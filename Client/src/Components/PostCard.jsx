import React from 'react'
import { Link } from 'react-router-dom'
import "./PostCard.css"
import "bootstrap/dist/css/bootstrap.min.css";

const PostCard = ({post}) => {
  return (
    <div class="row g-4 m-2">
      <div class="col">
        <div class="card h-100 shadow-sm hover-card">
          <img
            src={post.image}
            alt={post.title}
            class="card-img-top img-fluid hover-img"
            style={{
              height: "260px",
              objectFit: "cover",
            }}
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-3">
              <Link
                to={`/post/${post.slug}`}
                class="text-decoration-none text-dark hover-title"
              >
                {post.title
                  ? post.title.length > 27
                    ? `${post.title.substring(0, 27)}...`
                    : post.title
                  : "No description available..."}
              </Link>
            </h5>
            <p class="card-text flex-grow-1">{post.excerpt}</p>
            <Link
              to={`/post/${post.slug}`}
              class="btn btn-primary mt-auto hover-btn"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard