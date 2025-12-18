const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 7777; 

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

     
