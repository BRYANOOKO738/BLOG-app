import React, { useEffect, useState } from "react";
import moment from "moment";
import "./Comment.css"
const Comment = ({ comment }) => {
  const [user, setuser] = useState({});
  console.log(user);
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
      </div>
    </div>
  );
};

export default Comment;
