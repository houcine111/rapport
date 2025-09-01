import React from "react";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
     const token = localStorage.getItem("token");
    if(!token) {
        return <Navigate to="/" replace />;
    }
   const payload = JSON.parse(atob(token.split('.')[1]));
   const now = Date.now() / 1000;
   if (payload.exp < now) {
       localStorage.removeItem('token');
        return <Navigate to="/" replace />;
   }

  return children;
};

export default ProtectedRoute;
