const express = require("express");
const { userAuth, adminAuth } = require("./middlewares/auth");

const app = express();
const port = 3000;


app.get("/user", userAuth, (req, res) => {
    try {
        res.status(200).send("User Authenticated")
    } catch (err) {
        res.status(500).send("Something not good : error")
    }
})

app.post("/admin", adminAuth, (req, res) => {
    res.status(200).send("Data Successfully saved to db")
})

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong");
    }
});

app.listen(port, () => {
    console.log(`Server is running at port : ${port}`);
})
