import styled from "styled-components";

/**
 * Loader component
 * @returns {JSX.Element}
 */
export default function Loader() {
  return (
    <LoaderContainer>
      <LoaderContent></LoaderContent>
    </LoaderContainer>
  );
}

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: var(--light-background-color);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
`;

const LoaderContent = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid var(--primary-color);
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
