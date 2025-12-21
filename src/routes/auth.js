const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// authRouter.use(); is same as : app.use(); no diff.

authRouter.post("/signup", async (req, res) => {

    const { firstName, lastName, emailId, password } = req.body;

    try {
        //Validate data.
        validateSignUpData(req);

        // Encrypt the password.
        const passwordHash = await bcrypt.hash(password, 10);

        // Saving user in db.
        const user = new User({
            firstName, lastName, password: passwordHash, emailId
        });
        await user.save();

        res.status(200).send("User added successully!!");
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        console.log(user.validatePassword);
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            // Create a JWT Token.
            const token = await user.getJWT();

            // Add the token to cookie and send the response back to the user.
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.status(200).send("Login Successfully!!");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
    res.send({
        success: true,
        message: "Logout successfull!!"
    });
});

module.exports = authRouter;