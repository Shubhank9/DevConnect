const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");


const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req?.user;
        res.status(200).send({
            "success": true,
            "message": "Profile fetched successfully",
            "data": {
                "user": user,
            }
        });
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = profileRouter;