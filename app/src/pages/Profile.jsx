import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import Loader from "../components/Loader";
import AuthContext from "../context/AuthContext";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import Helpers from "../utils/Helpers";

/**
 * Profile page
 * @returns {JSX.Element}
 **/
export default function Profile({ history }) {
    const [error, setError] = useState("");
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { user, accessToken, deleteUser } = useContext(AuthContext);
    const location = useLocation();
    const username = location.pathname.split("/")[1];

    useEffect(() => {
        fetch(`/api/v1/users/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "error") {
                    window.location.href = "/404";
                } else {
                    setData(data.results);
                    setLoading(false);
                    document.title = `${Helpers.siteName()} - @${data.results.username}`;
                }
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [accessToken, username]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Header />
            <Main>
                <ProfileWrapper>
                    {!data.avatar ? (
                        <ProfileImg
                            src={Helpers.createAvatar(data.username)}
                            alt={data.username}
                        />
                    ) : (
                        <ProfileImg width={40} src={data.avatar} alt={data.username} />
                    )}
                    <ProfileUsername>@{data.username}</ProfileUsername>
                    <ProfileInfos>
                        {data.firstname} {data.lastname}
                    </ProfileInfos>
                    <ProfileDate>
                        Membre depuis le {new Date(data.createAt).toLocaleDateString()}
                    </ProfileDate>
                    <ProfileEmail>{data.email}</ProfileEmail>
                    {user.username === data.username ? (
                        <Button onClick={() => deleteUser(data._id)} width="auto">
                            Supprimer mon compte
                        </Button>
                    ) : (
                        null
                    )}
                    {error ? <p>{error}</p> : null}
                </ProfileWrapper>
            </Main>
            <Footer />
        </>
    );
}

const Main = styled.main`
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

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: var(--base-width);
  height: 100%;
  border: 1px solid var(--border-color);
  padding: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProfileImg = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
`;

const ProfileUsername = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--tertiary-color);
`;

const ProfileInfos = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: capitalize;
  color: var(--tertiary-color);
`;

const ProfileEmail = styled.p`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--tertiary-color);
`;

const ProfileDate = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: var(--text-color);
`;
