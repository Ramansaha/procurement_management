const bcrypt = require('bcrypt');

module.exports.hashPassword = async (request, response, next) => {
    let body = request.body
    if (!body.password) {
        return { status: false, message: "Password not provided!" };
    }
    try {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        request.body.hashPassword = hashedPassword
        return next()
    } catch (err) {
        return { status: false, message: "Error hashing password", error: err.message };
    }
};

module.exports.verifyHashPassword = async (request, resposne, next) => {
    let body = request.body
    if (!body.password || !body.authUser.password) {
        return { status: false, message: "Password or hashedPassword not provided!" };
    }

    try {
        const isMatch = await bcrypt.compare(body.password, body.authUser.password);
        // return isMatch
        //     ? { status: true, message: "Password matched" }
        //     : { status: false, message: "Invalid password!" };
        if (!isMatch) return resposne.status(404).json({ message: "Invalid password!" })
        return next()
    } catch (err) {
        return { status: false, message: "Error verifying password", error: err.message };
    }
};