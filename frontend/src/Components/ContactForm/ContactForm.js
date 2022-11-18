import React from "react";
import "./ContactForm.css";
import axios from "axios";

function ContactForm() {

    function registerUser(e) {
        e.preventDefault();

        const form = new FormData;
        form.append("name", document.getElementById("name").value.trim())
        form.append("email", document.getElementById("email").value.trim().toLowerCase())
        form.append("message", document.getElementById("message").value)
        axios.post("/contact", form).then((x) => {
            if (x.data.status === "success") {
                console.log(x.data)
            }
            else if (x.data.status === "failed") {
                document.getElementById("error").innerText = x.data.data
                console.log(x.data)
            }
        })
    }



    return (
        <div className="contact-me-container">
            <h1>Contact me</h1>
            <form action="submit" className="contact-form">
                <label htmlFor="name">Your Name</label>
                <input type="text" className="name input" id="name" placeholder="Name" required />
                <label htmlFor="email">Your Email</label>
                <input type="email" className="email input" id="email" placeholder="Email" required />
                <label htmlFor="message">Leave your message below</label>
                <textarea id="message" name="message" className="message input" placeholder="Enter your message here"></textarea>
                <button type="submit" className="submit-button" onClick={registerUser}>Submit</button>
                <span id="error"></span>
            </form>
        </div >
    )
}

export default ContactForm