const express = require("express");

const app = express();
const port = 3000;

// Order of the routes are very important. ***


// this will only handle GET call to /user
app.get("/user",(req , res) =>{
    res.send({ firstName : "Shubhank" , lastName : "Thakur" });
});

// this will only handle POST call to /user
app.post("/user",(req , res) =>{
    // saving data to the database.
    res.send("Data successfully saved to the database!");
});

// this will only handle DELETE call to /user
app.delete("/user",(req , res) =>{
    // deleting data to the database.
    res.send("Data successfully deleted from the database!");
});

// this will match all the HTTP method API calls to /test
app.use("/test",(req , res) =>{
    res.send("Hello from the server! and route is : /test");
});
 
app.use("/" ,(req , res) =>{
    res.send("Hello from the server! and route is : / ");
})

app.listen(port, ()=>{
    console.log(`Server is running at port : ${port}`);
})