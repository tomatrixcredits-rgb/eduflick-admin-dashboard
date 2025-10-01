export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string
          course_name: string
          current_day: number
          total_days: number
          latest_score: number
          needs_mentor: boolean
          last_activity: string
          payment_status: 'paid' | 'pending' | 'overdue'
          enrollment_date: string
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string
          course_name: string
          current_day?: number
          total_days: number
          latest_score?: number
          needs_mentor?: boolean
          last_activity?: string
          payment_status?: 'paid' | 'pending' | 'overdue'
          enrollment_date?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string
          course_name?: string
          current_day?: number
          total_days?: number
          latest_score?: number
          needs_mentor?: boolean
          last_activity?: string
          payment_status?: 'paid' | 'pending' | 'overdue'
          enrollment_date?: string
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          student_id: string
          sender: 'student' | 'admin'
          content: string
          timestamp: string
          is_admin_note: boolean
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          sender: 'student' | 'admin'
          content: string
          timestamp?: string
          is_admin_note?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          sender?: 'student' | 'admin'
          content?: string
          timestamp?: string
          is_admin_note?: boolean
          created_at?: string
        }
      }
      admin_notes: {
        Row: {
          id: string
          student_id: string
          content: string
          admin_name: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          content: string
          admin_name: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          content?: string
          admin_name?: string
          timestamp?: string
          created_at?: string
        }
      }
    }
  }
}
