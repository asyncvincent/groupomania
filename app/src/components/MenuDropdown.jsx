import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Helpers from "../utils/Helpers";

/**
 * MenuDropdown component
 * @returns {JSX.Element}
 */
export default function MenuDropdown() {
    const { user, logoutUser } = useContext(AuthContext);
    const [menu, setMenu] = useState(false);

    useEffect(() => {
        const closeMenu = () => {
            setMenu(false);
        };
        document.addEventListener("click", closeMenu);
        return () => {
            document.removeEventListener("click", closeMenu);
        };
    }, []);

    return (
        <>
            <Dropdown
                onClick={(e) => {
                    e.stopPropagation();
                    setMenu(!menu);
                }}
            >
                {!user.avatar ? (
                    <DropdownImage
                        src={Helpers.createAvatar(user.username)}
                        alt={"Avatar de " + user.username}
                    />
                ) : (
                    <DropdownImage
                        width={40}
                        src={user.avatar}
                        alt={"Avatar de " + user.username}
                    />
                )}
                <DropdownWrapper menu={menu}>
                    <Link to={`/${user.username}`}>Mon profil</Link>
                    <Link to="/" onClick={logoutUser}>
                        Se déconnecter
                    </Link>
                </DropdownWrapper>
            </Dropdown>
        </>
    );
}

const Dropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const DropdownImage = styled.img`
  object-fit: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 1rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 3px solid var(--border-color);

  &:hover {
    border: 3px solid var(--primary-color);
  }
`;

const DropdownWrapper = styled.div`
    position: absolute;
    top: 55px;
    right: 0;
    min-width: 150px;
    background: var(--light-background-color);
    border: 1px solid var(--border-color);
    opacity: ${(props) => (props.menu ? "1" : "0")};
    visibility: ${(props) => (props.menu ? "visible" : "hidden")};
    transition: all 0.3s ease-in-out;
    z-index: 10;

    & > a {
        display: block;
        color: var(--title-color);
        transition: all 0.3s ease-in-out;
        padding: 0.8rem 1rem;
        font-weight: 500;

        &:hover {
            color: var(--primary-color);
        }
`;
