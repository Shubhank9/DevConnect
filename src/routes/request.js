const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnestionRequest = require("../models/connectionRequest");
const User = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invald status type: " + status
            });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({
                message: "User not found!"
            })
        }

        // if there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnestionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        // also visit to schema pre method.

        if (existingConnectionRequest) { 
            return res.status(400).send({
                message: "Connection Request Already Exists!!"
            });
        }

        const connectionRequest = new ConnestionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save()

        res.status(200).json({
            message: req.user.firstName + " mark " + status + toUser.firstName,
            data
        });
    } catch (err) {
        res.status(400).json(err.message);
    }
});

module.exports = requestRouter; 