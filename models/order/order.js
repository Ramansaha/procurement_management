const { create, getMany, updateOne, findWithPegination } = require('../../helper/mongo');
const collection = 'orders';
const {ObjectId} = require('mongodb')

// Create order
module.exports.createOrder = async (body, authUser) => {
    try {
        const query = {
            procurementManager: new ObjectId(authUser.userId),
            status: 'pending',
            createdAt: new Date(),
            title : body.title,
            description : body.description,
            clientId : new ObjectId(body.clientId),
            inspectionManagerId : new ObjectId(body.inspectionManagerId)
        };

        return await create(query, collection);
    } catch (error) {
        console.log("Error in createOrder", error);
        return { status: false, message: "Failed to create order" };
    }
};

// Get order based on role
module.exports.getOrders = async (body) => {
    try {
        const query = {};
        if (body.auth.role === 'procurement_manager') query.procurementManager = new ObjectId(body.auth.userId);
        if (body.auth.role === 'inspection_manager') query.inspectionManagerId = new ObjectId(body.auth.userId);
        if (body.auth.role === 'client') query.clientId = new ObjectId(body.auth.userId);
        if (body.orderId) query._id = new ObjectId(body.orderId)

        // return await findWithPegination(query, {}, body, collection)
        return await getMany(query, collection);
    } catch (error) {
        console.log("Error in getOrders", error);
        return { status: false, message: "Error fetching orders" };
    }
};

// Update order status
module.exports.updateStatus = async (body) => {
    try {
        const query = { _id: new ObjectId(body.orderId) };
        const update = { 
            $set : {
                status: body.status
            }
         };
        return await updateOne(query, update, collection);
    } catch (error) {
        console.log("Error in updateStatus", error);
        return { status: false, message: "Failed to update status" };
    }
};

// Link checklist with order
module.exports.linkChecklist = async (body) => {
    try {
        const query = { _id: new ObjectId(body.orderId) };
        const update = {
            $set: {
                checklistId: new ObjectId(body.checklistId)
            }
        };
        return await updateOne(query, update, collection);
    } catch (error) {
        console.log("Error in linkChecklist", error);
        return { status: false, message: "Failed to link checklist" };
    }
};
