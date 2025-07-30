const express = require('express');
const router = express.Router()
const auth = require('../../controllers/auth/auth')
const user = require('../../controllers/user/user')
const { validation } = require('../../helper/validation')
const { celebrate } = require('celebrate')
// const roles = require('../../helper/checkRolesPermission')
const hash = require('../../helper/hashPassword');
const apiResponse = require('../../helper/apiResponse') 
const filterUserListByRole = require('../../helper/filterUserListByRole')
const checkRolePermissions = require('../../helper/checkRolesPermission');

// Route to get user details based on different filters
router.post(
  '/get',
  celebrate(validation.getUser),
  auth.isAuth,
  user.getUser,
  filterUserListByRole,
  (request, response) => {
    return response.status(200).json({
      message: 'User details fetched successfully!',
      data: request.body.userData,
    });
  }
)

// Route to add user details
router.post('/add',
  celebrate(validation.addUser),
  auth.isAuth,
  user.isUserExists,
  (request, response, next) => {
    if (request.body.authUser) return apiResponse.duplicateResponse(response, "User already exists!")
    return next()
  },
  checkRolePermissions,
  hash.hashPassword,
  user.addUser
)

// Update user details
router.post('/update',
  celebrate(validation.updateUser),
  auth.isAuth,
  user.isUserExists,
  user.updateUser,
  (request, response) => {
    apiResponse.successResponse(response, "User updated successfully!")
  }
)


module.exports = router