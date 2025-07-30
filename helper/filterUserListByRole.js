module.exports = function filterUserListByRole(request, response, next) {
    const requester = request.body.auth;
    const users = request.body.userData;
  
    if (!Array.isArray(users)) {
      return response.status(500).json({ status: false, message: 'Invalid user data format' });
    }
  
    let filteredUsers = [];
  
    switch (requester.role) {
      case 'admin':
        // Admin can view all users
        filteredUsers = users;
        break;
  
      case 'procurement_manager':
        // Procurement Manager can view Inspection Managers and Clients assigned to them
        filteredUsers = users.filter(user => {
          if (user.role === 'inspection_manager' || user.role === 'client') {
            return user.procurementManager?.toString() === requester.userId.toString();
          }
          return false;
        });
        break;
  
      case 'inspection_manager':
      case 'client':
        // Inspection Manager and Client can view only their own profile
        filteredUsers = users.filter(user => user._id.toString() === requester.userId.toString());
        break;
  
      default:
        return response.status(403).json({ status: false, message: 'Unauthorized role' });
    }
  
    request.body.userData = filteredUsers;
    return next();
  };
  