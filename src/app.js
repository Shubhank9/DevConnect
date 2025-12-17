const express = require("express");

const app = express();
const port = 3000;

app.get("/user/:userID/:name", (req, res) => {
    console.log(req.params);  // this is how get query params
    res.send({ firstName: "Shubhank", lastName: "Thakur" });
});

app.listen(port, () => {
    console.log(`Server is running at port : ${port}`);
})


// route can be 
// /ab?c  means ac or abc both works
// /ab+c  means abbbc or abc both
// Many more but not uses in real world projects.