import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute: React.FC = () => {
    const { user, isAdmin } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    
    return <Outlet />;
}; 