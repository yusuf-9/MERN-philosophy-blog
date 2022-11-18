import React, { useState, useEffect } from "react";
import "./Article.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";




function Article() {
    // Defining states
    const [fetchedArticle, setFetchedArticle] = useState(null)
    const [activeArticle, setActiveArticle] = useState(null)
    const [admin, setAdmin] = useState()
    const [user, setUser] = useState()
    const [liked, setLiked] = useState()
    const [error, setError] = useState("loading..")
    const navigate = useNavigate()

    // Fetching article
    const article_name = useParams().article_name
    useEffect(() => {
        axios.get(`/readarticle/${article_name}`, { withCredentials: true }).then((x) => {
            if(x.data.status === "success"){
                console.log(x.data)
            if (x.data.user) {
                setUser(x.data.user)
                if (x.data.liked) {
                    setLiked(true)
                }
                if (x.data.user.role === "admin") {
                    setAdmin(true)
                }
            }
            setFetchedArticle({ mainArticle: x.data.data, moreArticles: x.data.moreArticles })
            }
            else{
                setError("Something went wrong. Please come back later.")
                console.log(x.data)
                
            }
        })
    }, [activeArticle])

    // Some frontend JS
    function buttonHover() {
        const articles = document.querySelectorAll('.article');
        Array.from(articles).forEach((x) => {
            x.addEventListener("mouseover", function () {
                const articleChildren = x.children.item(3);
                articleChildren.children[0].style.animation = "onHover 0.5s forwards"
            })
        })
        Array.from(articles).forEach((x) => {
            x.addEventListener("mouseout", function () {
                const articleChildren = x.children.item(3);
                articleChildren.children[0].style.animation = "onMouseOut 0.5s forwards"
            })
        })
    }

    function activeArticleSetter(x) {
        setActiveArticle(x)
    }

    function deleteArticle() {
        axios.delete(`/${fetchedArticle.mainArticle.heading.split(" ").join("_")}`, { withCredentials: true }).then((x) => {
            if (x.data.status === "success") {
                navigate("/articles")
            }
            else {
                navigate(`/articles`)
            }
        })
    }

    function likeButtonFunctionality(e) {
        if (!user) {
            window.alert("You need to log in to be able to leave a like")
        }
        else {
            const likeCountSpan = document.querySelector(".like-count")
            const likeCount = likeCountSpan.innerText;
            if (!e.target.classList.contains("active")) {
                axios.post(`/like/${article_name}`, { action: "like" }, { withCredentials: true }).then((x) => {
                    if (x.data.status == "success") {
                        e.target.classList.add("active");
                        likeCountSpan.innerText = Number(likeCount) + 1
                    }
                    else {
                        console.log(x)
                    }
                })

            }
            else {
                axios.post(`/like/${article_name}`, { action: "unlike" }, { withCredentials: true }).then((x) => {
                    if (x.data.status == "success") {
                        e.target.classList.remove("active");
                        likeCountSpan.innerText = likeCount - 1
                    }
                    else {
                        console.log(x)
                    }
                })
            }
        }
    }

    function Emptier() {
        const textarea = document.getElementById("write-comment")
        textarea.value = ""
    }

    function postComment() {
        const textarea = document.getElementById("write-comment")
        axios.post(`/comment/${article_name}`, { action: "post", comment: textarea.value }, { withCredentials: true }).then((x) => {
            console.log(x)

            if (x.data.status == "success") {
                const commentDiv = document.createElement("div")
                commentDiv.className = ("write-comment deletable-div")
                const imgAndName = document.createElement("div")
                imgAndName.classList.add("image-and-name")
                const img = document.createElement("img")
                img.classList.add("user-icon");
                img.src = "/Logos/user-icon.webp"
                const userName = document.createElement("span")
                userName.classList.add("username");
                userName.innerText = x.data.data.name
                const commentText = document.createElement("textarea")
                commentText.className = "write-a-comment auto-height deletable-text";
                commentText.value = x.data.data.comment
                commentText.setAttribute("readonly", true)
                const deleteBtnDiv = document.createElement("div")
                deleteBtnDiv.classList.add("comment-buttons")
                const deleteBtn = document.createElement("button")
                deleteBtn.classList.add("post-comment")
                deleteBtn.innerText = "Delete comment"
                deleteBtn.addEventListener("click", commentDeleter);
                deleteBtnDiv.append(deleteBtn);
                const textAndBtnDiv = document.createElement("div")
                textAndBtnDiv.append(commentText, deleteBtnDiv)
                imgAndName.append(img, userName)
                commentDiv.append(imgAndName, textAndBtnDiv)
                const commentSection = document.querySelector(".comment-section")
                commentSection.append(commentDiv);
                textarea.value = ""
            }
        })
    }

    function alert(e) {
        if (!user) {
            window.alert("You need to log in to be able to comment")
        }
    }

    function commentDeleter(e) {
        const commentText = e.target.parentNode.parentNode.children[0].value;
        axios.post(`/comment/${article_name}`, { action: "delete", comment: commentText }, { withCredentials: true }).then((x) => {
            if (x.data.status == "success") {
                const commentDiv = e.target.parentNode.parentNode.parentNode
                const commentSection = document.querySelector(".comment-section")
                commentSection.removeChild(commentDiv)
            }
        })
    }

    return (
        fetchedArticle ? (
            <>
                <div className="article-container-2">
                    {admin ? (
                        <>
                            <NavLink to={`/editArticle/${fetchedArticle.mainArticle.heading.split(" ").join("_")}`} id="edit">
                                <button>Edit article</button>
                            </NavLink>
                            <NavLink id="delete" onClick={deleteArticle}>
                                <button>Delete article</button>
                            </NavLink>
                        </>
                    ) : (
                        <></>
                    )}

                    <img src={`/Logos/${fetchedArticle.mainArticle.category}.jpg`} className="article-logo-img" />
                    <div className="heading-and-byline">
                        <h1 className="article-heading">{fetchedArticle.mainArticle.heading}</h1>
                        <span>{`By ${fetchedArticle.mainArticle.written_by} `}</span>  |  <span>{` ${fetchedArticle.mainArticle.date_created} `}</span>  |  <span>{` ${fetchedArticle.mainArticle.timeToRead} min read`}</span>
                    </div>
                    <div className="hr-2">
                        <hr />
                    </div>
                    <div className="article-content">
                        <p>{fetchedArticle.mainArticle.first_half}</p>
                        <img src={`/ArticleImages/${fetchedArticle.mainArticle.image}`} />
                        <p>{fetchedArticle.mainArticle.second_half}</p>
                        <div className="advertisement"></div>
                    </div>
                    <div className="hr-2">
                        <hr />
                    </div>
                    <div className="comments-and-morearticles">
                        <div className="comment-section">
                            <div className="comments-and-likes-count">
                                <h1 className="read-similar-articles-heading media-query" id="comments-heading">Comments ({fetchedArticle.mainArticle.comments.length})</h1>
                                <div className="like-button-container">
                                    {liked ? (
                                        <span className="material-symbols-outlined active" onClick={(event) => { likeButtonFunctionality(event) }}>
                                            thumb_up
                                        </span>
                                    ) : (
                                        <span className="material-symbols-outlined" onClick={(event) => { likeButtonFunctionality(event) }}>
                                            thumb_up
                                        </span>
                                    )}
                                    <span className="like-count">
                                        {fetchedArticle.mainArticle.likes.length}
                                    </span>
                                </div>
                            </div>
                            <div className="write-comment">
                                <div className="image-and-name">
                                    <img src="/Logos/user-icon.webp" className="user-icon" />
                                    {user ? (
                                        <span className="username">
                                            {user.name}
                                        </span>
                                    ) : (<span className="username"></span>)}
                                </div>
                                <div>
                                    <textarea placeholder="Leave a comment" name="comment" className="write-a-comment"
                                        id="write-comment" onClick={(event)=>{alert(event)}}></textarea>
                                    {user ? (
                                        <div className="comment-buttons">
                                            <button className="cancel-comment" onClick={Emptier}>Cancel</button>
                                            <button className="post-comment" onClick={postComment}>Post</button>
                                        </div>
                                    ) : (<></>)}

                                </div>
                            </div>
                            {fetchedArticle.mainArticle.comments.map((x) => {
                                if (user) {
                                    if (user.email == x.email) {
                                        return (<div className="write-comment deletable-div">
                                            <div className="image-and-name">
                                                <img src="/Logos/user-icon.webp" className="user-icon" />
                                                <span className="username">
                                                    {x.name}
                                                </span>
                                            </div>
                                            <div>
                                                <textarea className="write-a-comment auto-height deletable-text" value={x.comment}
                                                ></textarea>
                                                <div className="comment-buttons">
                                                    {user && user.email == x.email && (
                                                        <button className="post-comment" onClick={(event) => { commentDeleter(event) }}>Delete comment</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                    else {
                                        return (<div className="write-comment">
                                            <div className="image-and-name">
                                                <img src="/Logos/user-icon.webp" className="user-icon" />
                                                <span className="username">
                                                    {x.name}
                                                </span>
                                            </div>
                                            <div>
                                                <textarea className="write-a-comment auto-height deletable-text" value={x.comment}
                                                ></textarea>
                                                <div className="comment-buttons">
                                                </div>
                                            </div>
                                        </div>)
                                    }
                                }
                                else {
                                    return (<div className="write-comment">
                                        <div className="image-and-name">
                                            <img src="/Logos/user-icon.webp" className="user-icon" />
                                            <span className="username">
                                                {x.name}
                                            </span>
                                        </div>
                                        <div>
                                            <textarea className="write-a-comment auto-height deletable-text" value={x.comment}
                                            ></textarea>
                                            <div className="comment-buttons">
                                            </div>
                                        </div>
                                    </div>
                                    )
                                }

                            })}

                        </div>
                        <div className="more-articles">
                            <h1 className="read-similar-articles-heading media-query">Read similar articles</h1>
                            <div className="article-showcase-2 exception-showcase">
                                {
                                    fetchedArticle.moreArticles.map((z) => {
                                        let link = `/article/${z.heading.split(" ").join("_")}`;
                                        return (
                                            <div className="article exception new-size" key={z.heading} onMouseOver={buttonHover}>
                                                <img src={`/ArticleImages/${z.image}`} className="article-background" />
                                                <img src={`/Logos/${z.category}.jpg`} className="article-logo" />
                                                <div className="article-text">
                                                    <p>{z.heading}</p>
                                                    <span>{z.date_created}</span> | <span>{`${z.timeToRead} min read`}</span>
                                                </div>
                                                <div className="button-wrap">
                                                    <NavLink to={link} onClick={(link) => { activeArticleSetter(link) }} className="button-link">
                                                        <button className="toggle-button">Read article</button>
                                                    </NavLink>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>

                    </div>
                    <div className="advertisement"></div>
                </div>
            </>
        ) :
            (
                <div className="article-container-2">
                    <p>{error}</p>
                </div>
            )
    )
}




export default Article;