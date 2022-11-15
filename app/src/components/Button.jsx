import styled from "styled-components";

/**
 * Button component
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 */
export default function Button({ children, ...props }) {
  return <ButtonContainer {...props}>{children}</ButtonContainer>;
}

const ButtonContainer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.width ? "auto" : "100%")};
  padding: 0.8rem 0.5rem;
  border: none;
  background-color: ${(props) =>
    props.disabled ? "var(--disabled-color)" : "var(--primary-color)"};
  color: var(--white-color);
  font-size: 1rem;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) =>
    props.disabled ? "var(--disabled-color)" : "var(--hover-color)"};
  }
`;
