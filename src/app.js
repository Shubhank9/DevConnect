const express = require("express");
const { userAuth , adminAuth} = require("./middlewares/auth");

const app = express();
const port = 3000;

app.get("/user", userAuth, (req, res) => {
    res.status(200).send("User Authenticated")
})

app.post("/admin", adminAuth, (req, res) => {
    res.status(200).send("Data Successfully saved to db")
})


app.listen(port, () => {
    console.log(`Server is running at port : ${port}`);
})
