const userAuth = (req, res, next) => {
    const token = req.query?.token;
    const isAuthenticated = token === "abcd";
    if (!isAuthenticated) {
        res.status(401).send("User not Authenticated");
    } else {
        next();
    }
}

const adminAuth = (req, res, next) => {
    const token = "abc";
    const isAuthenticated = token === "abc";
    if (!isAuthenticated) {
        res.status(402).send("User not Authenticated")
    } else {
        next();
    }
}

module.exports = {
    userAuth,
    adminAuth,
}