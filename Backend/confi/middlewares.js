const jwt = require('jsonwebtoken')

const cartmiddleware = async (req, res, next) => {
    const authToken = req.headers.authorization
    const jwtSecretKey="plmn123"

    console.log(authToken)
    if (!authToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(authToken, jwtSecretKey)
        req.user = decoded.user
        next()
    } catch (error) {
        console.log("error occured", error)
    }
}

const usermiddleware = async (req, res, next) => {
    const authToken = req.headers.authorization
    const jwtSecretKey = "plmn123"

    console.log(authToken)
    if (!authToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(authToken, jwtSecretKey)
        req.user = decoded.user
        next()
    } catch (error) {
        console.log("error occured", error)
    }
}


const likemiddleware = async (req, res, next) => {
    const authToken = req.headers.authorization
    const jwtSecretKey = "plmn123"

    console.log(authToken)
    if (!authToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }
    try {
        const decoded = jwt.verify(authToken, jwtSecretKey)
        req.user = decoded.user
        next()
    } catch (error) {
        console.log("error occured", error)
    }
}

module.exports = { cartmiddleware, usermiddleware,likemiddleware }
