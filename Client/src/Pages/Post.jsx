import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../Components/Post.css";
import CallToAction from "../Components/CallToAction";
import Coments from "../Components/Coments/Coments";

const Post = () => {
  const [loading, setloading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, seterror] = useState(false);
  const { postSlug } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setloading(true);
        const res = await fetch(
          `http://localhost:3000/routes/Publish/getpost?slug=${postSlug}`
        );
        const data = await res.json();
        if (!res.ok) {
          seterror(true);
          setloading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setloading(false);
          seterror(false);
        }
      } catch (error) {
        seterror(true);
        setloading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  return (
    <div>
      {loading && (
        <div
          class="spinner-grow text-danger justify-content-center"
          style={{ width: "3rem", height: " 3rem" }}
        ></div>
      )}
      {error && <p>Error fetching post.</p>}
      {post && (
        <div className="mx-auto p-3">
          <h2
            className="text-center text-primary font-weight-bold my-4"
            style={{
              fontSize: "2.5rem",
              textTransform: "capitalize",
              letterSpacing: "0.05em",
            }}
          >
            {post.title}
          </h2>
          <div className="d-flex justify-content-center">
            <Link
              className="btn btn-light rounded-pill "
              to={`/search?category=${post && post.category}`}
            >
              {post && post.category}
            </Link>
          </div>
          <div className="large-screen-margin mt-sm-3">
            <img
              src={post.image}
              alt=""
              className="img-fluid rounded shadow-lg"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "15px",
                imageRendering: "auto",
              }}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mx-5">
            <span aria-label="Post date">
              {post?.created_at
                ? new Date(post.created_at).toLocaleDateString()
                : "Unknown date"}
            </span>
            <span>
              {post && (post.content.length / 1000).toFixed(0)}min read
            </span>
          </div>

          <hr />
          <div
            className="mx-auto p-3 text-center post-content"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
        </div>
      )}
      <div className="container mx-auto w-100" style={{maxWidth:"1120px"}}>
        <CallToAction />
      </div>
      <div>
        <Coments PostId={post && post.id} />
      </div>
    </div>
  );
};

export default Post;
