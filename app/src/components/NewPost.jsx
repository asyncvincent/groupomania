import React, { useContext, useState } from "react";
import styled from "styled-components";
import AuthContext from "../context/AuthContext";
import Helpers from "../utils/Helpers";
import Alert from "./Alert";
import Button from "./Button";

/**
 * NewPost component
 * @returns {JSX.Element}
 */
export default function NewPost() {
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [caracterCount, setCaracterCount] = useState(0);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { accessToken, updateToken } = useContext(AuthContext);

  const handleImageChange = (e) => {
    if (
      e.target.files[0].type !== "image/jpeg" &&
      e.target.files[0].type !== "image/png" &&
      e.target.files[0].type !== "image/gif" &&
      e.target.files[0].type !== "image/webp"
    ) {
      setError("Le format de l'image n'est pas valide");
      setImage(null);
      setPreview(null);
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && !image) {
      setError("Veuillez entrer un contenu ou une image");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

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

    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", image);

    const response = await fetch("/api/v1/posts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    // if (data.typeof === "file_not_image") {
    //   setImage(null);
    //   setPreview(null);
    //   setError(data.error.message);
    //   setTimeout(() => {
    //     setError("");
    //   }, 5000);
    // }

    if (data.status === "error" || data.error === true) {
      setError(data.error.message) || setError(data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      updateToken();
      setContent("");
      setCaracterCount(0);
      setImage(null);
      setPreview(null);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Textarea
          id="content"
          placeholder="Quoi de neuf ?"
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
        <FormBottom>
          <FormBottomLeft>
            <Label>
              <input type="file" onChange={handleImageChange} id="file" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M15 8h.01M12 20H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5" />
                  <path d="m4 15l4-4c.928-.893 2.072-.893 3 0l4 4" />
                  <path d="m14 14l1-1c.617-.593 1.328-.793 2.009-.598M16 19h6m-3-3v6" />
                </g>
              </svg>
            </Label>
            {preview && <ImgPreview src={preview} alt="preview" width={33} />}
          </FormBottomLeft>
          <FormBottomRight>
            {content.trim() || image ? (
              <Button type="submit" width="auto">
                Publier
              </Button>
            ) : (
              <Button disabled type="submit" width="auto">
                Publier
              </Button>
            )}
          </FormBottomRight>
          {error && <Alert message={error} />}
        </FormBottom>
      </Form>
    </>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: var(--base-width);
  height: 100%;
  border: 1px solid var(--border-color);
  margin: 1rem 0;
  padding: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 5rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  outline: none;
  transition: all 0.3s ease-in-out;
  background-color: var(--white-color-alt);
  resize: none;

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

const FormBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const FormBottomLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ImgPreview = styled.img`
  width: 100px;
  margin: 0 auto;
  border-radius: 20px;
  margin-left: 1rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    border: 1px solid var(--primary-color);
  }

  & > svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--text-color);
    transition: all 0.3s ease-in-out;
  }

  &:hover > svg {
    color: var(--primary-color);
  }

  & > input {
    display: none;
  }
`;

const FormBottomRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: 1rem;
`;
