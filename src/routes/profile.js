const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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
        res.status(400).send(err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request!")
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        await loggedInUser.save();
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: loggedInUser
        });

    } catch (err) {
        res.status(400).send(err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { password } = req.body;
        const isStrongPassword = validator.isStrongPassword(password);
        if (isStrongPassword) {
            const user = req.user;
            const passwordHash = await bcrypt.hash(password, 10);
            user["password"] = passwordHash;
            await user.save();
            res.status(200).json({
                success: true,
                message: "Password change successfully!!"
            });
        } else {
            throw new Error("Please Enter Strong Password");
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = profileRouter;