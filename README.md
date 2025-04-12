# Specyf - Event Management Platform

Specyf is a modern event management platform built for creators, students, communities, and businesses. It enables users to create and manage events of various types, including workshops, meetups, business events, personal functions, and college fests.

## Features

- User authentication with email/password
- Event creation and management
- Guest list management
- Calendar integration
- Responsive design
- Guest access portal for RSVP and event interaction
- Real-time messaging between organizers and guests
- Interactive polls and feedback collection

## Guest Management System

Specyf features a frictionless guest management system that doesn't require guests to create accounts. Instead, it uses a tokenized URL approach for authentication:

### Key Features

1. **Account-Free Guest Experience**
   - Guests receive personalized invitation links via email
   - Guests can RSVP without creating an account or logging in
   - Each invitation link contains unique identifiers for the event and guest

2. **Email Communication**
   - Automated invitation emails with event details and response links
   - Reminder emails for pending responses
   - Announcement emails for important updates
   - Support for custom email templates

3. **Guest Management Dashboard**
   - View all guests for an event with their response status
   - Filter and search guests 
   - Add guests individually or in bulk
   - Track confirmation and attendance rates

4. **Interactive Features for Guests**
   - Response status tracking (confirmed, declined, pending)
   - Optional message field for guests to communicate with organizers
   - Access to event announcements after responding
   - Participation in event polls

## Technical Implementation

### Guest Authentication Flow

1. **Invitation Link Generation**:
   - Each guest receives a unique URL: `/guest/response/{eventId}/{guestId}`
   - This URL contains the necessary identifiers to authenticate the guest
   - No passwords or user accounts required

2. **Response Process**:
   - Guest clicks the link in their email
   - System verifies the event and guest IDs
   - Guest can confirm or decline their attendance
   - Optional message field for the organizer

3. **Event Details Access**:
   - After responding, guests can view complete event details at `/guest/events/{eventId}?guestId={guestId}`
   - Access to announcements and polls if available

### Email System

We use Nodemailer for email delivery with the following features:

- **Environment-Based Behavior**:
  - Development: Emails are logged to console
  - Production: Emails are sent through configured provider
  
- **Email Types**:
  - Invitations
  - Reminders
  - Announcements
  
- **Tracking and Logging**:
  - All sent emails are logged in the database
  - Success/failure tracking
  - Recipient counts and delivery timestamps

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Email provider account (for production)

### Configuration

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Copy `.env.example` to `.env.local` and fill in the values
4. Set up your Supabase database (migrations are in `/supabase/migrations`)
5. Run `pnpm dev` to start the development server

### Email Configuration

For production deployment, set the following environment variables:

```
EMAIL_SERVICE=gmail     # or another supported service
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Your Name <your-email@example.com>
NEXT_PUBLIC_APP_URL=https://your-production-url.com
```

For development, the system will log emails to the console instead of sending them.

### Testing the Guest Experience

You can test the guest invitation system using the script:

```
node scripts/sample-invitation-links.js
```

This will generate test links for the sample guests included in the seed data.

## Database Schema

The guest system uses the following key tables:

- `guests`: Stores guest information and response status
- `event_announcements`: Stores event announcements
- `event_polls`: Stores polls created by organizers
- `event_poll_responses`: Tracks guest responses to polls
- `email_logs`: Records all email communications

## Project Structure

- `app/` - Next.js app router pages and API routes
  - `app/guest/` - Guest-facing pages and components
  - `app/events/` - Event management and viewing
  - `app/auth/` - Authentication flows
- `components/` - Reusable UI components
- `contexts/` - React context providers
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and libraries
- `public/` - Static assets
- `supabase/migrations/` - Database schema migrations
- `types/` - TypeScript type definitions

## Deployment

This project can be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 