import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Helpers from "../utils/Helpers";

/**
 * 404 page
 * @returns {JSX.Element}
 **/
export default function NotFound() {
  document.title = `${Helpers.siteName()} - 404`;
  return (
    <Main>
      <Title>404</Title>
      <SubTitle>Cette page n'existe pas.</SubTitle>
      <Back to={"/"}>Retourner à l'accueil</Back>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 1rem;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--tertiary-color);
  font-weight: 600;
  margin-bottom: 1rem;
`;
const Back = styled(Link)`
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
  color: var(--tertiary-color);
  border-bottom: 1px solid var(--tertiary-color);
`;
