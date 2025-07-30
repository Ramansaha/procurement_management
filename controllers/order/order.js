const orderModel = require('../../models/order/order');
const apiResponse = require('../../helper/apiResponse');

// Check user role
module.exports.checkRole = (roles = []) => (request, response, next) => {
    if (!roles.includes(request.body.auth.role)) {
        return apiResponse.unAuthorizedResponse(response, 'You do not have permission to perform this action.');
    }
    next();
};

// create order
module.exports.createOrder = async (request, response) => {
    try {
        const result = await orderModel.createOrder(request.body, request.body.auth);
        if (!result.status) return apiResponse.errorResponse(response, result.message);
        return apiResponse.successResponseWithData(response, "Order created successfully!", result.data);
    } catch (err) {
        return apiResponse.errorResponse(response, "Failed to create order.");
    }
};

// Get order details
module.exports.getOrders = async (request, response) => {
    try {
        const result = await orderModel.getOrders(request.body);
        return apiResponse.successResponseWithData(response, "Orders fetched successfully!", result.data);
    } catch (err) {
        return apiResponse.errorResponse(response, "Unable to fetch orders.");
    }
};

// Update order status
module.exports.updateOrderStatus = async (request, response) => {
    try {
        const result = await orderModel.updateStatus(request.body);
        return apiResponse.successResponse(response, "Order status updated successfully!");
    } catch (err) {
        return apiResponse.errorResponse(response, "Failed to update order status.");
    }
};

// Link checklist to order
module.exports.linkChecklist = async (request, response) => {
    try {
        const result = await orderModel.linkChecklist(request.body);
        return apiResponse.successResponse(response, "Checklist linked to order successfully.");
    } catch (err) {
        return apiResponse.errorResponse(response, "Failed to link checklist.");
    }
};
