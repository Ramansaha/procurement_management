const { generateToken, verifyToken } = require('./jwt')
const moment = require('moment')
const dotenv = require('dotenv')
const userModel = require('../../models/user/user')
const apiResponse = require('../../helper/apiResponse')
dotenv.config()

// Authenticate valid user from token 
module.exports.isAuth = (request, response, next) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return response.status(404).json({ message: "Unauthorized" })
    // request.body.token = token
    verifyToken(token, process.env.AUTHTOKEN_SECRETKEY).then(res => {
        if (!res.exp) throw {}
        if (request.method === 'GET') {
            request.token = token;
            request.auth = res;
        } else {
            request.body = request.body || {};
            request.body.token = token;
            request.body.auth = res;
        }
        return next()
    }).catch(err => {
        return response.status(401).json({ message: "Unauthorized" })
    })
}

// Generate auth token
module.exports.generateAuthToken = async (request, response, next) => {
    try {
        const minutes = 100000
        const expirationTime = Math.floor(Date.now() / 1000) + minutes * 60
        const payload = { userId: request.body.authUser._id, role : request.body.authUser.role }
        const token = generateToken(payload, process.env.AUTHTOKEN_SECRETKEY, expirationTime)

        request.body.token = token
        return next()
    } catch (error) {
        return response.status().json({ message: error.message })
    }
}

// Login users
module.exports.login = async (request, response) => {
    try {
        const { authUser, email, mobile, token } = request.body;
        const { role } = authUser || {};

        if (role === 'inspection_manager' && email) {
            return apiResponse.unAuthorizedResponse(response,
                "Inspection manager can only login with mobile number");
        }

        if ((role === 'admin' || role === 'procurement_manager' || role === 'client') && mobile) {
            return apiResponse.unAuthorizedResponse(response,
                'User can only login with email!');
        }
        if (!token) {
            return apiResponse.unAuthorizedResponse(response,
                'Authentication token required');
        }
        return apiResponse.successResponseWithData(response, "Login Successful!", token);

    } catch (err) {
        console.error('Login Error:', err);
        return apiResponse.errorResponse(response,
            'Internal server error');
    }
}

// Register user(admin)
module.exports.register = async (request, response, next) => {
    try {
        const res = await userModel.register(request.body);

        if (!res.status) {
            return apiResponse.notFoundResponse(response, "Unable to register user");
        }

        let authUser = {
            _id : res.data.insertedId,
            role : 'admin'
         }
        request.body.authUser = authUser
        return next();
    } catch (err) {
        console.error("Registration Error:", err);
        return apiResponse.errorResponse(response, "An error occurred while registering user.");
    }
}

// Check if users exists
module.exports.getAuthUser = async (request, response, next) => {
    try {
        let body = request.body
        // if(!body?.email || !body?.mobile) return apiResponse.notFoundResponse(response, "PLease provide either an email or a mobile number")
        const authUser = await userModel.getAuthUser(body)
        if (!authUser.status) return next()
        request.body.authUser = authUser.data
        return next();
    } catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}