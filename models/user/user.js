const { create, getOne, getMany, aggregate, updateMany, updateOne, createMany } = require('../../helper/mongo');
const { ObjectId } = require('mongodb')

const collection_name = 'user'

// Check if user already exists
module.exports.isUserExists = async (body) => {
    try {
        const query = {
            $or: []
        };
        if (body.email) query.$or.push({ email: body.email });
        if (body.mobile) query.$or.push({ mobile: body.mobile });
        if (body.userId) query.$or.push({ _id: new ObjectId(body.userId) });

        if (query.$or.length === 0) return null;
        return await getOne(query, collection_name)
    } catch (error) {
        console.log('Error while fetching data from isUserExists in userModel');
        throw error
    }
}

// Get Auth User
module.exports.getAuthUser = async (body) => {
    try {
        const query = body.mobile ? { mobile: body.mobile } : body.email ? { email: body.email } : null
        return await getOne(query, collection_name)
    } catch (error) {
        console.log('Error while fetching data from authUser in userModel');
        throw error
    }
}

// Register user(admin)
module.exports.register = async (body) => {
    try {
        const query = {
            password: body.hashPassword,
            isActive: true,
            role: "admin",
            createdDate: new Date()
        }
        if (body.mobile) query.mobile = body.mobile;
        if (body.email) query.email = body.email
        return await create(query, collection_name)
    } catch (error) {
        console.log('Error while registering data from register in userModel');
        throw error
    }
}

// Add User Details
module.exports.addUser = async (body) => {
    try {
        let query = {
            name: body.name,
            mobile: body.mobile,
            password: body.hashPassword,
            role: body.role,
            isActive: true,
            createdDate: new Date(),
            updatedDate: new Date()
          };
        if(body.procurementManager) query.procurementManager = new ObjectId(body.procurementManager)
        if(body.email) query.email = body.email
        return await create(query, collection_name)
    } catch (error) {
        console.log('Error while adding data from addUser in userModel');
        throw error
    }
}

// Get User Details
module.exports.getUser = async (body) => {
    try {
        let query = {}

        if (body.name) query.name = body.name
        if (body.userId) query._id = new ObjectId(body.userId)
        if (body.mobile) query.mobile = body.mobile
        if (body.email) query.email = body.email

        return await getMany(query, collection_name)
    } catch (error) {
        console.log('Error while getting data from getUser in userModel');
        throw error
    }
}

//  Update user details
module.exports.updateUser = async (body) => {
    try {
        let query = {
            _id : new ObjectId(body.userId)
        }
        let update = {
            $set: {
                procurementManager: new ObjectId(body.procurementManager)
            }
        }
        return await updateOne(query, update, collection_name)
    } catch (error) {
        console.log('Error while updating data from updateUser in userModel');
        throw error
    }
}