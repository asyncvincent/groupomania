import styled from "styled-components";

/**
 * Separator component
 * @returns {JSX.Element}
 **/
export default function Separator() {
  return <SeparatorContainer></SeparatorContainer>;
}

const SeparatorContainer = styled.div`
  width: 100%;
  height: 0.0625rem;
  background-color: var(--border-color);
  margin: 1rem 0;
`;
