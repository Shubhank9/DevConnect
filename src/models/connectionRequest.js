const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignore", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type.`
            },
        },
    },
    {
        timestamps: true,
    }
);

// connectionRequest.find({fromUserId: 18934758238957 , toUserId : 18972389r79889273r}); these request will be very fast by providing the index. 
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
})



const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;