const Router = require('express')
const router = Router()
const { celebrate } = require('celebrate')
const { validation } = require('../../helper/validation')
const hash = require('../../helper/hashPassword')
const user = require('../../controllers/user/user')
const auth = require('../../controllers/auth/auth')
const apiResponse = require('../../helper/apiResponse')

// Login user
router.post('/login',
    celebrate(validation.login),
    auth.getAuthUser,
    (request, response, next) => {
        if(!request.body.authUser) return apiResponse.notFoundResponse(response, "User not found!")
        return next();
    },
    hash.verifyHashPassword,
    auth.generateAuthToken,
    auth.login
);

// Register user
router.post('/register',
    celebrate(validation.registration),
    auth.getAuthUser,
    (request, response, next) => {
        if (request.body.authUser) return apiResponse.duplicateResponse(response, "User already exists!")
        return next();
    },
    hash.hashPassword,
    auth.register,
    auth.generateAuthToken,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "Registration successful!", request.body.token)
    }
);
// router.post('/refresh-token', refreshToken);

module.exports = router