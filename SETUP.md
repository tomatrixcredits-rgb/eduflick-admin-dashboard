# Quick Setup Guide

Follow these steps to get your Student Management Dashboard up and running with Supabase.

## Step 1: Database Setup

You need to set up the database tables in your Supabase project. Since there was an issue with the automatic database setup, follow these manual steps:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Open your project: https://0ec90b57d6e95fcbda19832f.supabase.co

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Database Setup Script**
   - Open the file `database-setup.sql` in this project
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click "Run" to execute the script

4. **Verify Setup**
   - Go to "Table Editor" in Supabase
   - You should see three tables: `students`, `chat_messages`, and `admin_notes`
   - Check that sample data has been inserted

## Step 2: Run the Application

```bash
npm run dev
```

The application will start on http://localhost:8080

## Step 3: Verify Everything Works

1. **Student List**: You should see 5 sample students in the left panel
2. **Chat Interface**: Click on a student to view their chat history
3. **Student Details**: See progress, scores, and payment status in the right panel
4. **Real-time Updates**: Try updating a payment status or toggling mentor support

## Troubleshooting

### "Failed to load students" Error

If you see this error:
1. Check that the database tables were created successfully in Supabase
2. Verify your environment variables in `.env` are correct
3. Check the browser console for detailed error messages

### Mock Data Fallback

If the database isn't set up, the app will automatically use mock data. You'll see a warning message at the top of the dashboard. This allows you to explore the UI before setting up the database.

### Database Connection Issues

If you have connection issues:
1. Verify your Supabase project is active
2. Check that the anon key in `.env` matches your Supabase project
3. Make sure RLS policies are set up correctly (they're in `database-setup.sql`)

## Features to Test

Once everything is set up, try these features:

- [ ] Search for students by name, email, or course
- [ ] Send a message to a student
- [ ] Update a student's payment status
- [ ] Toggle mentor support flag
- [ ] Watch for real-time updates (open in two browser tabs)
- [ ] Check student progress and scores

## Next Steps

- Review the README.md for detailed documentation
- Customize the design in `src/index.css`
- Add more students through the database
- Explore the service layer in `src/services/`
- Build new features using the existing patterns

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review the database logs in Supabase
3. Ensure all dependencies are installed (`npm install`)
4. Try rebuilding the project (`npm run build`)

The application is designed to be resilient and will fall back to mock data if the database isn't available, so you can always explore the UI.
