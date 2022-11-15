import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Button from './Button'
import Alert from './Alert'
import AuthContext from '../context/AuthContext'

/**
 * Login component
 * @returns {JSX.Element}
 */
export default function Login() {
    const { loginUser, error } = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailAndPassword, setEmailAndPassword] = useState(false)

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    useEffect(() => {
        if (email === '' || password === '') {
            setEmailAndPassword(false)
        }
        if (email !== '' && password !== '') {
            setEmailAndPassword(true)
        }
    }, [email, password])

    return (
        <>
            <Form onSubmit={loginUser}>
                <Input type="text" name="email" placeholder="E-mail" value={email} onChange={handleEmailChange} autoComplete="current-email" />
                <Input type="password" name="password" placeholder="Mot de passe" value={password} onChange={handlePasswordChange} autoComplete="current-password" />
                {emailAndPassword ? (
                    <Button type="submit">Se connecter</Button>
                ) : (
                    <Button type="submit" disabled>Se connecter</Button>
                )}
            </Form>
            {error && (
                <Alert message={error.message} />
            )}
        </>
    )
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
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
`;  