/**
 * This script provides sample invitation links for testing the guest experience
 * using our seed data. These links can be accessed without sending actual emails.
 */

// Define the base URL (change this to your local development URL)
const BASE_URL = 'http://localhost:3005'

// Event and guest IDs from seed.sql
const EVENTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Annual Company Conference',
    guests: [
      { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'John Doe', email: 'john@example.com', status: 'confirmed' },
      { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Jane Smith', email: 'jane@example.com', status: 'pending' },
      { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Bob Johnson', email: 'bob@example.com', status: 'declined' },
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Product Launch Party',
    guests: [
      { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Alice Brown', email: 'alice@example.com', status: 'confirmed' },
      { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Charlie Davis', email: 'charlie@example.com', status: 'pending' },
    ]
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Team Building Workshop',
    guests: [
      { id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', name: 'Eva Wilson', email: 'eva@example.com', status: 'confirmed' },
      { id: 'gggggggg-gggg-gggg-gggg-gggggggggggg', name: 'Frank Miller', email: 'frank@example.com', status: 'declined' },
    ]
  }
]

console.log('\n=== Test Guest Invitation Links ===\n')

// Generate links for each event and guest
EVENTS.forEach(event => {
  console.log(`\nEVENT: ${event.title}\n${'='.repeat(event.title.length + 7)}\n`)
  
  event.guests.forEach(guest => {
    const responseLink = `${BASE_URL}/guest/response/${event.id}/${guest.id}`
    const eventDetailsLink = `${BASE_URL}/guest/events/${event.id}?guestId=${guest.id}`
    
    console.log(`Guest: ${guest.name} (${guest.email})`)
    console.log(`Status: ${guest.status}`)
    console.log(`Response Link: ${responseLink}`)
    console.log(`Event Details: ${eventDetailsLink}`)
    console.log('---')
  })
})

console.log('\nCopy these links to test the guest experience without needing to send actual emails.')
console.log('Make sure your development server is running (pnpm dev)') 