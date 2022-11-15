import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import MenuDropdown from "../components/MenuDropdown";
import AuthContext from "../context/AuthContext";

/**
 * Header component
 * @returns {JSX.Element}
 **/
export default function Header() {
    const { user, authTokens } = useContext(AuthContext);

    return (
        <>
            {!authTokens ? null : (
                <Head>
                    <Topbar>
                        <TopbarLeft>
                            <Link to="/">
                                <img
                                    width={156}
                                    src="/images/logo.svg"
                                    alt="Logo de Groupomania"
                                />
                            </Link>
                        </TopbarLeft>
                        <TopbarRight>
                            <p>
                                Bonjour,{" "}
                                <b>
                                    {user.username.charAt(0).toUpperCase() +
                                        user.username.slice(1)}
                                </b>
                            </p>
                            <MenuDropdown />
                        </TopbarRight>
                    </Topbar>
                </Head>
            )}
        </>
    );
}

const Head = styled.header`
  background-color: var(--light-background-color);
  border-bottom: 1px solid var(--border-color);
  width: 100%;
  height: 60px;
  z-index: 999;
`;

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: var(--base-width);
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 1.25rem;
    width: 100%;
  }
`;

const TopbarLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  @media (max-width: 768px) {
    & > p {
      display: none;
    }
  }
`;
