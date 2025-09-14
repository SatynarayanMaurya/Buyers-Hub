import React from "react";
import { Navigate } from "react-router-dom";

function Homepage() {
  return <Navigate to="/buyers" replace />;
}

export default Homepage;
