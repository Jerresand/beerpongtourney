import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Create a test collection
    const testCollection = mongoose.connection.collection('test');
    
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
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

// Run the test
testConnection(); 