import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/Button";
import styled from "styled-components";
import Loader from "../components/Loader";
import AuthContext from "../context/AuthContext";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import Helpers from "../utils/Helpers";
import Alert from "../components/Alert";

/**
 * Edit page
 * @returns {JSX.Element}
 **/
export default function Edit() {
    const [content, setContent] = useState("");
    const [caracterCount, setCaracterCount] = useState(0);
    const [postDate, setPostDate] = useState("");
    const [emptyContent, setEmptyContent] = useState(false);
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { accessToken, updateToken, user } = useContext(AuthContext);
    const location = useLocation();
    const id = location.pathname.split("/")[2];

    useEffect(() => {
        fetch(`/api/v1/posts/${id}`, {
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
                    if (data.author !== user.id && !user.isAdmin) {
                        window.location.href = "/";
                    } else {
                        setContent(data.content);
                        setCaracterCount(data.content.length);
                        setPostDate(data.createAt);
                        if (data.content === "") {
                            setEmptyContent(true);
                        }
                        if (data.image) {
                            setImage("../" + data.image);
                        }
                        document.title = `${Helpers.siteName()} - Modifier`;
                        setLoading(false);
                    }
                }
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [accessToken, id, user.id, user.isAdmin]);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            if (
                e.target.files[0].type !== "image/jpeg" &&
                e.target.files[0].type !== "image/png" &&
                e.target.files[0].type !== "image/gif" &&
                e.target.files[0].type !== "image/webp"
            ) {
                setError("Le format de l'image n'est pas valide");
                setTimeout(() => {
                    setError("");
                }, 5000);
                return;
            } else {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
            }
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (!image) {
            if (
                content.trim() === "" ||
                content.trim().length === 0 ||
                content.trim().match(/^[\s\r ]+$/)
            ) {
                setError("Le contenu du message ne peut pas être vide");
                setTimeout(() => {
                    setError("");
                }, 5000);
                return;
            }
        }

        if (!emptyContent && content === "") {
            setError("Le contenu du message ne peut pas être vide");
            setTimeout(() => {
                setError("");
            }, 5000);
            return;
            // eslint-disable-next-line
        } else if (content === content) {
            formData.append("content", content);
        }

        if (image) {
            formData.append("image", image);
        }

        const response = await fetch(`/api/v1/posts/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (data.status === "success") {
            updateToken();
            window.location.href = "/";
        } else {
            setError(data.message);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Header />
            <Main>
                <EditForm onSubmit={handleEdit}>
                    <EditTitle>Modifier la publication</EditTitle>
                    <EditInfo>
                        <p>
                            Publié par{" "}
                            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                        </p>
                        <p>{Helpers.timeSince(postDate)}</p>
                    </EditInfo>
                    {emptyContent ? (
                        null
                    ) : (
                        <>
                            <EditTextarea
                                name="content"
                                id="content"
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    setCaracterCount(e.target.value.length);
                                    if (caracterCount > 298) {
                                        setContent(e.target.value.slice(0, 300));
                                    }
                                }}
                            />
                            <CaracterCounter>
                                {Helpers.caracterCount(caracterCount)}
                            </CaracterCounter>
                        </>
                    )}
                    <br />
                    {image ? (
                        <>
                            {preview ? (
                                <>
                                    <EditImage>
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleImageChange}
                                        />
                                        <img src={preview} alt="Appercu" />
                                    </EditImage>
                                </>
                            ) : (
                                <>
                                    <EditImage>
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleImageChange}
                                        />
                                        <img src={image} alt="Appercu" />
                                    </EditImage>
                                </>
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                    <br />
                    <EditBottom>
                        <EditLeft>
                            <EditCancel href="/">Annuler</EditCancel>
                        </EditLeft>
                        <EditRight>
                            <Button type="submit" width="auto">
                                Publier
                            </Button>
                        </EditRight>
                    </EditBottom>
                </EditForm>
                {error && <Alert message={error} />}
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
  padding: 0 1rem;
`;

const EditTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1rem auto;
`;

const EditInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  & > p {
    font-weight: 500;
    margin: 0;
    color: var(--text-color);
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: var(--base-width);
  height: 100%;
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
  padding: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const EditTextarea = styled.textarea`
  width: 100%;
  height: 5rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  outline: none;
  transition: all 0.3s ease-in-out;
  background-color: var(--white-color-alt);
  resize: none;
  margin-top: 1rem;

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--white-color-alt);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
  }

  &:focus {
    border: 1px solid var(--primary-color);
  }
`;

const CaracterCounter = styled.p`
  font-size: 0.75rem;
  color: var(--text-color);
  width: 100%;
  text-align: right;
`;

const EditImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1.25rem;
    position: relative;
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    & > img {
      filter: brightness(0.7);
    }

    &::before {
      content: url('data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="80" height="80" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cg fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"%3E%3Cpath d="M15 8h.01M11 20H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4"%2F%3E%3Cpath d="m4 15l4-4c.928-.893 2.072-.893 3 0l3 3m0 0l1-1c.31-.298.644-.497.987-.596m2.433 3.206a2.1 2.1 0 0 1 2.97 2.97L18 22h-3v-3l3.42-3.39z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      transform: translate(-50%, -50%);
      cursor: pointer;
      border: 5px solid var(--white-color);
      border-radius: 50%;
      padding: 1rem;
      background-color: #676767bf;
    }
  }

  & > input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }
`;

const EditBottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const EditLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
`;

const EditCancel = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0.8rem 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--white-color-alt);
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: var(--primary-color);
    color: var(--white-color);
    border: 1px solid var(--primary-color);
  }
`;

const EditRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
`;
