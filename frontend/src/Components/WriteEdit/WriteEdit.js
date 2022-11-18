import React, { useState, useEffect } from 'react'
import "./WriteEdit.css"
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


export default function WriteEdit() {

    // Defining states
    const navigate = useNavigate()
    const [authorized, setAuthorized] = useState("false")
    const [category, setcategory] = useState("religion");
    const [heading, setHeading] = useState(null);
    const [description, setDescription] = useState(null)
    const [firstHalf, setFirstHalf] = useState(null)
    const [secondHalf, setSecondHalf] = useState(null)
    const [image, setImage] = useState(null)

    // Post request
    function sendData(e) {
        e.preventDefault()
        let formData = new FormData()
        formData.append("category", category)
        formData.append("heading", heading)
        formData.append("description", description)
        formData.append("first_half", firstHalf)
        formData.append("second_half", secondHalf)
        formData.append("image", image)
        axios.post("/writeArticle", formData, { withCredentials: true }).then((x) => {
            if (x.data.status == "success") {
                navigate("/articles")
            }
            else {
                console.log(x)
            }
        })
    }

    useEffect(() => {
        axios.get("/user", { withCredentials: true }).then((x) => {
            if (x.data.status == "user") {
                if (x.data.user == "admin") {
                    setAuthorized("true")
                }
                else {
                    setAuthorized("false")
                    navigate("/")

                }
            }
            else {
                setAuthorized("false")
                navigate("/")

            }
        })

        function frontendJS() {
            // Displaying article image on page for preview
                const fileInput = document.querySelector(".image_upload")
                const imageDiv = document.querySelector(".article_image_preview")
                fileInput.addEventListener("change", () => {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        imageDiv.style.backgroundImage = `url(${reader.result})`
                    })
                    reader.readAsDataURL(fileInput.files[0])
                })
                // Changing logo image
                const categoryInput = document.getElementById("category");
                var category = categoryInput.value;
                const categoryLogo = document.querySelector(".logo_display")
                if (category == "religion") {
                    categoryLogo.style.backgroundImage = "url(/Logos/religion.jpg)"
                }
                categoryInput.addEventListener("change", (e) => {
                    let category = e.target.value;
                    if (category == "religion") {
                        categoryLogo.style.backgroundImage = "url(/Logos/religion.jpg)"
                    }
                    else if (category == "metaphysics") {
                        categoryLogo.style.backgroundImage = "url(/Logos/metaphysics.jpg)"
                    }
                    else if (category == "epistemology") {
                        categoryLogo.style.backgroundImage = "url(/Logos/epistemology.jpg)"
                    }
                    else if (category == "consciousness") {
                        categoryLogo.style.backgroundImage = "url(/Logos/consciousness.jpg)"
                    }
                    else if (category == "existentialism") {
                        categoryLogo.style.backgroundImage = "url(/Logos/existentialism.jpg)"
                    }
                    else {
                        categoryLogo.style.backgroundImage = "url(/Logos/ethics.jpg)"
                    }
                })
            }
        frontendJS()

    }, [])
    

    return (
            authorized == "true" ? (
                <div className="contact-me-container-2">
                    <h1 >Write article</h1>
                    <form className="contact-form" encType="multipart/htmlForm-data">
                        <label htmlFor="category">Choose article category</label>
                        <select name="category" id="category" onChange={(e) => { setcategory(e.target.value) }}>
                            <option value="religion">Religion</option>
                            <option value="metaphysics">Metaphysics</option>
                            <option value="epistemology">Epistemology</option>
                            <option value="ethics">Ethics</option>
                            <option value="existentialism">Existentialism</option>
                            <option value="consciousness">Consciousness</option>
                        </select>
                        <div className="logo_display"></div>
                        <label htmlFor="heading">Article heading</label>
                        <input name="heading" type="text" className="name input" id="name" placeholder="Article heading" onChange={(e) => { setHeading(e.target.value) }} required />
                        <label htmlFor="description">Article description</label>
                        <input name="description" type="text" className="email input" id="email" placeholder="Article description" onChange={(e) => { setDescription(e.target.value) }}
                            required />
                        <label htmlFor="first_half">First half of article</label>
                        <textarea id="message" name="first_half" className="message input"
                            placeholder="First half of article" onChange={(e) => { setFirstHalf(e.target.value) }}></textarea>
                        <label htmlFor="image">Choose article image</label>
                        <input type="file" accept="image/*" name="image" className="image_upload" onChange={(e) => { setImage(e.target.files[0]) }} />
                        <div className="article_image_preview"></div>
                        <label htmlFor="second_half">Second half of article</label>
                        <textarea id="message2" name="second_half" className="message input"
                            placeholder="Second half of article" onChange={(e) => { setSecondHalf(e.target.value) }}></textarea>
                        <input type="submit" className="submit-button" value="Submit" onClick={(event) => { sendData(event) }} />
                    </form>
                </div>
            ) : (
                <div className="contact-me-container-2">
                    <h1 >Write article</h1>
                    <form className="contact-form" encType="multipart/htmlForm-data">
                        <label htmlFor="category">Choose article category</label>
                        <select name="category" id="category" value={"religion"} onChange={(e) => { setcategory(e.target.value) }}>
                            <option value="religion">Religion</option>
                            <option value="metaphysics">Metaphysics</option>
                            <option value="epistemology">Epistemology</option>
                            <option value="ethics">Ethics</option>
                            <option value="existentialism">Existentialism</option>
                            <option value="consciousness">Consciousness</option>
                        </select>
                        <div className="logo_display"></div>
                        <label htmlFor="heading">Article heading</label>
                        <input name="heading" type="text" className="name input" id="name" placeholder="Article heading" onChange={(e) => { setHeading(e.target.value) }} required />
                        <label htmlFor="description">Article description</label>
                        <input name="description" type="text" className="email input" id="email" placeholder="Article description" onChange={(e) => { setDescription(e.target.value) }}
                            required />
                        <label htmlFor="first_half">First half of article</label>
                        <textarea id="message" name="first_half" className="message input"
                            placeholder="First half of article" onChange={(e) => { setFirstHalf(e.target.value) }}></textarea>
                        <label htmlFor="image">Choose article image</label>
                        <input type="file" accept="image/*" name="image" className="image_upload" onChange={(e) => { setImage(e.target.files[0]) }} />
                        <div className="article_image_preview"></div>
                        <label htmlFor="second_half">Second half of article</label>
                        <textarea id="message2" name="second_half" className="message input"
                            placeholder="Second half of article" onChange={(e) => { setSecondHalf(e.target.value) }}></textarea>
                        <input type="submit" className="submit-button" value="Submit" onClick={(event) => { sendData(event) }} />
                    </form>
                </div>
            )
    )
}
