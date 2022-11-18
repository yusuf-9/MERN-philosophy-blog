import React, { useState, useEffect } from 'react'
import "./Edit.css"
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


export default function Edit() {

    // Defining states
    const navigate = useNavigate()
    const { article_name } = useParams()
    const [category, setcategory] = useState(null);
    const [heading, setHeading] = useState(null);
    const [description, setDescription] = useState(null)
    const [firstHalf, setFirstHalf] = useState(null)
    const [secondHalf, setSecondHalf] = useState(null)
    const [image, setImage] = useState(null)
    const [articleToBeEdited, setarticleToBeEdited] = useState()
    const [divImage, setDivImage] = useState(null)
    const [logoImage, setLogoImage] = useState(null)

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
        axios.post(`/edit/${article_name}`, formData, {withCredentials:true}).then((x) => {
            if (x.data.status == "success") {
                navigate("/articles")
            }
            else {
                console.log(x.data)
                navigate(`/article/${article_name}`)
            }
        })
    }

    useEffect(() => {
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
        const categoryLogo = document.querySelector(".logo_display")
        categoryInput.addEventListener("change", (e) => {
            let category = e.target.value;
            console.log(category)
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

        // Checking for params and fetching article to populate input feilds
        if (article_name) {
            axios.get(`/edit/${article_name}`, {withCredentials:true}).then((x) => {
                if(x.data.status == "success"){
                    setarticleToBeEdited(x.data.data);
                    setDivImage(x.data.data.image);
                    setLogoImage(x.data.data.category);
                    setcategory(x.data.data.category)
                    setHeading(x.data.data.heading)
                    setDescription(x.data.data.description)
                    setFirstHalf(x.data.data.first_half)
                    setSecondHalf(x.data.data.second_half)
                }
                else{
                    navigate(`/article/${article_name}`)
                }
            })
        }

    }, [])


    return (
        articleToBeEdited ? (
            <div className="contact-me-container-2" >
                <h1 >Write article</h1>
                <form className="contact-form" encType="multipart/htmlForm-data">
                    <label htmlFor="category">Choose article category</label>
                    <select name="category" value={articleToBeEdited.category} id="category" onChange={(e) => { setcategory(e.target.value); setarticleToBeEdited({category: e.target.value})}}>
                        <option value="religion">Religion</option>
                        <option value="metaphysics">Metaphysics</option>
                        <option value="epistemology">Epistemology</option>
                        <option value="ethics">Ethics</option>
                        <option value="existentialism">Existentialism</option>
                        <option value="consciousness">Consciousness</option>
                    </select>
                    <div className="logo_display" style={{backgroundImage: `url(/Logos/${logoImage}.jpg)`}}></div>
                    <label htmlFor="heading" >Article heading</label>
                    <input name="heading" value={articleToBeEdited.heading} type="text" className="name input" id="name" placeholder="Article heading" onChange={(e) => { setHeading(e.target.value); setarticleToBeEdited({heading: e.target.value}) }} required />
                    <label htmlFor="description">Article description</label>
                    <input name="description" value={articleToBeEdited.description} type="text" className="email input" id="email" placeholder="Article description" onChange={(e) => { setDescription(e.target.value); setarticleToBeEdited({description:e.target.value}) }}
                        required />
                    <label htmlFor="first_half">First half of article</label>
                    <textarea id="message" name="first_half" className="message input" value={articleToBeEdited.first_half}
                        placeholder="First half of article" onChange={(e) => { setFirstHalf(e.target.value); setarticleToBeEdited({first_half: e.target.value}) }}></textarea>
                    <label htmlFor="image">Choose article image</label>
                    <input type="file" accept="image/*" name="image" className="image_upload" onChange={(e) => { setImage(e.target.files[0]) }} />
                    <div className="article_image_preview" style={{backgroundImage: `url(/ArticleImages/${divImage})`}}></div>
                    <label htmlFor="second_half">Second half of article</label>
                    <textarea id="message2"  name="second_half" className="message input" value={articleToBeEdited.second_half}
                        placeholder="Second half of article" onChange={(e) => { setSecondHalf(e.target.value); setarticleToBeEdited({second_half: e.target.value}) }}></textarea>
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
                <input type="submit" className="submit-button" value="Submit"/>
            </form>
            </div>
        )
    )
}
