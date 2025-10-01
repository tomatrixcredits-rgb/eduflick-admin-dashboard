-- Student Management Dashboard - Database Setup
-- Run this SQL script in your Supabase SQL Editor to set up the database

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text DEFAULT '',
  course_name text NOT NULL,
  current_day integer DEFAULT 1,
  total_days integer NOT NULL,
  latest_score integer DEFAULT 0,
  needs_mentor boolean DEFAULT false,
  last_activity text DEFAULT 'Just now',
  payment_status text DEFAULT 'pending',
  enrollment_date date DEFAULT CURRENT_DATE,
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_score CHECK (latest_score >= 0 AND latest_score <= 100),
  CONSTRAINT valid_progress CHECK (progress >= 0 AND progress <= 100),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('paid', 'pending', 'overdue'))
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  sender text NOT NULL,
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  is_admin_note boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_sender CHECK (sender IN ('student', 'admin'))
);

-- Create admin_notes table
CREATE TABLE IF NOT EXISTS admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  content text NOT NULL,
  admin_name text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_student_id ON chat_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notes_student_id ON admin_notes(student_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_timestamp ON admin_notes(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to students"
  ON students FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to students"
  ON students FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to students"
  ON students FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to students"
  ON students FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to chat_messages"
  ON chat_messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to chat_messages"
  ON chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to chat_messages"
  ON chat_messages FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to chat_messages"
  ON chat_messages FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to admin_notes"
  ON admin_notes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to admin_notes"
  ON admin_notes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to admin_notes"
  ON admin_notes FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to admin_notes"
  ON admin_notes FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove if you don't want sample data)
INSERT INTO students (id, name, email, avatar_url, course_name, current_day, total_days, latest_score, needs_mentor, last_activity, payment_status, enrollment_date, progress) VALUES
('1', 'Sarah Johnson', 'sarah.johnson@email.com', 'https://images.unsplash.com/photo-1494790108755-2616b612142c?w=50&h=50&fit=crop&crop=face', 'Advanced React Development', 15, 30, 92, false, '2 hours ago', 'paid', '2024-01-15', 50),
('2', 'Michael Chen', 'michael.chen@email.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', 'Python for Data Science', 8, 45, 78, true, '1 day ago', 'paid', '2024-02-01', 18),
('3', 'Emily Rodriguez', 'emily.rodriguez@email.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face', 'UX/UI Design Fundamentals', 22, 35, 88, false, '3 hours ago', 'pending', '2024-01-08', 63),
('4', 'David Thompson', 'david.thompson@email.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', 'Machine Learning Basics', 5, 60, 65, true, '30 minutes ago', 'overdue', '2024-02-10', 8),
('5', 'Lisa Wang', 'lisa.wang@email.com', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face', 'Full Stack Web Development', 28, 50, 95, false, '1 hour ago', 'paid', '2024-01-20', 56)
ON CONFLICT (id) DO NOTHING;

-- Insert sample messages
INSERT INTO chat_messages (id, student_id, sender, content, timestamp, is_admin_note) VALUES
('1', '1', 'student', 'Hi! I''m having trouble understanding the useEffect hook in React. Could you help me with the cleanup function?', '2024-02-20T10:30:00Z', false),
('2', '1', 'admin', 'Of course! The cleanup function in useEffect is used to prevent memory leaks. It runs when the component unmounts or before the effect runs again. Here''s a simple example...', '2024-02-20T10:35:00Z', false),
('3', '1', 'admin', 'Note: Student shows good understanding of React fundamentals but needs more practice with hooks.', '2024-02-20T10:36:00Z', true),
('4', '1', 'student', 'Thank you! That makes much more sense now. I''ll practice with some examples.', '2024-02-20T10:40:00Z', false),
('5', '2', 'student', 'I''m struggling with pandas DataFrames. The indexing is confusing me.', '2024-02-19T14:20:00Z', false),
('6', '2', 'admin', 'Pandas indexing can be tricky at first. Let''s break it down: .loc is for label-based indexing, .iloc is for position-based indexing...', '2024-02-19T14:25:00Z', false)
ON CONFLICT (id) DO NOTHING;
