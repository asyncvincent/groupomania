import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
const AuthContext = createContext();
export default AuthContext;

/**
 * AuthProvider component
 * @returns
 */
export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwt_decode(localStorage.getItem("authTokens"))
            : null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /**
     * Login user and set authTokens in localStorage
     * @required: email, password
     * @returns
     */
    let loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: e.target.email.value.toLowerCase(),
                password: e.target.password.value,
            }),
        });
        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            setError(data);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    /**
     * Logout user and remove authTokens from localStorage
     * @returns
     */
    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    /**
     * Register user and set authTokens in localStorage
     * @required: email, password, username, firstname, lastname
     * @optional: avatar
     * @returns
     */
    let registerUser = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("avatar", e.target.file.files[0]);
        formData.append("username", e.target.username.value);
        formData.append("firstname", e.target.firstname.value);
        formData.append("lastname", e.target.lastname.value);
        formData.append("email", e.target.email.value);
        formData.append("password", e.target.password.value);

        let response = await fetch("/api/v1/auth/register", {
            method: "POST",
            body: formData,
        });
        let data = await response.json();
        if (response.status === 201) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            setError(data);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    /**
     * Delete user and redirect to home
     * @returns
     */
    let deleteUser = async (id) => {
        let response = await fetch(`/api/v1/users/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authTokens.access}`,
            },
        });
        let data = await response.json();
        if (response.status === 200) {
            window.location.href = "/";
        } else {
            setError(data);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    /**
     * Update token and user data in localStorage
     * @returns
     */
    let updateToken = async () => {
        if (authTokens) {
            let response = await fetch("/api/v1/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authTokens.refresh}`,
                },
            });
            let data = await response.json();
            if (response.status === 200) {
                setAuthTokens(data);
                setUser(jwt_decode(data.access));
                localStorage.setItem("authTokens", JSON.stringify(data));
            } else {
                localStorage.removeItem("authTokens");
                logoutUser();
                window.location.reload();
            }
        } else {
            setLoading(false);
        }

        if (user) {
            setLoading(false);
        }
    };

    /**
     * Set context data
     */
    let contextData = {
        user: user,
        authTokens: authTokens,
        accessToken: authTokens ? authTokens.access : null,
        refreshToken: authTokens ? authTokens.refresh : null,
        loginUser: loginUser,
        logoutUser: logoutUser,
        updateToken: updateToken,
        registerUser: registerUser,
        deleteUser: deleteUser,
        loading: loading,
        error: error,
        setError: setError,
    };

    /**
     * Refresh token every 3 minutes
     */
    useEffect(() => {
        if (loading) {
            updateToken();
        }
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, 1000 * 60 * 3);
        return () => clearInterval(interval);
        //eslint-disable-next-line
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
