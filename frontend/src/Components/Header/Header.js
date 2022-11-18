import React, {useState, useEffect} from "react";
import "./Header.css";
import Logo from "./logo1.png";
import { NavLink } from 'react-router-dom'
import axios from "axios";


function Header(props) {
    const [refreshCount, setRefreshCount] = useState(props.refresh)
    const refresher = props.refresher
    const [user, setUser] = useState()

    useEffect(()=>{
        axios.get("/user", {withCredentials: true}).then((x)=>{
            if(x.data.status == "user"){
                setUser({present: true, role: x.data.user})
            }
            else{
                setUser({present: false})
            }
        })
    }, [refreshCount])
    // Adding functionality to navbar toggle button
    function toggle() {
    const links = document.querySelector(".nav-links")
        if (links.className == "nav-links") {
            var active = "0%"
            links.style.setProperty("--position", active);
            links.classList.add("active-2");
        } else {
            links.className = "nav-links";
            var notActive = "-102%";
            links.style.setProperty("--position", notActive);
        }
    }
    
    function logout(){
        axios.get("/logout", {withCredentials:true}).then((x)=>{
            if(x.data.status == "success"){
                refresher()
            }
            else{
                console.log(x)
            }
        })
    }
    if(props.refresh !== refreshCount){
        setRefreshCount(props.refresh)
    }
    return (
        user ? (
            user.present === true ? (
        <header className="navbar" >
            <NavLink to='/' onClick={()=>{setRefreshCount(refreshCount+1)}} className="Page-name">
                The Skeptic Hawk
            </NavLink>
            <img src={Logo} className="logo" />
            <ul className="nav-links">
                <NavLink to='/' className="nav-link" onClick={()=>{toggle();setRefreshCount(refreshCount+1)}}>
                    <li>Home</li>
                </NavLink>
                <NavLink to='/articles' className="nav-link"  onClick={()=>{toggle();setRefreshCount(refreshCount+1)}}>
                    <li>Articles</li>
                </NavLink>
                
                {user.role == "admin" ? (
                <NavLink to='/writeArticle' className="nav-link"  onClick={()=>{toggle();setRefreshCount(refreshCount+1)}}>
                    <li>Write an article</li>
                </NavLink>
                    
                ):(
                    <></>
                )}
                <NavLink className="nav-link"  onClick={()=>{toggle();logout()}}>
                    <li>Log out</li>
                </NavLink>
                <NavLink to='/contact' className="nav-link"  onClick={()=>{toggle();setRefreshCount(refreshCount+1)}}>
                    <li>Contact me</li>
                </NavLink>
            </ul>
            <div className="toggleBtn" title="Show navigation bar" onClick={toggle}>
                <div className="burger"></div>
                <div className="burger"></div>
                <div className="burger"></div>
            </div>
        </header>
            ):(
                <header className="navbar" >
            <NavLink to='/' onClick={()=>{setRefreshCount(refreshCount+1)}} className="Page-name">
                The Skeptic Hawk
            </NavLink>
            <img src={Logo} className="logo" />
            <ul className="nav-links">
                <NavLink to='/' className="nav-link" onClick={()=>{toggle();setRefreshCount(refreshCount+1)}}>
                    <li>Home</li>
                </NavLink>
                <NavLink to='/articles' className="nav-link" onClick={()=>{toggle();setRefreshCount(refreshCount+1)}}>
                    <li>Articles</li>
                </NavLink>
                <NavLink to='/login' className="nav-link"  onClick={()=>{toggle();setRefreshCount(refreshCount+1)}}>
                    <li>Login</li>
                </NavLink>
                <NavLink to='/contact' className="nav-link"  onClick={()=>{toggle();setRefreshCount(refreshCount+1)}}>
                    <li>Contact me</li>
                </NavLink>
            </ul>
            <div className="toggleBtn" title="Show navigation bar" onClick={toggle}>
                <div className="burger"></div>
                <div className="burger"></div>
                <div className="burger"></div>
            </div>
        </header>
            )
        ):(
            <header className="navbar">
                <p>Loading..</p>
            </header>
        )
    )
}

export default Header;