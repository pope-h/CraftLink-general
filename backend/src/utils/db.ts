import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

/**
 * Connects to the MongoDB database.
 * @async
 * @function connectDB
 * @returns {Promise<void>} A Promise that resolves when the connection is successful or rejects with an error.
 */
const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    // Mongoose connection (for Mongoose-based models)
    await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    // Optional: MongoDB native driver connection
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    
    console.log("Successfully connected to MongoDB!");

    // Important: Don't close the connection in a web app
    // client.close() should NOT be called here as it would close the connection immediately

    // Optional: Store client for potential future use
    // You might want to export this if you need direct MongoDB driver access
    // global.mongoClient = client;

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;