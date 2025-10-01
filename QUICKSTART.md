# Quick Start Guide

Get your Student Management Dashboard running in 3 steps!

## Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)

## Step 1: Setup Database (5 minutes)

1. **Go to Supabase**: Open your project at https://0ec90b57d6e95fcbda19832f.supabase.co
2. **SQL Editor**: Click "SQL Editor" in the left sidebar
3. **Copy & Run**:
   - Open `database-setup.sql` from this project
   - Copy all contents
   - Paste in Supabase SQL Editor
   - Click "Run"
4. **Verify**: Go to "Table Editor" - you should see `students`, `chat_messages`, and `admin_notes` tables

## Step 2: Install & Run (2 minutes)

```bash
npm install
npm run dev
```

Open http://localhost:8080

## Step 3: Explore Features

The dashboard will automatically use your database. If the database isn't set up yet, it falls back to mock data so you can still explore the UI.

### Try These Features:
- 🔍 Search for students
- 💬 Send a chat message
- 💳 Update payment status
- 👨‍🏫 Toggle mentor support
- 📊 View student progress

### Real-time Magic:
Open the app in two browser tabs and watch changes sync instantly!

## That's It!

You now have a fully functional admin dashboard with:
- ✅ Real-time updates
- ✅ Database persistence
- ✅ Search functionality
- ✅ CRUD operations
- ✅ Professional UI

## Need Help?

- **Database issues?** Check `SETUP.md`
- **Want details?** Read `README.md`
- **See what was built?** Check `IMPLEMENTATION_SUMMARY.md`

## Production Build

When ready to deploy:

```bash
npm run build
```

Upload the `dist/` folder to your hosting platform (Vercel, Netlify, etc.).

---

**Pro Tip**: The app works without the database setup using mock data, perfect for demos or UI development!
