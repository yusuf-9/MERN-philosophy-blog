const express = require("express")
const app = express()
const env = require("dotenv")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const nodeMailer = require("nodemailer")
const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
const Article = require("./articleSchema")
const User = require("./userSchema")
app.use(cors())

// Initializing env
env.config()

// PORT
const PORT = process.env.PORT || 5000;

// Connecting to mongoose
mongoose.connect(process.env.MONGO_ID, () => {
    console.log("Database connnected")
})

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

// Setting up nodemailer
const transporter = nodeMailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})
transporter.verify((error, success) => {
    if (error) { console.log(error) }
    else {
        console.log("mailer is working")
    }
})

// Custom middleware
function addingUserCredsToReq(req, res, next) {
    const { token } = req.cookies
    if (token) {
        const verified = jwt.verify(token, "secret", (err, data) => {
            if (err) {
                return next()
            }
            else {
                req.user = data
                return next()
            }
        })
    }
    else {
        next()
    }
}
function adminOnlyPages(req, res, next) {
    let variable = 0
    const { token } = req.cookies
    const verified = jwt.verify(token, "secret", (err, data) => {
        if (err) {

        }
        else {
            if (data.role == "user") {
            }
            else {
                variable++
                req.user = data;
            }
        }
    })
    if (variable > 0) {
        return next()
    }
    else {
        return res.json({ status: "failed. User does not have permissions to make request" })
    }
}
function loggedOutOnly(req, res, next) {
    let variable = 0
    const { token } = req.cookies
    const verified = jwt.verify(token, "secret", (err, data) => {
        if (err) {
        }
        else {
            variable++
        }
    })
    if (variable === 0) {
        return next()
    }
    else {
        return res.json({ status: "failed. User does not have permissions to make request" })
    }
}

// Routes
app.get("/home", async (req, res) => {
    try {
        var articles = await Article.find({}, { heading: 1, description: 1, category: 1, image: 1, timeToRead: 1, date_created: 1 }).sort({ views: -1 })
        var Toparticles = articles.slice(0, 6)
        var random = Math.floor(Math.random() * (articles.length - 3))
        res.json({ status: "success", data: Toparticles, x: articles.slice(random, random + 3) })
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }
})

app.get("/user", (req, res) => {
    let variable = 0;
    const { token } = req.cookies
    if (token) {
        const verified = jwt.verify(token, "secret", (err, data) => {
            if (err) {
            }
            else {
                variable++;
                req.user = data.role
            }
        })
    }
    if (variable == 0) {
        return res.json({ status: "no user" })
    }
    else {
        return res.json({ status: "user", user: req.user })
    }
})

app.get("/fetcharticles/?", async (req, res) => {
    var { page, filter } = req.query
    try {
        if (page && filter) {
            const articles = await Article.find({ category: { $in: filter } }, { heading: 1, image: 1, category: 1, timeToRead: 1, date_created: 1 }).sort({ last_updated: -1 }).skip(page * 9).limit(9)
            var nextPage = Number(page) + 1;
            var prevPage = Number(page) - 1;
            if (typeof (filter) == "string") {
                var categoryquery = `filter=${filter}&`
            }
            else {
                var categoryquery = filter.map((x) => { return `filter=${x}&` });
                categoryquery = categoryquery.join("")
            }
            if (articles.length < 9) {
                return res.json({ status: "success", data: articles, category: categoryquery, page: { prevPage: prevPage } })
            }
            else {
                res.json({ status: "success", data: articles, category: categoryquery, page: { nextPage: nextPage, prevPage: prevPage } })
            }

        }
        else if (page) {
            const articles = await Article.find().sort({ last_updated: -1 }).skip(page * 9).limit(9)
            var nextPage = Number(page) + 1;
            var prevPage = Number(page) - 1;
            if (articles.length < 9) {
                res.json({ status: "success", data: articles, page: { prevPage: prevPage } })
            }
            else {
                res.json({ status: "success", data: articles, page: { nextPage: nextPage, prevPage: prevPage } })
            }
        }
        else {
            const articles = await Article.find().sort({ last_updated: -1 }).limit(9)
            res.json({ status: "success", data: articles, page: { nextPage: 1 } })
        }
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }

})

app.get("/readarticle/:articleName", addingUserCredsToReq, async (req, res) => {
    let { articleName } = req.params;
    try {
        const main = await Article.findOne({ heading: articleName.split("_").join(" ") })
        const currentViews = main.views;
        main.views = currentViews + 1
        await main.save()
        const articleCount = await Article.find({ heading: { $ne: articleName.split("_").join(" ") } }).count()
        var random = Math.floor(Math.random() * (articleCount.length - 3))
        const moreArticles = await Article.find({ heading: { $ne: articleName.split("_").join(" ") } }, { heading: 1, image: 1, date_created: 1, timeToRead: 1, category: 1 }).skip(random).limit(3)
        var liked;
        if (req.user) {
            main.likes.forEach((x) => { if (x.email == req.user.email) { liked = "active" } })
            res.json({ status: "success", data: main, moreArticles: moreArticles, liked: liked, user: req.user })
        }
        else {
            res.json({ status: "success", data: main, moreArticles: moreArticles, })
        }
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }


})

app.get("/loginControl", loggedOutOnly, async (req, res) => {
    res.json({ status: "success" })
})

app.get("/logout", (req, res) => {
    let variable = 0;
    const { token } = req.cookies
    if (!token) {
        return res.json({ status: "success" })
    }
    const verified = jwt.verify(token, "secret", (err, data) => {
        if (err) {
        }
        else {
            res.clearCookie("token")
            variable++
        }
    })
    if (variable > 0) {
        return res.json({ status: "success" })
    }
})

app.get("/verifyAPI/:id", async (req, res) => {
    let { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });
        if (user.verified === true) {
            res.json({ status: "failed", data: "Your email has already been verified" })
        }
        else {
            user.verified = true;
            await user.save()
                const token = jwt.sign({ name: user.name.split(" ")[0] + " " + user.name.split(" ")[1], role: user.role, email: user.email }, "secret")
                res.cookie("token", token, { httpOnly: true });
                res.json({ status: "success" })      
        }
    } catch (err) {
        if (err) {
            res.json({ status: "error", data: err })
        }
    }

})

app.get("/register/:email", async (req, res) => {
    let { email } = req.params;
    try {
        const user = await User.findOne({ email: email })
        transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Email verification",
            html: `<p>Click the following link to verify your account</p>
                <p><a href="https://theskeptichawk.cyclic.app/verify/${user._id}">Verify email</a></p>`
        }).then((x) => {
            return res.json({ status: "success" })
        })
    } catch (err) {
        if (err) {
            res.json({ status: "failed" })
        }
    }

})

app.get("/edit/:articleName", adminOnlyPages, async (req, res) => {
    let { articleName } = req.params;
    try {
        const article = await Article.find({ heading: articleName.split("_").join(" ") })
        res.json({ data: article[0], status: "success" })
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }

})

app.post("/register", async (req, res) => {
    var { name, email, password } = req.body
    name = name.trim().split(" ").map((x) => {
        return x.replace(x[0], x[0].toUpperCase())
    }).join(" ")
    email = email.trim().toLowerCase()
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const alreadyExists = await User.findOne({ email: email })
        if (alreadyExists) {
            return res.json({ status: "failed", data: "Email already exists" })
        }
        if (email == "yusufahmed195@gmail.com") {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                role: "admin"
            })
            await user.save()
        }
        else {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
            })
            await user.save()
        }
        const user = await User.findOne({ email: email })
        return res.json({ status: "success", id: user._id })
    } catch (err) {
        if (err) {
            res.json({ status: "error", data: err })
        }
    }

})

app.post("/login", async (req, response) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (user) {
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) {
                    return response.json({ status: "error", data: err })
                }
                else if (res) {
                    if (user.verified === true) {
                        const token = jwt.sign({ name: user.name.split(" ")[0] + " " + user.name.split(" ")[1], role: user.role, email: user.email }, "secret")
                        response.cookie("token", token, { httpOnly: true });
                        response.json({ status: "login success" })
                    }
                    else {
                        return response.json({ status: "verification pending" })
                    }
                }
                else {
                    return response.json({ status: "failed", data: "Invalid password" })
                }
            })

        }
        else {
            response.json({ status: "failed", data: "Email not registered" })
        }
    } catch (err) {
        if (err) {
            response.json({ status: "error", data: err })
        }
    }

})

app.post("/writeArticle", adminOnlyPages, async (req, res) => {
    const x = JSON.parse(JSON.stringify(req.body))
    let { heading, description, first_half, second_half, category, image } = x;
    try {
        let newArticle = new Article({
            heading: heading,
            description: description,
            image: image,
            first_half: first_half,
            second_half: second_half,
            category: category,
            last_updated: Date.now(),
            timeToRead: Math.ceil((first_half.concat(second_half).split(" ").length / 4) / 60)
        })
        await newArticle.save()
        res.json({ status: "success" })
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
            console.log(err)
        }
    }
})

app.post("/contact", (req, res) => {
    var { name, email, message } = req.body
    name = name.trim()
    email = email.toLowerCase().trim()
    try {
        transporter.sendMail({
            from: process.env.EMAIL,
            to: "yusufahmed195@gmail.com",
            subject: "Contact message",
            html: `<p>Email sent by - ${name}</p><p>Their email is - ${email}</p><p>Message - ${message}</p>`
        }).then((x) => {
            return res.json({ status: "success" })
        })
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }
})

app.delete("/:articleName", adminOnlyPages, async (req, res) => {
    let { articleName } = req.params;
    try {
        await Article.deleteOne({ heading: articleName.split("_").join(" ") })
        res.json({ status: "success" })
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }

})

app.post("/edit/:articleName", adminOnlyPages, async (req, res) => {
    let { articleName } = req.params;
    const x = JSON.parse(JSON.stringify(req.body))
    let { heading, description, first_half, second_half, category, image } = x;
    try {
        let newArticle = {
            heading: heading,
            description: description,
            image: image,
            first_half: first_half,
            second_half: second_half,
            category: category,
            last_updated: Date.now(),
            date_created: `${Date().split(" ")[2]}th ${Date().split(" ")[1]}, ${Date().split(" ")[3]}`,
            timeToRead: Math.ceil((first_half.concat(second_half).split(" ").length / 4) / 60)
        }

        await Article.updateOne({ heading: articleName.split("_").join(" ") }, newArticle)
        res.json({ status: "success" })
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }


})

app.post("/like/:articleName", addingUserCredsToReq, async (req, res) => {
    const { articleName } = req.params;
    const { action } = req.body;
    try {
        if (action == "like" && req.user) {
            const like = {
                email: req.user.email,
                name: req.user.name,
                time: Date.now()
            }
            var article = await Article.find({ heading: articleName.split("_").join(" ") })
            article[0].likes.push(like)
            await article[0].save()
            return res.json({ status: "success" })
        }
        else if (action == "unlike" && req.user) {
            var article = await Article.find({ heading: articleName.split("_").join(" ") })
            article[0].likes = article[0].likes.filter((x) => { return x.email != req.user.email })
            await article[0].save()
            return res.json({ status: "success" })
        }
        res.json({ status: "failed" })

    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }

    res.json({ status: "failed" })
})

app.post("/comment/:articleName", addingUserCredsToReq, async (req, res) => {
    const { articleName } = req.params;
    const { comment, action } = req.body;
    try {
        if (action == "post" && req.user) {
            const newComment = {
                email: req.user.email,
                name: req.user.name,
                comment: comment
            }
            var article = await Article.find({ heading: articleName.split("_").join(" ") })
            article[0].comments.push(newComment)
            await article[0].save()
            return res.json({ status: "success", data: newComment })
        }
        else if (action == "delete" && req.user) {
            var article = await Article.find({ heading: articleName.split("_").join(" ") })
            article[0].comments = article[0].comments.filter((x) => {
                return x.comment != comment
            })
            await article[0].save()
            return res.json({ status: "success" })
        }
    } catch (err) {
        if (err) {
            res.json({ status: "failed", data: err })
        }
    }

})


// HOSTING
app.use(express.static(path.join(__dirname, "./frontend/build")))
app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});


// Making the server go live
app.listen(PORT, () => {
    console.log("The server is listening on http://localhost:5000/")
})
