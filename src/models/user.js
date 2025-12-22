const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50
        },
        lastName: {
            type: String
        },
        emailId: {
            type: String,
            lowercase: true,
            required: true,
            unique: true,
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address: " + value);
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Please Enter Strong Password");
                }
            }
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "others"],
                message: `{VALUE} is not a valid gender type.`
            }
            // validate(value) {
            //     if (!["male", "female", "others"].includes(value)) {
            //         throw new Error("Gender data is not valid");
            //     }
            // }
        },
        photoUrl: {
            type: String,
            default: "https://media.istockphoto.com/id/1726213993/vector/default-avatar-profile-placeholder-abstract-vector-silhouette-element.jpg?s=612x612&w=0&k=20&c=nYlk0j076CBZ5xGCCaVXtISYGK2SzXRwuQBXPkfmMX4=",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid Photo URL: " + value);
                }
            }
        },
        about: {
            type: String,
            default: "This is a default about of the user!",
        },
        skills: {
            type: [String]
        }
    }, {
    timestamps: true
},);

userSchema.index({ firstName: 1, lastName: 1 }); // for speeding up the query needed if millions of user present in db.

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user?._id }, "Dev@Connect$0905", {
        expiresIn: "1d",
    });

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;

    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    )
    return isPasswordValid;
}


const User = mongoose.model("User", userSchema);

module.exports = User;