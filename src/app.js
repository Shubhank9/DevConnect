const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();
const port = 7777;

app.use(express.json());   // this is a middleware provide by express to convert json data into js object.
app.use(cookieParser());   // this is a middleware provided by cookie-parser (developed by express team) to read a cookie.

app.use("/", authRouter, profileRouter, requestRouter);

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


