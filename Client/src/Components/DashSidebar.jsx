import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Dashsidebar.css";
import { useSelector } from "react-redux";


const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const tabFromUrl = urlparams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
    const { theme } = useSelector((state) => state.theme);
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
      <div className="sidebar-header text-center py-4">
        <h4>UNBOUND VOICES</h4>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/dashboard/?tab=profile" className="nav-link">
            <i className="bi bi-person"></i> Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/logout" className="nav-link">
            <i className="bi bi-box-arrow-right"></i> Sign Out
          </Link>
        </li>
        {/* Add more nav items as needed */}
      </ul>
    </div>
  );
};

export default DashSidebar;
