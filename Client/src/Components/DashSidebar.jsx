import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Dashsidebar.css";
import { useSelector } from "react-redux";
import { SignoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";



const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const tabFromUrl = urlparams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const { theme } = useSelector((state) => state.theme);
  const handleSignout = async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      dispatch(SignoutSuccess());
      const res = await fetch(
        "http://localhost:3000/routes/updateuser/Signout",
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign out");
      }
      navigate("/Login");

      console.log("Signed out successfully");
    } catch (error) {
      console.error("Sign-out error:", error.message);
      dispatch(signoutFailure(error.message));
    }
  };
  return (
    <div
      className={`sidebar ${
        theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      style={{
        position: "relative",
        top: "0",
        left: "0",
        zIndex: 1000,
        width: "250px",
        height: "100%", // Full height on large screens
        overflowY: "auto",
      }}
    >
      <div className="sidebar-header text-center py-4 ">
        <h4>UNBOUND VOICES</h4>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          {currentUser.isOwner ? (
            <li className="nav-item">
              <Link to="/dashboard/?tab=dasboardAdmin" className="nav-link">
                <i class="bi bi-speedometer2 mx-1"></i>
                Dashboard
              </Link>
            </li>
          ) : null}
          <Link to="/dashboard/?tab=profile" className="nav-link">
            {/* label={user} */}
            <i className="bi bi-person"></i> Profile
            {currentUser.isOwner ? (
              <span className="badge bg-success ms-2">Owner</span> // Red badge for Admin
            ) : currentUser.isAdmin ? (
              <span className="badge bg-danger ms-2">Admin</span> // Green badge for Owner
            ) : (
              <span className="badge bg-primary ms-2">User</span> // Blue badge for User
            )}
          </Link>
        </li>
        {currentUser.isAdmin ? (
          <li className="nav-item">
            <Link to="/dashboard/?tab=post" className="nav-link">
              <i className="bi bi-file-post"></i> Posts
            </Link>
          </li>
        ) : null}
        {currentUser.isOwner ? (
          <li className="nav-item">
            <Link to="/dashboard/?tab=users" className="nav-link">
              <i class="bi bi-people-fill"></i> Users
            </Link>
          </li>
        ) : null}
        {currentUser.isAdmin ? (
          <li className="nav-item">
            <Link to="/dashboard/?tab=comments" className="nav-link">
              <i class="bi bi-chat-left-text"></i> Comments
            </Link>
          </li>
        ) : null}
        {currentUser.isAdmin ? (
          <li className="nav-item">
            <Link to="/dashboard/?tab=dashSubscribers" className="nav-link">
              <i className="bi bi-substack"></i> Subscribers
            </Link>
          </li>
        ) : null}

        <li className="nav-item">
          <Link className="nav-link" onClick={handleSignout}>
            <i className="bi bi-box-arrow-right"></i> Sign Out
          </Link>
        </li>
        {/* Add more nav items as needed */}
      </ul>
    </div>
  );
};

export default DashSidebar;
