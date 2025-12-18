const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://shubhank:lPmbj8hqvxmVQF3H@shubhanknode.wxouxgh.mongodb.net/devConnect"
    );
};

module.exports = connectDB;

