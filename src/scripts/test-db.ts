import { connectDB } from '../api-lib/mongodb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  let db: typeof mongoose | null = null;
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect to MongoDB using our improved connection handler
    db = await connectDB();
    console.log('Connected to MongoDB successfully!');

    // Create a test collection
    const testCollection = db.connection.collection('test');
    
    // Insert a test document
    await testCollection.insertOne({
      test: true,
      createdAt: new Date(),
      message: 'Test connection successful'
    });

    console.log('Test document inserted successfully!');
    
    // Read the test document back
    const doc = await testCollection.findOne({ test: true });
    console.log('Retrieved test document:', doc);

  } catch (error) {
    console.error('Error:', error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error);
  } finally {
    // Close the connection
    if (db?.connection.readyState === 1) {
      await db.connection.close();
      console.log('Connection closed');
    }
  }
}

// Run the test
testConnection(); 