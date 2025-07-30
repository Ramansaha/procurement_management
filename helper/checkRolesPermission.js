const apiResponse = require('../helper/apiResponse');
const user = require('../models/user/user')
const { ObjectId } = require('mongodb')

const roleCreationPermissions = {
  admin: ['admin', 'procurement_manager', 'inspection_manager', 'client'],
  procurement_manager: ['inspection_manager', 'client']
};

module.exports = async function checkRolePermissions(request, response, next) {
  try {
    const requester = request.body.auth; 
    const targetRole = request.body.role;

        if (!targetRole) {
      return apiResponse.validationErrorWithData(response, 'Role is required');
    }

    const allowedRoles = roleCreationPermissions[requester.role];
    if (!allowedRoles || !allowedRoles.includes(targetRole)) {
      return apiResponse.unAuthorizedResponse(
        response,
        `You (${requester.role}) cannot create users with role "${targetRole}"`
      );
    }

    // Special handling for inspection managers
    if (targetRole === 'inspection_manager') {
      await validateInspectionManagerCreation(request, response, requester);
      if (response.headersSent) return; // If response was sent, stop further processing
    }
    if (targetRole === 'client') {
      // Could add client-specific validations here if needed
    }

    if (requester.role === 'procurement_manager' && 
        ['admin', 'procurement_manager'].includes(targetRole)) {
      return apiResponse.unAuthorizedResponse(
        response,
        'Procurement managers can only create inspection managers and clients'
      );
    }

    next();
  } catch (error) {
    console.error('Role permission error:', error);
    return apiResponse.errorResponse(response, 'Internal server error');
  }
};

async function validateInspectionManagerCreation(request, resposne, requester) {
  // Check for existing user with same email/mobile
  const existingUser = await user.isUserExists(request.body)

  if (existingUser.status) {
    return apiResponse.validationErrorWithData(
        resposne,
      'User with this email or mobile already exists. Please contact admin.'
    );
  }

  // Auto-assign procurement manager relationship
  if (requester.role === 'procurement_manager') {
    request.body.procurementManager = new ObjectId(requester.userId);
  }

  // Admin can explicitly assign or leave unassigned
  if (requester.role === 'admin') {
    request.body.procurementManager = request.body.procurementManager || null;
  }
}