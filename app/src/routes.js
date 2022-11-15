import PrivateRoute from "./utils/PrivateRoute";
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const useRoutes = [
    {
        element: <PrivateRoute />,
        children: [
            { path: "/:username", element: <Profile /> },
            { path: "/edit/:id", element: <Edit /> },
        ],
    },
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
    {
        path: "/404",
        element: <NotFound />,
    },
];

export default useRoutes;