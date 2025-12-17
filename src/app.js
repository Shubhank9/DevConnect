const express = require("express");

const app = express();
const port = 3000;

app.use((req , res) =>{
    res.send("Hello from the server! and route is : / ");
})

app.use("/test-one",(req , res) =>{
    res.send("Hello from the server! and route is : /test-one");
})

app.use("/test-two",(req , res) =>{
    res.send("Hello from the server! and route is : /test-two");
})

app.listen(port, ()=>{
    console.log(`Server is running at port : ${port}`);
})