# Specyf Platform

A modern event management platform built with Next.js and Supabase.

## Features

- User authentication with email/password
- Event creation and management
- Guest list management
- Calendar integration
- Responsive design
- Guest access portal for RSVP and event interaction
- Real-time messaging between organizers and guests
- Interactive polls and feedback collection

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/specyf-platform.git
   cd specyf-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Setting up guest interaction tables

To enable guest messaging, polls, and other interaction features, run:

```bash
npm run migrate:guest-tables
# or
yarn migrate:guest-tables
```

This will create the following tables in your Supabase database:
- `messages` - For guest-organizer communication
- `polls` - For creating feedback questions
- `poll_responses` - For storing guest responses to polls

## Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Project Settings > API to find your project URL and anon key
3. Add these values to your `.env.local` file
4. Enable Email Auth in Authentication > Providers > Email
5. Configure your email provider in Authentication > Email Templates

## Guest Access Features

The platform includes a dedicated guest portal that allows event guests to:

1. **Access events** - Using their email and guest ID from invitations
2. **RSVP to events** - Confirm or decline attendance
3. **Communicate with organizers** - Through a real-time messaging system
4. **Respond to polls** - Answer questions and provide feedback
5. **View event details** - See all information about the event

Guests don't need to create full accounts - the system creates temporary authenticated sessions tied to their guest ID.

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