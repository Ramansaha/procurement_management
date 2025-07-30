const { response } = require('express')
const userModel = require('../../models/user/user')
const apiResponse = require('../../helper/apiResponse')

// Checks if user exists
module.exports.isUserExists = async (request, response, next) => {
    try {
        const user = await userModel.isUserExists(request.body)
        if (user.status) {
            request.body.authUser = user.data
        }
        return next();
    } catch (error) {
        console.log('error while checking userData in userController', error);
        return apiResponse.errorResponse(response, "Unable to get user")
    }
}

// add user (admin or PM can add user)
module.exports.addUser = async (request, response, next) => {
    try {
        const user = await userModel.addUser(request.body);

        if (!user.status) {
            return apiResponse.notFoundResponse(response, "Unable to add user")
        }

        return apiResponse.successResponse(response, "User added successfully!")
    } catch (error) {
        console.log('Error while adding user in userController:', error);
        return apiResponse.errorResponse(response, "Unable to add user");
    }
};

// get users details
module.exports.getUser = async (request, response, next) => {
    try {
        const user = await userModel.getUser(request.body)
        if (!user.status) return { status: false, message: "Unable to get user details" }
        request.body.userData = user.data;
        return next();
        // return response.json({status : true, message : "User details fetched successfuly!", data : user.data})
    } catch (error) {
        console.log('error while getting data in userController', error);
        return apiResponse.errorResponse(response, "Unable to get user");
    }
}

// update user details(admin can update PM of IM)
module.exports.updateUser = async (request, response, next) => {
    try {
        if(request.body.auth.role !== 'admin') return apiResponse.unAuthorizedResponse(response, "You don't have have access to update user deatils!")
        if(request.body.authUser.role !== 'inspection_manager') return apiResponse.unAuthorizedResponse(response, "You can only update user details for inspection_manager role!")
        const user = await userModel.updateUser(request.body)
        if (!user.status) return { status: false, message: "Unable to update user details" }
        request.body.userData = user.data;
        return next();
    } catch (error) {
        console.log('error while updating data in userController', error);
        return apiResponse.errorResponse(response, "Unable to update user");
    }
}