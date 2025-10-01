import { supabase } from '../lib/supabase';
import type { AdminNote } from '../types/student';
import type { Database } from '../types/database';

type NoteRow = Database['public']['Tables']['admin_notes']['Row'];
type NoteInsert = Database['public']['Tables']['admin_notes']['Insert'];

function mapNoteFromDb(row: NoteRow): AdminNote {
  return {
    id: row.id,
    studentId: row.student_id,
    content: row.content,
    timestamp: row.timestamp,
    adminName: row.admin_name,
  };
}

export async function getNotesByStudentId(studentId: string): Promise<AdminNote[]> {
  const { data, error } = await supabase
    .from('admin_notes')
    .select('*')
    .eq('student_id', studentId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching admin notes:', error);
    throw error;
  }

  return data.map(mapNoteFromDb);
}

export async function createAdminNote(note: Omit<AdminNote, 'id'>): Promise<AdminNote> {
  const noteData: NoteInsert = {
    student_id: note.studentId,
    content: note.content,
    admin_name: note.adminName,
    timestamp: note.timestamp,
  };

  const { data, error } = await supabase
    .from('admin_notes')
    .insert(noteData)
    .select()
    .single();

  if (error) {
    console.error('Error creating admin note:', error);
    throw error;
  }

  return mapNoteFromDb(data);
}

export async function deleteAdminNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('admin_notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting admin note:', error);
    throw error;
  }
}
