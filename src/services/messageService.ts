import { supabase } from '../lib/supabase';
import type { ChatMessage } from '../types/student';
import type { Database } from '../types/database';

type MessageRow = Database['public']['Tables']['chat_messages']['Row'];
type MessageInsert = Database['public']['Tables']['chat_messages']['Insert'];

function mapMessageFromDb(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    studentId: row.student_id,
    sender: row.sender,
    content: row.content,
    timestamp: row.timestamp,
    isAdminNote: row.is_admin_note,
  };
}

export async function getMessagesByStudentId(studentId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('student_id', studentId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data.map(mapMessageFromDb);
}

export async function sendMessage(message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
  const messageData: MessageInsert = {
    student_id: message.studentId,
    sender: message.sender,
    content: message.content,
    timestamp: message.timestamp,
    is_admin_note: message.isAdminNote || false,
  };

  const { data, error } = await supabase
    .from('chat_messages')
    .insert(messageData)
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  return mapMessageFromDb(data);
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

export function subscribeToMessages(studentId: string, callback: (messages: ChatMessage[]) => void) {
  const channel = supabase
    .channel(`messages_${studentId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_messages',
        filter: `student_id=eq.${studentId}`,
      },
      async () => {
        const messages = await getMessagesByStudentId(studentId);
        callback(messages);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function getUnreadCount(studentId: string): Promise<number> {
  const { count, error } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('sender', 'student');

  if (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }

  return count || 0;
}
