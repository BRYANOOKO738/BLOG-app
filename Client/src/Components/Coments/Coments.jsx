import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Coments.css";
import Comment from "../Comment";
import PostCard from "../PostCard";

const Comments = ({ PostId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setcomments] = useState([]);
  const [recentPost, setrecentPost] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  const handleSubmit = async (e) => {
    const token = getAuthToken();
    e.preventDefault();
    if (comment.length < 0) {
      alert("Comment cannot be empty!");
      return;
    }
    const res = await fetch(
      "http://localhost:3000/routes/comment/CreateComments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: comment,
          PostId,
          userId: currentUser.id,
        }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setComment("");
      setSuccessMessage("Comment Added successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setcomments([data, ...comments]);
      setComment("");
    } else {
      setErrorMessage(data.error || "An error occurred");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/routes/comment/getAllPost/${PostId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setcomments(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getComments();
  }, [PostId]);

  useEffect(() => {
    try {
      const fetchrecentPost = async () => {
        const res = await fetch(
          `http://localhost:3000/routes/Publish/getpost?limit=3`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setrecentPost(data.posts);
        }
      };
      fetchrecentPost();
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(recentPost);

  return (
    <div className="" style={{ margin: "50px" }}>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {currentUser ? (
        <div className="d-flex align-items-center mb-4">
          <p className="mr-2">Signed in as:</p>
          <img
            src={currentUser.image}
            alt={currentUser.username}
            className="img-fluid rounded-circle mr-2"
            style={{ width: "50px", height: "auto" }}
          />
          <Link to="/dashboard/?tab=profile" className="text-decoration-none">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="">
          <p>Sign In to Comment</p>
          <Link className="text-decoration-none" to="/Login">
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <div className="justify-content-center">
          <form
            onSubmit={handleSubmit}
            className=" dark:bg-gray-800 rounded-lg shadow-md p-6 justify-content-center border rounded"
          >
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your comment
              </label>
              <div className="relative">
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none comment-form"
                  required
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400">
                  {500 - comment.length} characters remaining
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={comment.length === 0}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      )}
      {comments.length === 0 ? (
        <p>No Comments Yet</p>
      ) : (
        <div>
          <div>
            Comments{" "}
            <span
              className="badge"
              style={{ backgroundColor: "blue", color: "white" }}
            >
              {comments.length}
            </span>
          </div>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      <div className="">
        <h3 className="text-center">Recent Articles</h3>
        <div className="row">
          {recentPost &&
            recentPost.map((post) => (
              <div className="col-12 col-md-6 col-lg-4" key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Comments;
