import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Alert component
 * @param {string} message
 * @returns {JSX.Element}
 **/
export default function Alert({ message }) {
    useEffect(() => {
        toast.error(message);
    }, [message]);
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            limit={1}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="light"
        />
    );
}
