require("dotenv").config()
require("./config/database").connect()
const express = require("express")
const bcrypt = require("bcryptjs")
const User = require('./models/user')
const app = express()
const jwt = require("jsonwebtoken")
const auth = require("./middlewares/auth")
const cookieParser = require('cookie-parser')
app.use(express.json())
app.use(cookieParser())


app.get("/", (req, res) => {
    res.send("<h1>Welcome to auth system..</h1>")
})

app.post("/register", async (req, res) => {
    console.log(req.body)
    const { firstName, lastName, email, password } = req.body
    try {
        if (firstName && lastName && email && password) {
            let user = await User.findOne({ email })
            if (user) {
                return res.status(406).json({
                    error: "User already exists !!"
                })
            }

            const encPassword = await bcrypt.hash(password, 10)
            user = await User.create({ firstName, lastName, email: email.toLowerCase(), password: encPassword })

            const token = jwt.sign({
                user_id: user._id,
                email: user.email
            }, process.env.SECRET_KEY, {
                expiresIn: "30m"
            })

            return res.status(201).json({
                "message": "User created successfully",
                "user": {
                    id: user._id,
                    email: user.email,
                    token: token
                }
            })

        }

        res.status(422).json({
            error: "All Fields are Mandatory"
        })
    }
    catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!(email && password)) {
            res.status(400).send("Fields is/are missing")
        }
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({
                error: "User not exists !!"
            })
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                user_id: user._id,
                email: user.email
            }, process.env.SECRET_KEY, {
                expiresIn: "30m"
            })


            const options = {
                // 1 day expiration
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie('token', token, options)


            return res.status(200).json({
                "user": {
                    id: user._id,
                    email: user.email,
                    token: token
                }
            })
        }
        console.log("hi");
        console.log(res.statusCode)
        res.status(401).json({
            error: "Email or password is incorrect !!"
        })
    }
    catch (error) {
        console.log(error)
    }
})

app.get('/dashboard', auth, (req, res) => {
    res.status(200).send("Welcome to dashboard")
})

module.exports = app