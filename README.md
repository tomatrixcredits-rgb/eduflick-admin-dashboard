# Student Management Dashboard

A modern, fully functional admin dashboard for managing students, tracking their progress, and communicating through real-time chat. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Student Management**: View, search, and manage student records
- **Real-time Chat**: Communicate with students with live message updates
- **Progress Tracking**: Monitor course progress, scores, and completion status
- **Payment Management**: Track and update payment statuses (paid, pending, overdue)
- **Mentor Support**: Flag students who need additional mentor support
- **Admin Notes**: Create private administrative notes for student records
- **Real-time Updates**: Automatic updates when data changes using Supabase real-time subscriptions
- **Responsive Design**: Beautiful UI that works on all device sizes

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **State Management**: React hooks
- **Routing**: React Router v6

## Project Structure

```
project/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # UI component library
│   │   ├── ChatInterface.tsx
│   │   ├── StudentDetails.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── StudentList.tsx
│   ├── data/                # Mock data and seed scripts
│   │   ├── mockData.ts
│   │   └── seedDatabase.ts
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts
│   ├── pages/               # Page components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── services/            # API service layer
│   │   ├── studentService.ts
│   │   ├── messageService.ts
│   │   └── adminNoteService.ts
│   ├── types/               # TypeScript types
│   │   ├── student.ts
│   │   └── database.ts
│   ├── app.tsx              # App root component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── database-setup.sql       # Database schema setup
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `database-setup.sql`
4. Run the SQL script to create tables and insert sample data

### 3. Configure Environment Variables

The project uses these environment variables (already configured in `.env`):

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### 5. Build for Production

```bash
npm run build
```

## Database Schema

### Students Table
- `id`: UUID (Primary Key)
- `name`: Student's full name
- `email`: Unique email address
- `avatar_url`: Avatar image URL
- `course_name`: Enrolled course name
- `current_day`: Current day in course
- `total_days`: Total course duration
- `latest_score`: Most recent score (0-100)
- `needs_mentor`: Boolean flag for mentor support
- `last_activity`: Human-readable last activity
- `payment_status`: paid | pending | overdue
- `enrollment_date`: Date enrolled
- `progress`: Course progress percentage
- `created_at`, `updated_at`: Timestamps

### Chat Messages Table
- `id`: UUID (Primary Key)
- `student_id`: Foreign key to students
- `sender`: student | admin
- `content`: Message text
- `timestamp`: Message timestamp
- `is_admin_note`: Boolean for internal notes
- `created_at`: Timestamp

### Admin Notes Table
- `id`: UUID (Primary Key)
- `student_id`: Foreign key to students
- `content`: Note content
- `admin_name`: Admin who created note
- `timestamp`: Note timestamp
- `created_at`: Timestamp

## Key Features Implemented

### Real-time Subscriptions
The dashboard uses Supabase real-time subscriptions to automatically update when:
- Students are added, updated, or deleted
- New messages are sent
- Student details change

### CRUD Operations
- **Create**: Add new students and messages
- **Read**: View all students, messages, and details
- **Update**: Modify student information, payment status, mentor flags
- **Delete**: Remove students and messages

### Search Functionality
- Search students by name, email, or course name
- Real-time filtering with Supabase queries
- Falls back to client-side search if database is unavailable

### Error Handling
- Graceful fallback to mock data if database is unavailable
- User-friendly error messages
- Loading states for all async operations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Security

The project uses Row Level Security (RLS) policies in Supabase:
- Currently configured for public access (suitable for admin dashboard)
- Can be easily updated to require authentication
- All policies are defined in `database-setup.sql`

## Database Setup Instructions

To set up your Supabase database:

1. Open your Supabase project at https://supabase.com
2. Go to the SQL Editor
3. Copy the entire contents of `database-setup.sql`
4. Paste and run the script
5. Verify that the tables were created in the Table Editor

The script will create all necessary tables, indexes, RLS policies, and insert sample data.

## Future Enhancements

- Add authentication for admin users
- Implement role-based access control
- Add file upload for student avatars
- Create analytics dashboard
- Add email notifications
- Export student data to CSV
- Add bulk operations
- Implement student self-service portal

## License

MIT License - feel free to use this project for your own purposes.
