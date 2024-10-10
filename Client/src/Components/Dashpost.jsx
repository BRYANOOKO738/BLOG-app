import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./Table.css";
import { Link } from "react-router-dom";

const SimpleModal = ({ showModal, setShowModal, handleDelete }) => {
  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{
        display: showModal ? "block" : "none",
        position: "absolute",
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1050,
        width: "300px",
      }}
    >
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-danger">Delete Post</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="d-flex justify-content-center text-secondary">
            <i className="bi bi-exclamation-circle fs-3"></i>
          </div>
          <div className="modal-body text-danger">
            <strong>Are you sure you want to delete this post?</strong>
            <p className="text-warning">This action cannot be reversed</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashpost = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [post, setPost] = useState([]);
  const [show, setshow] = useState(true);

  useEffect(() => {
    const fetchpost = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/routes/Publish/getpost?author_id=${currentUser.id}`
        );
        const data = await res.json();
        if (res.ok) {
          setPost(data.posts);
          if (data.posts.length < 6) {
            setshow(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchpost();
    }
  }, [currentUser.id]);

  const { theme } = useSelector((state) => state.theme);

  const handleShow = async () => {
    const startindex = post.length;
    try {
      const res = await fetch(
        `http://localhost:3000/routes/Publish/getpost?author_id=${currentUser.id}&startindex=${startindex}`
      );
      const data = await res.json();
      if (res.ok) {
        setPost([...post, ...data.posts]);
        if (data.posts.length < 5) {
          setshow(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
  };
  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  const handleDelete = async () => {
    const token = getAuthToken();
    if (postToDelete) {
      try {
        const res = await fetch(
          `http://localhost:3000/routes/Publish/deletepost/${postToDelete}/${currentUser.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setPost(post.filter((p) => p.id !== postToDelete));
          console.log(data.message); // Log the success message
        } else {
          console.error("Failed to delete post:", data.message);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
      setShowModal(false);
      setPostToDelete(null);
    }
  };

  return (
    <div
      className={`container ${theme === "dark" ? "bg-secondary" : "bg-white"}`}
    >
      {/* Table for large screens */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Date Updated</th>
              <th>Post Image</th>
              <th>Post Title</th>
              <th>Category</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {post.map((post) => (
              <tr key={post.id}>
                <td>{new Date(post.updated_at).toLocaleDateString()}</td>
                <td>
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="img-fluid rounded"
                      style={{ width: "100px", height: "95px" }}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/post/${post.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {post.title}
                  </Link>
                </td>
                <td>{post.category}</td>
                <td>
                  <Link
                    to={`/update-post/${post.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setShowModal(true);
                      setPostToDelete(post.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked view for small screens */}
      <div className="d-md-none" style={{ position: "relative" }}>
        {post.map((post) => (
          <div key={post.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">
                <Link
                  to={`/post/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {post.title}
                </Link>
              </h5>
              <Link to={`/post/${post.slug}`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="img-fluid mb-3 rounded"
                  style={{ height: "230px" }}
                />
              </Link>
              <p>
                <strong>Date Updated:</strong>{" "}
                {new Date(post.updated_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Category:</strong> {post.category}
              </p>
              <div className="d-flex justify-content-between">
                <Link
                  to={`/update-post/${post.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setShowModal(true);
                    setPostToDelete(post.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {show && (
        <div className="d-flex justify-content-center mb-3">
          <button
            onClick={handleShow}
            className="btn btn-primary w-100 mb-3 logo"
          >
            SHOW MORE ▼▼
          </button>
        </div>
      )}

      <SimpleModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Dashpost;
