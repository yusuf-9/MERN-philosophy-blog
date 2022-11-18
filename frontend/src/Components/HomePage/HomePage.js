import React, {useEffect, useState} from "react";
import "./HomePage.css";
import IntroImg from "./intro-image.jpg";
import Showcase from "../ArticleShowcase/Showcase"
import { NavLink } from 'react-router-dom'
import Articles from "../Article/ArticlesObject";
import axios from "axios"

function HomePage() {

    // Defining state
    const [TopArticles, setTopArticles] = useState(null)
    const [SlideArticles, setSlideArticles] = useState(null)
    const [error, setError] = useState("loading..")

    // using useeffect with it's functions
    useEffect(()=>{
        axios.get("/home",).then((x)=>{
            if(x.data.status === "success"){
                setTopArticles(x.data.data)
                setSlideArticles(x.data.x)
            }else{
                setError("Something went wrong. Please come back later")
                console.log(x.data)
            }
        })
    }, [])

    // Object holding data to be used in html
    const object = {
        next: ">",
        prev: "<",
        slide1Url: `/article/${Articles[2].name}`,
        slide2Url: `/article/${Articles[1].name}`,
        slide3Url: `/article/${Articles[5].name}`,
        slideArticles: {},
        topArticles: {},
        variable: 1
    }
    // HTML being returned
    return (
        TopArticles && SlideArticles ? (
        <>
            <div className="intro-wrap">
                <button className="nav-buttons next" onClick={nextAndPrevBtns}>{object.next}</button>
                <button className="nav-buttons prev hidden" onClick={nextAndPrevBtns}>
                    {object.prev}</button>
                <div className="intro-page slide-1 active">
                    <img src={IntroImg} className="intro-img" />
                    <span id="intro-heading">Welcome to my Blog</span>
                    <span id="intro-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, deleniti
                        consequatur. Impedit, velit. Harum necessitatibus maxime voluptatibus ex impedit,
                    </span>
                    <NavLink to="/articles" className="button link">
                        <button>View all articles</button>
                    </NavLink>
                </div>
                <div className="intro-page slide-2">
                    <img src={`/ArticleImages/${SlideArticles[0].image}`} className="intro-img" />
                    <span id="intro-heading">{SlideArticles[0].heading}</span>
                    <span id="intro-text">{SlideArticles[0].description}
                    </span>
                    <NavLink to={`/article/${SlideArticles[0].heading.split(" ").join("_")}`} className="button link">
                        <button>Read Article</button>
                    </NavLink>
                </div>
                <div className="intro-page slide-3">
                    <img src={`/ArticleImages/${SlideArticles[1].image}`} className="intro-img" />
                    <span id="intro-heading">{SlideArticles[1].heading}</span>
                    <span id="intro-text">{SlideArticles[1].description}
                    </span>
                    <NavLink to={`/article/${SlideArticles[1].heading.split(" ").join("_")}`} className="button link">
                        <button>Read Article</button>
                    </NavLink>
                </div>
                <div className="intro-page slide-4">
                    <img src={`/ArticleImages/${SlideArticles[2].image}`} className="intro-img" />
                    <span id="intro-heading">{SlideArticles[2].heading}</span>
                    <span id="intro-text">{SlideArticles[2].description}
                    </span>
                    <NavLink to={`/article/${SlideArticles[2].heading.split(" ").join("_")}`} className="button link">
                        <button>Read Article</button>
                    </NavLink>
                </div>
            </div>
            <Showcase data={TopArticles}/>
        </>) : 
        <div className="intro-wrap">
            <p>{error}</p>    
        </div>
                
    )
    // Front end javascript
    function nextAndPrevBtns(event){
        const prevAndNextBtns = document.querySelectorAll(".nav-buttons");
        const nextBtn = prevAndNextBtns[0];
        const prevBtn = prevAndNextBtns[1];
        const introWrap = document.querySelector(".intro-wrap");
        const introWrapChildren = Array.from(introWrap.children);
        var left100 = "-100%";
        var right100 = "100%";
        var zero = "0%";

        // these are all the functions

        function nextSlideMover(x) {
            introWrapChildren[x].style.setProperty("--position", left100);
            introWrapChildren[x + 1].style.setProperty("--position", zero);
            introWrapChildren[x].classList.remove("active");
            introWrapChildren[x + 1].classList.add("active");
        }
        function prevSlideMover(x) {
            introWrapChildren[x].style.setProperty("--position", right100);
            introWrapChildren[x - 1].style.setProperty("--position", zero);
            introWrapChildren[x].classList.remove("active");
            introWrapChildren[x - 1].classList.add("active");
        }
        function slideTextAnimationAdder(y) {
            if (event.target.classList.contains("next")) {
                let articleChildElements = Array.from(introWrapChildren[y + 1].children);
                articleChildElements.forEach((x) => {
                    if (articleChildElements.indexOf(x) == 0) { }
                    else {
                        x.style.animation = "intro-text-opacity 1s ease-in"
                    }
                })
            } else {
                let articleChildElements = Array.from(introWrapChildren[y - 1].children);
                articleChildElements.forEach((x) => {
                    if (articleChildElements.indexOf(x) == 0) { }
                    else {
                        x.style.animation = "intro-text-opacity 1s ease-in"
                    }
                })
            }

        }
        function slideTextAnimationRemover(x) {
            const articleChildElements2 = Array.from(introWrapChildren[x].children);
            articleChildElements2.forEach((x) => {
                if (articleChildElements2.indexOf(x) == 0) { }
                else {
                    x.style.animation = ""
                }
            })
        }

        //end of functions

        if (event.target.classList.contains("next")) {
            if (introWrapChildren[2].classList.contains("active")) {
                nextSlideMover(2);
                prevBtn.classList.remove("hidden");
                slideTextAnimationAdder(2);
                slideTextAnimationRemover(2);
            }
            else if (introWrapChildren[3].classList.contains("active")) {
                nextSlideMover(3)
                slideTextAnimationAdder(3);
                slideTextAnimationRemover(3);
            }
            else if (introWrapChildren[4].classList.contains("active")) {
                nextSlideMover(4)
                nextBtn.classList.add("hidden");
                slideTextAnimationAdder(4);
                slideTextAnimationRemover(4);
            }
        }
        else {
            if (introWrapChildren[3].classList.contains("active")) {
                prevSlideMover(3);
                prevBtn.classList.add("hidden");
                slideTextAnimationAdder(3);
                slideTextAnimationRemover(3);

            }
            else if (introWrapChildren[4].classList.contains("active")) {
                prevSlideMover(4);
                slideTextAnimationAdder(4);
                slideTextAnimationRemover(4);
            }
            else if (introWrapChildren[5].classList.contains("active")) {
                prevSlideMover(5);
                slideTextAnimationAdder(5);
                nextBtn.classList.remove("hidden");
                slideTextAnimationRemover(5);
            }
        }
    }
}

export default HomePage

