import React, { useEffect, useState } from "react";
import moment from "moment";
import "./Comment.css";

const Comment = ({ comment }) => {
  const { id, content, likeCount = 0 } = comment;
  const [user, setuser] = useState({});
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/routes/updateuser/${comment.user_id}`
        );
        const data = await res.json();
        if (res.ok) {
          setuser(data);
        } else {
          console.log("Error fetching user data");
        }
      } catch (error) {}
    };
    getUser();
  }, [comment]);
  const [likes, setLikes] = useState(likeCount);
  const [isLiked, setIsLiked] = useState(false); // Whether the user has liked the comment

  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  useEffect(() => {
    // Check if the user has liked the comment initially
    const checkIfLiked = async () => {
      const token = getAuthToken();
      const res = await fetch(
        `http://localhost:3000/routes/comment/hasLiked/${comment.user_id}/${comment.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setIsLiked(data.isLiked);
    };

    checkIfLiked();
  }, [comment.user_id]);

  const handleLikeToggle = async () => {
    const token = getAuthToken();
    try {
      if (isLiked) {
        // Unlike the comment
        const res = await fetch(
          `http://localhost:3000/comment/unlikeComment/${comment.user_id}/${comment.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          setLikes(likes - 1); // Decrease like count on unlike
        }
      } else {
        // Like the comment
        const res = await fetch(
          `http://localhost:3000/comment/${comment.id}/like`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          setLikes(likes + 1); // Increase like count on like
        }
      }
      setIsLiked(!isLiked); // Toggle like/unlike state
    } catch (error) {
      console.error("Error while liking/unliking the comment:", error);
    }
  };

  return (
    <div className="d-flex border rounded p-3 commt">
      <div>
        <img
          src={user.image}
          alt={user.username}
          className="img-fluid  rounded-circle bg-secondary mx-2"
          style={{ width: "50px" }}
        />
      </div>
      <div>
        <div className="mb-2">
          <span className="fw-1 mx-3 ">
            {user ? `@${user.username}` : "Anonymous user"}
          </span>
          <span className="text-secondary mx-3 truncate">
            {moment(comment.created_at).fromNow()}
          </span>
        </div>
        <p className="text-secondary my-sm-3">{comment.comment_text}</p>
        <div>
          <span>Likes: {likes}</span>
          <button
            onClick={handleLikeToggle}
            className="like-button"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            {isLiked ? (
              <i class="bi bi-hand-thumbs-up-fill text-primary"></i> // Liked state (blue icon)
            ) : (
              <i class="bi bi-hand-thumbs-up"></i> // Unliked state (gray icon)
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
