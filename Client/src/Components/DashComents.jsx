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
            <h5 className="modal-title text-danger">Delete Comment</h5>
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
            <strong>Are you sure you want to delete this Comment?</strong>
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

const Dashcomments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(true);
  const [error, setError] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLastMonthComments, setTotalLastMonthComments] = useState(0);
  const { theme } = useSelector((state) => state.theme);

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `http://localhost:3000/routes/comment/getAllComents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized: Please log in again.");
          }
          const errorText = await res.text();
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${errorText}`
          );
        }

        const data = await res.json();

        if (Array.isArray(data.comments)) {
          setComments(data.comments);
          setTotalComments(data.totalComments); // Set total comments
          setTotalLastMonthComments(data.totalLastMonthComments); // Set total last month comments
          setShow(data.comments.length >= 6);
        } else {
          setComments([]);
          setShow(false);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(error.message);
        setComments([]);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser?.isAdmin]);

  const handleShow = async () => {
    try {
      const token = getAuthToken();
      const startIndex = comments.length;
      const res = await fetch(
        `http://localhost:3000/routes/comment/getAllComents?startIndex=${startIndex}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok && Array.isArray(data.comments)) {
        setComments((prevComments) => [...prevComments, ...data.comments]);
        setShow(data.comments.length >= 5);
      }
    } catch (error) {
      console.error("Error fetching more comments:", error);
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    const token = getAuthToken();
    try {
      const res = await fetch(
        `http://localhost:3000/routes/comment/comments/${commentToDelete}`,
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
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentToDelete)
        );
        console.log(data.message);
      } else {
        console.error("Failed to delete comment:", data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError(error.message);
    }
    setShowModal(false);
    setCommentToDelete(null);
  };

  // Guard clause for loading state or no data
  if (!comments) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div
      className={`container ${theme === "dark" ? "bg-secondary" : "bg-white"}`}
    >
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Display total comments and comments from the last month */}
      <div className="alert alert-info">
        <strong>Total Comments:</strong> {totalComments} <br />
        <strong>Total Comments from Last Month:</strong>{" "}
        {totalLastMonthComments}
      </div>

      {/* Table for large screens */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Created Date</th>
              <th>Comment Content</th>
              <th>User ID</th>
              <th>Comment ID</th>
              <th>Post ID</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td>{new Date(comment.created_at).toLocaleDateString()}</td>
                <td>{comment.comment_text}</td>
                <td>{comment.user_id}</td>
                <td>{comment.id}</td>
                <td>{comment.post_id}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setShowModal(true);
                      setCommentToDelete(comment.id);
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
      <div className="d-md-none">
        {comments.map((comment) => (
          <div key={comment.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Comment ID: {comment.id}</h5>
              <p className="card-text">{comment.comment_text}</p>
              <p>
                <strong>Date Created:</strong>{" "}
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>User ID:</strong> {comment.user_id}
              </p>
              <p>
                <strong>Post ID:</strong> {comment.post_id}
              </p>
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setShowModal(true);
                    setCommentToDelete(comment.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {show && comments.length > 0 && (
        <div className="d-flex justify-content-center mb-3">
          <button onClick={handleShow} className="btn btn-primary w-100 mb-3">
            Show More
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

export default Dashcomments;
