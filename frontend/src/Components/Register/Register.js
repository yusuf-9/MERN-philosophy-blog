import React, { useEffect, useState } from 'react'
import "./Register.css"
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)

  function nameValidator(e) {
    if (e.target.value.trim().length < 6) {
      document.getElementById("name-error").style.color = "red"
    }
    else {
      document.getElementById("name-error").style.color = "black"
    }
  }
  function passwordValidator(e) {
    if (e.target.value.length < 6) {
      document.getElementById("password-error").style.color = "red"
    }
    else {
      document.getElementById("password-error").style.color = "black"
    }
  }
  function emailValidator(e) {
    if (e.target.value.length < 14 || !e.target.value.includes("@")) {
      document.getElementById("email-error").style.color = "red"
    }
    else {
      document.getElementById("email-error").style.color = "black"
    }
  }
  function Error(x){
    if(x === 1){
    document.getElementById('name-error').classList.remove("invisible")
  }
  else if(x === 2){
    document.getElementById('email-error').classList.remove("invisible")
  }
  else if(x === 3){
    document.getElementById('password-error').classList.remove("invisible")
  }
  else if(x === 4){
    document.getElementById('name-error').classList.add("invisible")
  }
  else if(x === 5){
    document.getElementById('email-error').classList.add("invisible")
  }
  else if(x === 6){
    document.getElementById('password-error').classList.add("invisible")

  }
}

  function registerUser(e) {
    e.preventDefault();
    var validated = true;
    if(name.trim().length < 6 || password.length < 6 || email.length < 14 || !email.includes("@")){
      validated = false
      if(name.trim().length < 6){
      document.getElementById("name-error").classList.remove("invisible")
      document.getElementById("name-error").style.color = "red"
      }
      if(password.length < 6){
      document.getElementById("password-error").classList.remove("invisible")
      document.getElementById("password-error").style.color = "red"
      }
      if(email.length < 14 || !email.includes("@")){
      document.getElementById("email-error").classList.remove("invisible")
      document.getElementById("email-error").style.color = "red"
      }
    }
    if(validated === true){
    const form = new FormData;
    form.append("name", name)
    form.append("email", email)
    form.append("password", password)
    axios.post("/register", form).then((x) => {
      if (x.data.status === "success") {
        navigate(`/registerProcess/${email}`)
      }
      else if (x.data.status === "failed") {
        document.getElementById("error").innerText = x.data.data
        console.log(x.data)
      }
      else {
        document.getElementById("error").innerText = "An error occurred. Please try again later"
        console.log(x.data.data)
      }
    })
  }
  

  }

  useEffect(() => {
    axios.get("/loginControl", { withCredentials: true }).then((x) => {
      if (x.data.status !== "success") {
        navigate("/")
      }
    })
  }, [])



  return (
    <div className="contact-me-container">
      <h1>Register</h1>
      <form className="contact-form">
        <label htmlFor="name">Your name</label>
        <input type="text" className="name input no-margin" id="name1" name="name" placeholder="Name" onFocus={()=>{Error(1)}} onBlur={()=>{Error(4)}} onChange={(e) => { setName(e.target.value); nameValidator(e) }} required />
        <span id='name-error' className='error-text invisible'>Name must be atleast 6 characters long</span>
        <label htmlFor="email">Your email</label>
        <input type="email" className="name input no-margin" id="name" name="email" placeholder="Email"  onFocus={()=>{Error(2)}} onBlur={()=>{Error(5)}} onChange={(e) => { setEmail(e.target.value); emailValidator(e) }} required />
        <span id='email-error' className='error-text invisible'>Email must be valid</span>
        <label htmlFor="password">Your password</label>
        <input type="password" className="email input no-margin" id="email" name="password" placeholder="Password"  onFocus={()=>{Error(3)}} onBlur={()=>{Error(6)}} onChange={(e) => { setPassword(e.target.value); passwordValidator(e) }} required />
        <span id='password-error' className='error-text invisible'>Password must be atleast 6 characters long</span>
        <button type="submit" className="submit-button" onClick={(event) => { registerUser(event) }}>Register</button>
        <span id='error'></span>
        <span className='link-2'>Already have an account?</span><NavLink to="/login">Click here to Log in</NavLink>
      </form>
    </div>
  )
}
