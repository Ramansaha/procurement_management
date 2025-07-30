const { connectToDb } = require('../config/mongoConfig')

//  InsertOne data to the database
module.exports.create = async (query, collection_name, logInfo) => {
    let db;
    try {
        db = await connectToDb();
        const collection = db.collection(collection_name);
        const result = await collection.insertOne(query);

        try {
            // Log the request details
            // await logRequest(logInfo);
        } catch (logError) {
            return { status: true, data: result }
        }

        return { status: true, data: result }
    } catch (error) {
        throw error;
        // return { status: false, error }
    }
}

// InsertMany data to the database
module.exports.createMany = async (query, collection_name, logInfo) => {
    let db;
    try {
        db = await connectToDb();
        const collection = db.collection(collection_name);
        const result = await collection.insertMany(query);

        try {
            // Log the request details
            // await logRequest(logInfo);
        } catch (logError) {
            return { status: true, data: result }
        }

        return { status: true, data: result }
    } catch (error) {
        throw error;
        // return { status: false, error }
    }
}

// FindOne data from the database
module.exports.getOne = async (query, collection_name, logInfo) => {
    let db;
    try {
        db = await connectToDb();
        const collection = db.collection(collection_name);
        const result = await collection.findOne(query);
        if(result == null || result.length == 0) return {status: false} 

        return { status: true, data: result }
    } catch (error) {
        throw error;
        // return { status: false, error }
    }
}

// FindMany data from the database
module.exports.getMany = async (query, collection_name, logInfo) => {
    let db;
    try {
        db = await connectToDb();
        const collection = db.collection(collection_name);
        const result = await collection.find(query).toArray();

        if(result.error) throw {error : result.error}

        return { status: true, data: result }
    } catch (error) {
        throw error;
        // return { status: false, error }
    }
}

// UpdateOne data to the database
module.exports.updateOne = async (query, update, collection_name, logInfo) => {
    let db;
    try {
        db = await connectToDb();
        const collection = db.collection(collection_name);
        const result = await collection.updateOne(query, update);

        if (result.matchedCount <= 0 && result.modifiedCount === 0) {
            throw {}
        }

        return { status: true, message: "Document upadted successfully"}
    } catch (error) {
        console.log(error);
        console.error('An updateError occured', error)
        throw error;
        // return { status: false, error }
    }
}

// UpdateMany data to the database
module.exports.updateMany = async (query, update, collection_name, logInfo) => {
    let db;
    try {
        db = await connectToDb();
        const collection = db.collection(collection_name);
        const result = await collection.updateOne(query, update);

        // Check if no documents were modified
        if (result.matchedCount === o) {
            return {status : true, message : "NO documents were updated as the data was already up-to-date"}
        }

        try {
            // Log the request details
            // /await logRequest(logInfo)
        } catch (error) {
            return {status : true, message : "Documents updated successfully!"}
        }

        return { status: true, message: "Document updated successfully"}
    } catch (error) {
        console.error('An updateError occured', error)
        throw error;
        // return { status: false, error }
    }
}

// Aggregate data from the database
module.exports.aggregate = async (query, collection_name) => {
    let db;
    try {
        db = await connectToDb();
        const collection = db.collection(collection_name)
        const cursor = collection.aggregate(query);
        if (cursor == null) throw {};

        const result = await cursor.toArray();
        if (result == null) throw {};
        return { status: true, data: result }
    } catch (error) {
        return { status: false, error }
    }
}

// Find with pagination
module.exports.findWithPegination = async (params, projection, query, collectionName) => {
    try {
        const db = await connectToDb();
        const collection = db.collection(collectionName);

        const page = query.page ? parseInt(query.page) : 1;
        let limit = query.limit ? parseInt(query.limit) : 10;
        const sortBy = query.sortBy || "createdAt";
        const sortOrder = query.sortOrder ? parseInt(query.sortOrder) : -1;

        const sortOptions = {
            [sortBy]: sortOrder,
        };

        const projectionObj = projection ? projection : {};

        const totalRecord = await collection.countDocuments(params);
        const data = await collection.find(params)
            .project(projectionObj) // Use projection here
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return {
            status: true,
            totalRecord: totalRecord,
            data: data,
            next_page: totalRecord > page * limit ? true : false,
        }

    } catch (error) {
        throw error
    }
}