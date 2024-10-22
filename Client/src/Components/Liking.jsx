import React, { useState, useEffect } from "react";

const Comment = ({ commentId, userId, commentText }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // State to hold the like count

  // Fetch the initial like status and like count when the component mounts
  useEffect(() => {
    // Check if the user has liked the comment
    fetch(`/api/hasLiked/${userId}/${commentId}`)
      .then((response) => response.json())
      .then((data) => setLiked(data.liked))
      .catch((error) => console.error("Error fetching like status:", error));

    // Fetch the like count
    fetch(`/api/likeCount/${commentId}`)
      .then((response) => response.json())
      .then((data) => setLikeCount(data.likeCount))
      .catch((error) => console.error("Error fetching like count:", error));
  }, [userId, commentId]);

  // Function to like or unlike a comment
  const toggleLike = () => {
    if (liked) {
      // Unlike the comment
      fetch("/api/unlikeComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, commentId }),
      })
        .then((response) => response.json())
        .then(() => {
          setLiked(false); // Update the state to reflect unliking
          setLikeCount((prevCount) => prevCount - 1); // Decrease the like count
        })
        .catch((error) => console.error("Error unliking comment:", error));
    } else {
      // Like the comment
      fetch("http://localhost:3000/routes/comment/getAllPost/${PostId}/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, commentId }),
      })
        .then((response) => response.json())
        .then(() => {
          setLiked(true); // Update the state to reflect liking
          setLikeCount((prevCount) => prevCount + 1); // Increase the like count
        })
        .catch((error) => console.error("Error liking comment:", error));
    }
  };

  return (
    <div>
      <p>{commentText}</p>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Like Button */}
        <i
          className={`fa ${liked ? "fa-heart" : "fa-heart-o"}`}
          style={{ color: liked ? "red" : "black", cursor: "pointer" }}
          onClick={toggleLike}
        ></i>

        {/* Display the like count next to the like button */}
        <span style={{ marginLeft: "8px" }}>
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </span>
      </div>
    </div>
  );
};

export default Comment;
