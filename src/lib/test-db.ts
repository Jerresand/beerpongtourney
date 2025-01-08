export async function testMongoConnection() {
  try {
    console.log('Testing MongoDB connection through API...');
    const response = await fetch('/api/test-db');
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ MongoDB connection test passed:', result.message);
      return true;
    } else {
      console.error('❌ MongoDB connection test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Failed to test MongoDB connection:', error);
    return false;
  }
} 