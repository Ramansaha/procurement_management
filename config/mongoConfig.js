const { MongoClient } = require('mongodb')
const dotenv = require('dotenv');
dotenv.config()

const hostName = process.env.MONGO_HOSTNAME;
const port = process.env.MONGO_PORT;
const defaultDbName = process.env.MONGO_DBNAME

// Build URI_Name without specifying the dbname
const uri = `mongodb://${hostName}:${port}`

let client;

exports.connectToDb = async (dbName = defaultDbName) => {
    try {
        if (!client) {
            client = new MongoClient(uri);
            await client.connect()
            const db = client.db(dbName)
            console.log('Database connected');
            return db;
        }
        return client.db(dbName)
    } catch (error) {
        console.error('Failed to connect to database:', error)
        throw error
    }
}



