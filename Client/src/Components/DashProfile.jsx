import React, { useState} from "react";
import { useSelector } from "react-redux";
import "./DashProfile.css";
import { Link } from "react-router-dom";

const DashProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);

    // Toggle edit mode
    const handleEdit = () => {
      setIsEditing(!isEditing);
    };
  return (
    <div className="d-flex flex-column align-items-center">
      <h3 className="text-center">Profile</h3>
      <div style={{ width: "100px" }}>
        <img
          src={currentUser.image}
          alt="user img"
          className="rounded-circle"
          style={{ width: "100%" }}
        />
      </div>
      <form>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            defaultValue={currentUser.username}
            onFocus={handleEdit} // Enable editing on focus
            onBlur={handleEdit} // Disable editing when losing focus (optional)
            readOnly={!isEditing} // Toggle read-only mode
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={currentUser.email}
            onFocus={handleEdit} // Enable editing on focus
            onBlur={handleEdit} // Disable editing when losing focus (optional)
            readOnly={!isEditing} // Toggle read-only mode
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="**********"
            onFocus={handleEdit} // Enable editing on focus
            onBlur={handleEdit} // Disable editing when losing focus (optional)
            readOnly={!isEditing} // Toggle read-only mode
          />
        </div>
        <button type="submit" className="btn btn-outline-primary mb-3">
          Update Profile
        </button>
        <div className="d-flex justify-content-between">
          <div className="mx-5">
            <Link href="#" className="text-decoration-none text-warning">
              Change Password
            </Link>
          </div>
          <div>
            <Link href="#" className="text-decoration-none text-danger">
              Delete Account
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DashProfile;
