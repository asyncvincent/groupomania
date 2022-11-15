import React, { useContext } from "react";
import styled from "styled-components";
import Separator from "../components/Separator";
import AuthContext from "../context/AuthContext";
import Login from "../components/Login";
import Posts from "../components/Posts";
import NewPost from "../components/NewPost";
import Register from "../components/Register";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import Helpers from "../utils/Helpers";

/**
 * Home page
 * @returns {JSX.Element}
 **/
export default function Home() {
    document.title = `${Helpers.siteName()}`;
    const { accessToken } = useContext(AuthContext);
    const [showLogin, setShowLogin] = React.useState(true);
    const [showRegister, setShowRegister] = React.useState(false);

    const toggleLogin = () => {
        setShowLogin(!showLogin);
        setShowRegister(false);
    };

    const toggleRegister = () => {
        setShowRegister(!showRegister);
        setShowLogin(false);
    };

    return (
        <>
            <Header />
            {accessToken ? (
                <>
                    <MainHome>
                        <NewPost />
                        <Posts />
                    </MainHome>
                </>
            ) : (
                <>
                    <MainLogin>
                        {showLogin && (
                            <Wrapper>
                                <img
                                    src="/images/logo.svg"
                                    alt="Logo Groupomania"
                                    width={200}
                                    height={30}
                                />
                                <Text>Connectez-vous à votre compte</Text>
                                <Login />
                                <Separator />
                                <Text>
                                    Pas encore de compte ?
                                    <b onClick={toggleRegister}>Inscrivez-vous</b>
                                </Text>
                            </Wrapper>
                        )}

                        {showRegister && (
                            <Wrapper>
                                <img
                                    src="/images/logo.svg"
                                    alt="Logo Groupomania"
                                    width={200}
                                    height={30}
                                />
                                <Text>Inscrivez-vous</Text>
                                <Register />
                                <Separator />
                                <Text>
                                    Vous avez déjà un compte ?
                                    <b onClick={toggleLogin}>Connectez-vous</b>
                                </Text>
                            </Wrapper>
                        )}
                    </MainLogin>
                </>
            )}
            <Footer />
        </>
    );
}

const MainHome = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 0 1.25rem;
  }
`;

const MainLogin = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  padding: 1rem;
  width: 18.75rem;
  transition: all 0.3s ease-in-out;
`;

const Text = styled.p`
  color: var(--tertiary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;

  b {
    color: var(--primary-color);
    cursor: pointer;
    font-weight: 700;
    transition: all 0.3s ease-in-out;

    &:hover {
      color: var(--hover-color);
    }
  }
`;
