import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * PrivateRoute component
 * @returns
 */
export default function PrivateRoute() {
    const { authTokens } = useContext(AuthContext);
    return authTokens ? <Outlet /> : <Navigate to="/" />;
}
