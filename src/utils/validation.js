const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    }
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("FirstNAme should be 5-50 char.");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please Enter a strong Password");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email Id;");
    }
}

module.exports = {
    validateSignUpData
}