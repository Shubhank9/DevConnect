const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Invalid Token");
        }
        // Validate my token
        const decodedMessage = await jwt.verify(token, "Dev@Connect$0905");
        const { _id } = decodedMessage;

        // Fetching user details
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
}

module.exports = {
    userAuth,
}