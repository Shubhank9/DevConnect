const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName) {
        throw new Error("Name is not valid!");
    }
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("Firstname should be 5-50 char.");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please Enter a strong Password.");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email Id.");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "profileUrl", "gender", "age", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {
    validateSignUpData , validateEditProfileData
}