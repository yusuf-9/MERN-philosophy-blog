import React from "react";
import "./Showcase.css"
import { NavLink } from 'react-router-dom'
import Articles from "../Article/ArticlesObject";




class Showcase extends React.Component {
    constructor(props) {
        super(props);

    }

    
    componentDidMount(){
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
    
    render() {
        return (
            <div className="article-container">
                <h1>Top articles</h1>
                <NavLink to='/articles' className="view-all-articles">View all articles</NavLink>
                <div className="article-showcase">
                {this.props.data.map((x) => {
                        let link = `/article/${x.heading.split(" ").join("_")}`;
                        return (
                            <div className="article" key={x.heading}>
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
                
            </div>
        )
    }
}
export default Showcase;