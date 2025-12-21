const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 7777;
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());   // this is a middleware provide by express to convert json data into js object.
app.use(cookieParser());   // this is a middleware provided by cookie-parser (developed by express team) to read a cookie.

// /user : updated user data
app.patch("/user", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "userId",
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be mode than 10");
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true
        });
        console.log(user);
        res.status(200).send("User Updated Successfully");
    } catch (err) {
        console.log("Unable to Delete the User error is : " + err.message);
    }
})

// /user : delete user by _id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).send("User deleted successfully");
    } catch (err) {
        console.log("Unable to fetch the User error is : " + err.message);
    }
})


// /user : to search a user by an emailId.
app.get("/user", async (req, res) => {

    const email = req.body;

    try {
        const user = await User.findOne(email);
        res.status(200).send(user);
    } catch (err) {
        console.log("Unable to fetch the User error is : " + err.message);
    }
})


// /feed : to fetch all the documents form the database.
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        console.log("Unable to fetch the feed error is : " + err.message);
    }
});


app.get("/profile", userAuth, async (req, res) => {
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

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user?.password);

        if (isPasswordValid) { 
            // Create a JWT Token.
            const token = await jwt.sign({ _id: user?._id }, "Dev@Connect$0905", {
                expiresIn: "1d",
            });

            // Add the token to cookie ans send the response back to the user.
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


app.post("/signup", async (req, res) => {

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

connectDB()
    .then(() => {
        console.log("Database connection estiblished...")
        app.listen(port, () => {
            console.log(`Server is running at port : ${port}`);
        })
    })
    .catch(() => {
        console.error("Database cannot br connected!!...")
    });


