-- Clear existing data
DELETE FROM guests;
DELETE FROM events;
DELETE FROM event_announcements;
DELETE FROM event_polls;

-- Insert a test user
INSERT INTO auth.users (id, email) 
VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com');

-- Insert a profile for the test user
INSERT INTO profiles (id, user_id, full_name, email) 
VALUES (uuid_generate_v4(), '00000000-0000-0000-0000-000000000000', 'Test User', 'test@example.com');

-- Insert test events
INSERT INTO events (id, title, description, date, time, location, max_guests, organizer_id, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Annual Company Conference', 'Join us for our annual company conference where we will discuss the latest trends and strategies for the upcoming year.', '2023-12-15', '09:00 AM', 'Grand Hotel, 123 Main St, New York, NY', 100, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Product Launch Party', 'Be the first to experience our new product line! Food and drinks will be provided.', '2023-10-20', '06:30 PM', 'Tech Hub, 456 Innovation Ave, San Francisco, CA', 50, '00000000-0000-0000-0000-000000000000', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Team Building Workshop', 'A day full of fun activities and exercises designed to strengthen team bonds and improve collaboration.', '2023-09-05', '10:00 AM', 'Adventure Park, 789 Oak Rd, Seattle, WA', 30, '00000000-0000-0000-0000-000000000000', NOW(), NOW());

-- Insert test guests
INSERT INTO guests (id, event_id, name, email, status, response_date, message, created_at, updated_at)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', 'confirmed', NOW() - INTERVAL '2 days', 'Looking forward to the event!', NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Jane Smith', 'jane@example.com', 'pending', NULL, NULL, NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Bob Johnson', 'bob@example.com', 'declined', NOW() - INTERVAL '1 day', 'Sorry, I have a conflict.', NOW(), NOW()),
  
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Alice Brown', 'alice@example.com', 'confirmed', NOW() - INTERVAL '3 days', NULL, NOW(), NOW()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'Charlie Davis', 'charlie@example.com', 'pending', NULL, NULL, NOW(), NOW()),
  
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'Eva Wilson', 'eva@example.com', 'confirmed', NOW() - INTERVAL '1 day', 'Can\'t wait!', NOW(), NOW()),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '33333333-3333-3333-3333-333333333333', 'Frank Miller', 'frank@example.com', 'declined', NOW() - INTERVAL '4 days', 'I\'ll be out of town.', NOW(), NOW());

-- Insert test announcements
INSERT INTO event_announcements (event_id, title, content, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Schedule Update', 'The conference will now start at 9:30 AM instead of 9:00 AM to accommodate more attendees.', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('11111111-1111-1111-1111-111111111111', 'Keynote Speaker Announced', 'We are excited to announce that Jane Smith, CEO of Innovations Inc., will be our keynote speaker!', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('11111111-1111-1111-1111-111111111111', 'Parking Information', 'Free parking will be available in the south lot. Please bring your event ticket for validation.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  
  ('22222222-2222-2222-2222-222222222222', 'Product Details Revealed', 'Our new product line will include 5 innovative gadgets that will revolutionize the industry.', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('22222222-2222-2222-2222-222222222222', 'Special Guest Performer', 'A surprise musical guest will perform at the end of the launch event!', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Insert test polls
INSERT INTO event_polls (event_id, question, options, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Which workshop track are you most interested in attending?', '["Marketing Strategies", "Technical Innovations", "Leadership Skills", "Customer Experience"]', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  ('11111111-1111-1111-1111-111111111111', 'What type of food would you prefer for lunch?', '["Mediterranean", "Asian Fusion", "American", "Italian"]', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  
  ('22222222-2222-2222-2222-222222222222', 'Which feature are you most excited about?', '["AI Integration", "Battery Life", "Design", "Performance"]', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  
  ('33333333-3333-3333-3333-333333333333', 'What team building activity would you prefer?', '["Escape Room", "Cooking Challenge", "Outdoor Adventure", "Creative Workshop"]', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- Insert test email logs
INSERT INTO email_logs (event_id, type, subject, recipient_count, sent_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'invitation', 'You\'re invited to the Annual Company Conference', 3, NOW() - INTERVAL '10 days'),
  ('11111111-1111-1111-1111-111111111111', 'reminder', 'Reminder: Annual Company Conference is next week', 3, NOW() - INTERVAL '7 days'),
  ('11111111-1111-1111-1111-111111111111', 'announcement', 'Important Update: Schedule Change for the Conference', 2, NOW() - INTERVAL '5 days'),
  
  ('22222222-2222-2222-2222-222222222222', 'invitation', 'You\'re invited to our Product Launch Party', 2, NOW() - INTERVAL '8 days'),
  ('22222222-2222-2222-2222-222222222222', 'reminder', 'Reminder: Product Launch Party is coming up', 2, NOW() - INTERVAL '3 days'),
  
  ('33333333-3333-3333-3333-333333333333', 'invitation', 'Team Building Workshop Invitation', 2, NOW() - INTERVAL '14 days'),
  ('33333333-3333-3333-3333-333333333333', 'reminder', 'Reminder: Team Building Workshop is next week', 2, NOW() - INTERVAL '7 days'); 