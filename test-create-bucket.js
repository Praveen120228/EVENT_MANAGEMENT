// Simple test script to verify the API route works
async function testCreateBucket() {
  try {
    console.log('Testing bucket creation API...')
    const response = await fetch('http://localhost:3000/api/storage/create-bucket')
    
    if (!response.ok) {
      const error = await response.json()
      console.error('Error creating bucket:', error)
      return
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    console.log('Success! The API is working correctly.')
  } catch (err) {
    console.error('Failed to test API:', err)
  }
}

// Run the test (this only works in browser)
if (typeof window !== 'undefined') {
  testCreateBucket()
} 