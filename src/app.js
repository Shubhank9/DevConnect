const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 7777;
const User = require("./models/user");

app.use(express.json());   // this is a middleware provide by express to convert json data into js object.


// /user : updated user data
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after"
        });
        console.log(user);
        res.status(200).send("User Updated Successfully");
    } catch (err) {
        console.log("Unable to Delete the User error is : ", err.message);
    }
})
// $set, $push, $elemMatch, arrayFilter, $pull 


// /user : delete user by _id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).send("User deleted successfully");
    } catch (err) {
        console.log("Unable to fetch the User error is : ", err.message);
    }
})


// /user : to search a user by an emailId.
app.get("/user", async (req, res) => {

    const email = req.body;

    try {
        const user = await User.findOne(email);
        res.status(200).send(user);
    } catch (err) {
        console.log("Unable to fetch the User error is : ", err.message);
    }
})


// /feed : to fetch all the documents form the database.
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        console.log("Unable to fetch the feed error is : ", err.message);
    }
})


app.post("/signup", async (req, res) => {

    // creating a new instance of User model
    // const user = new User(req.body);

    try {
        await user.save();
        res.status(200).send("User added successully");
    } catch (err) {
        res.status(400).send("Error saving user : ", err.message);
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


