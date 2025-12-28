const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]

// Get all the pending connection requests.
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "intrested",
        }).populate("fromUserId", USER_SAFE_DATA);
        //     }).populate("fromUserId", "firstName lastName");

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest
        });
    } catch (err) {
        res.status(400).json({
            message: "Error" + err.message
        });
    }
});


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        }); f
        res.json({
            message: "Data fetched successfully",
            data: data
        });
    } catch (err) {
        res.status(400).json({
            message: "Error" + err.message
        });
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = limit * (page - 1);

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status.json({ message: "User fetch successfully!", data: users })

    } catch (err) {
        res.status(400).json({
            message: "Error" + err.message
        });
    }
})

module.exports = userRouter;