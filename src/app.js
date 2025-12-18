const express = require("express");

const app = express();
const port = 3000;

app.use("/user", (req, res , next) => {
    console.log("Inside route handler 1")
    // res.send("Response 1");
    next();
},
    (req, res , next) => {
        console.log("Inside route handler 2")
        // res.send("Response 2");
        next();
    },
    (req, res , next) => {
        console.log("Inside route handler 3")
        res.send("Response 3");
        // if no response then it will go to an infinite loop
    });

app.listen(port, () => {
    console.log(`Server is running at port : ${port}`);
})
