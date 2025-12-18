const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 7777;
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    // creating a new instance of User model
    const user = new User({
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "viratkohli18@gmail.com",
        password: "virat@123"
    });

    try {
        await user.save();
        res.status(200).send("User added successully")
    } catch (err) {
        res.status(400).send("Error saving user : ", err.message);
    }
})

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


