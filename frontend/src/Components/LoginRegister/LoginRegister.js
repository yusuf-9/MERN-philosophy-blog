import React, {useState, useEffect} from 'react'
import "./LoginRegister.css"
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function LoginRegister(props) {
  const navigate = useNavigate()
  const [content, setContent] = useState("login")
  const [loginMessage, setLoginMessage] = useState()
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  function login(e){
    e.preventDefault()
    const form = new FormData;
    form.append("email", email)
    form.append("password", password)
    axios.post("/login", form, {withCredentials:true}).then((x)=>{
      if(x.data.status == "login success"){
        const refresher = props.refresher
        refresher()
        navigate("/")
      }
      else if (x.data.status == "verification pending"){
        navigate(`/registerProcess/${email}`)
      }
      else{
        document.getElementById("error").innerText = x.data.data
        console.log(x.data)
      }
    })
  }

  useEffect(()=>{
    axios.get("/loginControl", {withCredentials:true}).then((x)=>{
      if(x.data.status !== "success"){
        navigate("/")
      }
    })
  },[])


    return (
      content == "login" ? (
        <div className="contact-me-container">
        <h1>Login</h1>
        <form action="/login" className="contact-form" method="post">
            <label htmlFor="email">Your email</label>
            <input type="email" className="name input" id="name" name="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} required />
            <label htmlFor="password">Your password</label>
            <input type="password" className="email input" id="email" name="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} required />
            <button type="submit" className="submit-button" onClick={(event)=>{login(event)}}>Log in</button>
            <span id='error'></span>
            <span className='link'>Don't have an account?</span><NavLink to="/register">Click here to register</NavLink>
        </form>
    </div>
    ): (
      <div className="contact-me-container">
        <h2>Login is being processed</h2>
        </div>
    )
    )
}
