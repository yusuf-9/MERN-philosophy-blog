import React, {useState, useEffect} from "react";
import "./ArticlesSection.css";
import Articles from "../Article/ArticlesObject";
import { NavLink } from "react-router-dom";
import axios from "axios"


function ArticlesSection(){
    // Defining states
    const [fetchedArticles, setFetchedArticles] = useState(null)
    const [pageNumber, setpageNumber] = useState(0)
    const [Filter, setFilter] = useState("")
    const [error, setError] = useState("loading..")

    // Useeffect
    useEffect(()=>{
        axios.get(`/fetcharticles/?page=${pageNumber}&${Filter}`).then((x)=>{
            if(x.data.status === "success"){
                setFetchedArticles({articles: x.data.data, page: x.data.page})
            }
            else{
                setError("Something went wrong. Please come back later")
                console.log(x.data)
            }
        })
    }, [pageNumber, Filter])
    // Some frontend JS
    const articleFilter = (e) => {
        let activeFilter = e.target.parentNode;
        const articles = Array.from(document.querySelectorAll(".article"));
        if (!activeFilter.classList.contains("active")) {
            activeFilter.classList.add("active");
            activeFilter.children[0].classList.add("activated-img")
            activeFilter.children[1].classList.add("activated-span")
            console.log(activeFilter.children)
            let activeFilters = Array.from(document.querySelectorAll(".topic-name")).filter((x) => { return x.classList.contains("active") })
            let innerText = activeFilters.map((x) => {
                return x.children[1].innerText;
            });
            const articles = Array.from(document.querySelectorAll(".article"));
            let hiddenArticles = articles.filter((x) => {
                return !innerText.includes(x.classList[1])
            })
            let notHiddenArticles = articles.filter((x) => {
                return innerText.includes(x.classList[1])
            })
            notHiddenArticles.forEach((x) => {
                if (x.classList.contains("hidden")) {
                    x.classList.remove("hidden")
                }
            })
            hiddenArticles.forEach((x) => {
                x.classList.add("hidden")
            })
        }
        else {
            activeFilter.classList.remove("active");
            activeFilter.children[0].classList.remove("activated-img")
            activeFilter.children[1].classList.remove("activated-span")
            let activeFilters = Array.from(document.querySelectorAll(".topic-name")).filter((x) => { return x.classList.contains("active") })
            if (activeFilters.length > 0) {
                let innerText = activeFilters.map((x) => {
                    return x.children[1].innerText;
                });
                let hiddenArticles = articles.filter((x)=>{
                    return !innerText.includes(x.classList[1])
                })
                let notHiddenArticles = articles.filter((x)=>{
                    return innerText.includes(x.classList[1])
                })
                notHiddenArticles.forEach((x)=>{
                    if(x.classList.contains("hidden")){
                        x.classList.remove("hidden")
                    }
                })
                hiddenArticles.forEach((x)=>{
                    x.classList.add("hidden")
                })
            }
            else{
                articles.forEach((x)=>{
                    if(x.classList.contains("hidden")){
                        x.classList.remove("hidden")
                    }
                })
            }



        }

    } 
    function buttonHover(){
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
    //Changing states for pagination and filters
    function fetch(x){
        if(x == 1){
            setpageNumber(pageNumber+1)
        }
        else{
            setpageNumber(pageNumber-1)
        }
    }
    function filterChanger(x, num){
        if(!Filter.includes(x)){
            setFilter(`filter=${x}&${Filter}`)
            const topicNames = Array.from(document.querySelectorAll('.topic-name'))
            topicNames.forEach((y)=>{
                if(y.children[1].innerText.toLowerCase() == x){
                    y.children[0].classList.add("activated-img")
                    y.children[1].classList.add("activated-span")
                }
            })
            setpageNumber(0)
        }
        else{
            setFilter(Filter.replace(`filter=${x}&`, ""))
            const topicNames = Array.from(document.querySelectorAll('.topic-name'))
            topicNames.forEach((y)=>{
                if(y.children[1].innerText.toLowerCase() == x){
                    y.children[0].classList.remove("activated-img")
                    y.children[1].classList.remove("activated-span")
                }
            })
            setpageNumber(0)
        }
    }
   
        return (
            fetchedArticles ? (
            <div className="article-container low-padding">
                {fetchedArticles.page.nextPage ? (
                    <NavLink onClick={()=>{fetch(1)}} className="next-page">Next page</NavLink>
                ):(<></>)}
            {pageNumber > 0 && 
                <NavLink onClick={()=>{fetch(0)}} className="prev-page">Previous page</NavLink>
            }
            
                <div className="browse-articles">
                    <h2>Browse Articles by Topic</h2>
                    <div className="topic-names">
                        <div className="topic-set first">
                            <div className="topic-name"  onClick={()=>{filterChanger("religion")}}>
                                <img src="/Logos/religion.jpg" className="topic-img"/>
                                <span >Religion</span>
                            </div>
                            <span className="vertical-line"></span>
                            <div className="topic-name" onClick={()=>{filterChanger("epistemology")}}>
                                <img src="/Logos/epistemology.jpg" className="topic-img" />
                                <span>Epistemology</span>
                            </div>
                            <span className="vertical-line"></span>
                            <div className="topic-name" onClick={()=>{filterChanger("metaphysics")}}>
                                <img src="/Logos/metaphysics.jpg" className="topic-img" />
                                <span>Metaphysics</span>
                            </div>
                        </div>
                        <span className="vertical-line removable"></span>
                        <div className="topic-set last">
                            <div className="topic-name" onClick={()=>{filterChanger("consciousness")}}>
                                <img src="/Logos/consciousness.jpg" className="topic-img" />
                                <span>Consciousness</span>
                            </div>
                            <span className="vertical-line modified"></span>
                            <div className="topic-name" onClick={()=>{filterChanger("ethics")}}>
                                <img src="/Logos/ethics.jpg" className="topic-img" />
                                <span>Ethics</span>
                            </div>
                            <span className="vertical-line modified"></span>
                            <div className="topic-name" onClick={()=>{filterChanger("existentialism")}}>
                                <img src="/Logos/existentialism.jpg" className="topic-img" />
                                <span >Existentialism</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hr"><hr /></div>
                
                <div className="article-showcase">
                    {fetchedArticles.articles.map((x) => {
                        let link = `/article/${x.heading.split(" ").join("_")}`;
                        let categoryclass = `article ${x.category}`
                        return (
                            <div className={categoryclass} key={x.heading} onMouseOver={buttonHover}>
                                <img src={`/ArticleImages/${x.image}`} className="article-background" />
                                <img src={`/Logos/${x.category}.jpg`} className="article-logo" />
                                <div className="article-text">
                                    <p>{x.heading}</p>
                                    <span>{x.date_created}</span> | <span>{`${x.timeToRead} min read`}</span>
                                </div>
                                <div className="button-wrap">
                                    <NavLink to={link} className="button-link">
                                        <button className="toggle-button">Read article</button>
                                    </NavLink>
                                </div>
                            </div>
                        )
                    })}
            </div>
                </div>):
                (<div className="article-container low-padding">
                    <p>{error}</p>
                </div>)
        )
}

export default ArticlesSection;