const jsonwebtoken = require('jsonwebtoken')

// Generate a new JWT token
exports.generateToken = function(payload, secretKey, expiresIn) {
    return jsonwebtoken.sign(payload, secretKey, { expiresIn });
};

// Verify and decode JWT token
exports.verifyToken = async function(token, secretKey) {
    try {
        return jsonwebtoken.verify(token, secretKey);
    } catch (error) {
        return error;
    }
};
