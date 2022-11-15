import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";
import Separator from "../components/Separator";
import ReactTooltip from "react-tooltip";
import Helpers from "../utils/Helpers";
import AuthContext from "../context/AuthContext";
import Alert from "./Alert";
import { Link } from "react-router-dom";

/**
 * Posts component
 * @returns {JSX.Element}
 */
export default function Posts() {
  const { accessToken } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, updateToken } = useContext(AuthContext);
  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  let page = 1;

  const fecthData = async () => {
    await fetch(`/api/v1/posts?limit=20&page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.posts);
        setLoading(false);
        setCurrentPage(data.page);
        if (data.nextTotalcount === 0) {
          setLastPage(true);
          setFirstPage(false);
        } else {
          setLastPage(false);
          setFirstPage(true);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fecthData();
    //eslint-disable-next-line
  }, [accessToken]);

  const handleNextPage = () => {
    setLoading(true);
    page = currentPage + 1;
    fecthData(page);
  };

  const handlePrevPage = () => {
    setLoading(true);
    page = currentPage - 1;
    fecthData(page);
  };

  const handleLike = (id) => {
    fetch(`/api/v1/posts/like/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        updateToken(data.token);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/v1/posts/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.success === true) {
      updateToken();
    } else {
      setError(data.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {data
        ? data.map((post, index) => {
          return (
            <Post key={index}>
              <PostHeader>
                <PostHeaderLeft>
                  {!post.author.avatar ? (
                    <PostAvatar
                      src={Helpers.createAvatar(post.author.username)}
                      alt={"Avatar de " + post.author.username}
                    />
                  ) : (
                    <PostAvatar
                      width={40}
                      src={post.author.avatar}
                      alt={"Avatar de " + post.author.username}
                    />
                  )}
                  <PostInfo>
                    <PostName>
                      {post.author.firstname} {post.author.lastname}
                      {post.author.isAdmin && (
                        <svg
                          data-tip="Administrateur"
                          data-place="bottom"
                          data-effect="solid"
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="#929aae"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 10h3V7L6.5 3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1-3 3l-6-6a6 6 0 0 1-8-8L7 10"
                          />
                        </svg>
                      )}
                    </PostName>
                    <PostInfoText>
                      <PostUsername href={`/${post.author.username}`}>
                        @{post.author.username}
                      </PostUsername>
                      ·{" "}
                      <PostDate>{Helpers.timeSince(post.createAt)}</PostDate>
                    </PostInfoText>
                  </PostInfo>
                </PostHeaderLeft>
              </PostHeader>
              {post.content ? (
                <PostContent>{post.content}</PostContent>
              ) : (
                <></>
              )}
              {post.image ? <PostImg src={post.image} alt="post" /> : <></>}
              <Separator />
              <PostFooter>
                <PostFooterLeft>
                  <PostLike
                    data-tip={
                      post.likes.map((like) => like.user).includes(user.id)
                        ? "Ne plus aimer"
                        : "J'aime"
                    }
                    data-place="bottom"
                    data-effect="solid"
                    onClick={() => {
                      handleLike(post._id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill={
                          post.likes
                            .map((like) => like.user)
                            .includes(user.id)
                            ? "var(--primary-color)"
                            : "none"
                        }
                        stroke={
                          post.likes
                            .map((like) => like.user)
                            .includes(user.id)
                            ? "var(--primary-color)"
                            : "var(--text-color)"
                        }
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19.5 12.572L12 20l-7.5-7.428m0 0A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
                      />
                    </svg>
                  </PostLike>
                  {!post.likes.length ? (
                    null
                  ) : (
                    <PostLikeCount>{post.likes.length}</PostLikeCount>
                  )}
                </PostFooterLeft>
                {post.author._id === user.id || user.isAdmin === true ? (
                  <PostFooterRight>
                    <Link
                      to={`/edit/${post._id}`}
                      data-tip="Modifier"
                      data-place="bottom"
                      data-effect="solid"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                          <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
                          <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3" />
                        </g>
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      data-tip="Supprimer"
                      data-place="bottom"
                      data-effect="solid"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                        />
                      </svg>
                    </button>
                  </PostFooterRight>
                ) : null}
              </PostFooter>
              <ReactTooltip />
            </Post>
          );
        })
        : null}

      {data && data.length === 0 ? null : (
        <Pagination>
          {lastPage ? null : (
            <>
              {currentPage === 1 ? null : (
                <ButtonPrev onClick={() => handlePrevPage()}>
                  Page précédente
                </ButtonPrev>
              )}
              <ButtonNext onClick={() => handleNextPage()}>
                Page suivante
              </ButtonNext>
            </>
          )}

          {firstPage ? null : (
            <>
              {currentPage === 1 ? null : (
                <ButtonPrev onClick={() => handlePrevPage()}>
                  Page précédente
                </ButtonPrev>
              )}
            </>
          )}
        </Pagination>
      )}

      {error && <Alert message={error} />}
    </>
  );
}

const Post = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: var(--base-width);
  height: 100%;
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  margin-bottom: 1rem;
`;

const PostAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
  border: 3px solid var(--border-color);
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const PostInfoText = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const PostName = styled.p`
  font-weight: 600;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    margin-left: 0.5rem;
    vertical-align: middle;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background-color: var(--border-color);
    padding: 0.25rem;
  }
`;

const PostUsername = styled.a`
  color: var(--text-color);
  margin-right: 0.1875rem;
  text-decoration: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: var(--primary-color);
  }
`;

const PostDate = styled.p`
  margin-left: 0.1875rem;
`;

const PostHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`;

const PostContent = styled.p`
  color: var(--tertiary-color);
  overflow-wrap: break-word;
  width: 100%;
  margin-bottom: 1rem;
`;

const PostImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.25rem;
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const PostFooterLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`;

const PostFooterRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 100%;

  & button,
  & a {
    background-color: transparent;
    border: none;
    text-decoration: none;
    text-align: left;
    display: block;
    color: var(--text-color);
    transition: all 0.3s ease-in-out;
    font-weight: 500;
    cursor: pointer;
    font-size: 1rem;
    text-align: center;
    margin-left: 1rem;

    &:hover {
      color: var(--primary-color);
    }

    & svg {
      width: 1.375rem;
      height: 1.375rem;
    }
  }
`;

const PostLike = styled.button`
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.3s ease-in-out;
  background-color: transparent;

  & > svg {
    transition: all 0.3s ease-in-out;
    vertical-align: middle;
    width: 1.375rem;
    height: 1.375rem;
    // fill: ${(props) => (props.liked ? "var(--primary-color)" : "none")};
    // fill: none;
  }
`;

const PostLikeCount = styled.p`
  margin-left: 0.3125rem;
  color: var(--text-color);
  font-weight: 600;
`;

const Pagination = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin-top: 1rem;
  width: var(--base-width);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ButtonPrev = styled.button`
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  transition: all 0.3s ease-in-out;
  font-weight: 600;
  font-size: 1rem;
  position: absolute;
  left: 0;

  &:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
`;

const ButtonNext = styled.button`
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  transition: all 0.3s ease-in-out;
  font-weight: 600;
  font-size: 1rem;
  position: absolute;
  right: 0;

  &:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
`;
