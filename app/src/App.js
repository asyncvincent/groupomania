import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { AuthProvider } from "./context/AuthContext";
import routes from "./routes";
/**
 * App component
 * @returns
 */
export default function App() {
    return (
        <AppContainer>
            <AuthProvider>
                <Router>
                    <Routes>
                        {routes.map((route, index) => (
                            <Route key={index} path={route.path} element={route.element}>
                                {route.children &&
                                    route.children.map((child, index) => (
                                        <Route
                                            key={index}
                                            path={child.path}
                                            element={child.element}
                                        />
                                    ))}
                            </Route>
                        ))}
                    </Routes>
                </Router>
            </AuthProvider>
        </AppContainer>
    );
}

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
