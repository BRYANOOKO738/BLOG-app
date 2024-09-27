import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const Private = () => {
  const { currentUser } = useSelector((state) => state.user); // Updated to match typical case

  return currentUser ? <Outlet /> : <Navigate to="/Login" />;
};

export default Private;
