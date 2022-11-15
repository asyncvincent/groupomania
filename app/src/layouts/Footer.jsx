import React from "react";
import styled from "styled-components";

/**
 * Footer component
 * @returns {JSX.Element}
 **/
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <FooterContainer>
            <p> &copy; {currentYear} - Groupomania</p>
        </FooterContainer>
    );
}

const FooterContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 5rem;

  p {
    color: var(--tertiary-color);
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
  }
`;
