import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const ISAdminPrivate = () => {
  const { currentUser } = useSelector((state) => state.user); // Updated to match typical case

  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to="/Login" />;
};

export default ISAdminPrivate;
