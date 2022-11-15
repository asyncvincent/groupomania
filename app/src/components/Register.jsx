import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import AuthContext from "../context/AuthContext";
import Alert from "./Alert";
import Button from "./Button";

/**
 * Register component
 * @returns {JSX.Element}
 */
export default function Register() {
    const { registerUser, error } = useContext(AuthContext);
    const [err, setErr] = useState("");
    const [preview, setPreview] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    //eslint-disable-next-line
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files[0].type !== "image/jpeg"
            && e.target.files[0].type !== "image/png") {
            setImage(null);
            setPreview(null);
            setErr("Le format de l'image n'est pas valide");
            setTimeout(() => {
                setErr("");
            }, 5000);
            return;
        }

        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    useEffect(() => {
        if (password === "" || confirmPassword === "") {
            setPasswordsMatch(false);
        }
        if (password === confirmPassword) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    }, [password, confirmPassword, password.length]);

    return (
        <>
            <Form onSubmit={registerUser}>
                <Input type="text" name="username" placeholder="Nom d'utilisateur" autoComplete="current-username" />
                <Input type="text" name="firstname" placeholder="Prénom" autoComplete="current-firstname" />
                <Input type="text" name="lastname" placeholder="Nom" autoComplete="current-lastname" />
                <Input type="text" name="email" placeholder="E-mail" autoComplete="current-email" />
                <Input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                />
                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    autoComplete="current-password"
                />
                <LabelImg htmlFor="file">
                    Choisir une photo
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 9l5-5l5 5m-5-5v12"
                        />
                    </svg>
                </LabelImg>
                <Input
                    type="file"
                    name="avatar"
                    id="file"
                    onChange={handleImageChange}
                />
                {preview && <ImgPreview src={preview} alt="preview" />}
                {passwordsMatch ? (
                    <Button type="submit">S'inscrire</Button>
                ) : (
                    <Button type="submit" disabled>S'inscrire</Button>
                )}
                {error || err ? (
                    <Alert message={error.message || err} />
                ) : null}
            </Form>
        </>
    );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
`;

const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0.5rem 0;
  border: 1px solid var(--border-color);
  outline: none;
  transition: all 0.3s ease-in-out;
  background-color: var(--white-color-alt);

  &:focus {
    border: 1px solid var(--primary-color);
    background-color: var(--white-color);
  }

  &[type="file"] {
    display: none;
  }
`;

const LabelImg = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    height: 2.5rem;
    padding: 0 1rem;
    margin: 0.5rem 0;
    color: var(--title-color);
    background-color: var(--white-color-alt);
    font-weight: 700;
    transition: all 0.3s ease;
    text-align: center;

  &:hover {
    background-color: var(--secondary-color);
  }

  svg {
    margin-left: 0.8rem;
    vertical-align: middle;
  }
`;

const ImgPreview = styled.img`
  width: 3.75rem !important;
  height: 3.75rem;
  border-radius: 50%;
  margin: 1rem 0;
  transition: all 0.3s ease;
  object-fit: cover;
`;
