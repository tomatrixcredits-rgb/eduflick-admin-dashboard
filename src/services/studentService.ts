import { supabase } from '../lib/supabase';
import type { Student } from '../types/student';
import type { Database } from '../types/database';

type StudentRow = Database['public']['Tables']['students']['Row'];
type StudentInsert = Database['public']['Tables']['students']['Insert'];
type StudentUpdate = Database['public']['Tables']['students']['Update'];

function mapStudentFromDb(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar_url,
    courseName: row.course_name,
    currentDay: row.current_day,
    totalDays: row.total_days,
    latestScore: row.latest_score,
    needsMentor: row.needs_mentor,
    unreadCount: 0,
    lastActivity: row.last_activity,
    paymentStatus: row.payment_status,
    enrollmentDate: row.enrollment_date,
    progress: row.progress,
  };
}

function mapStudentToDb(student: Partial<Student>): StudentInsert | StudentUpdate {
  return {
    name: student.name,
    email: student.email,
    avatar_url: student.avatar || '',
    course_name: student.courseName,
    current_day: student.currentDay,
    total_days: student.totalDays,
    latest_score: student.latestScore,
    needs_mentor: student.needsMentor,
    last_activity: student.lastActivity,
    payment_status: student.paymentStatus,
    enrollment_date: student.enrollmentDate,
    progress: student.progress,
  };
}

export async function getAllStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching students:', error);
    throw error;
  }

  return data.map(mapStudentFromDb);
}

export async function getStudentById(id: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching student:', error);
    throw error;
  }

  return data ? mapStudentFromDb(data) : null;
}

export async function createStudent(student: Omit<Student, 'id' | 'unreadCount'>): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .insert(mapStudentToDb(student))
    .select()
    .single();

  if (error) {
    console.error('Error creating student:', error);
    throw error;
  }

  return mapStudentFromDb(data);
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .update(mapStudentToDb(updates))
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating student:', error);
    throw error;
  }

  return mapStudentFromDb(data);
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}

export async function searchStudents(query: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,course_name.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching students:', error);
    throw error;
  }

  return data.map(mapStudentFromDb);
}

export function subscribeToStudents(callback: (students: Student[]) => void) {
  const channel = supabase
    .channel('students_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'students',
      },
      async () => {
        const students = await getAllStudents();
        callback(students);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
