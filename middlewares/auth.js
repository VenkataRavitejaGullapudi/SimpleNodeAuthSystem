const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.cookies.token || req.body.token || req.header('Authorization').replace("Bearer ", "") 

    if (!token) {
        return res.status(403).json({
            message: "No token found in request"
        })
    }

    console.log(token)
    try {
        console.log(process.env.SECRET_KEY)
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decode)
        
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            message: "You are unauthorized to perform this action"
        })
    }
    next()
}

module.exports = auth