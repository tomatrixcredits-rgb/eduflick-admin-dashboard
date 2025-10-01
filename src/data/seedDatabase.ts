import { supabase } from '../lib/supabase';
import { mockStudents, mockMessages } from './mockData';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    const { data: existingStudents } = await supabase
      .from('students')
      .select('id')
      .limit(1);

    if (existingStudents && existingStudents.length > 0) {
      console.log('Database already has data, skipping seed.');
      return;
    }

    console.log('Seeding students...');
    for (const student of mockStudents) {
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: student.id,
          name: student.name,
          email: student.email,
          avatar_url: student.avatar,
          course_name: student.courseName,
          current_day: student.currentDay,
          total_days: student.totalDays,
          latest_score: student.latestScore,
          needs_mentor: student.needsMentor,
          last_activity: student.lastActivity,
          payment_status: student.paymentStatus,
          enrollment_date: student.enrollmentDate,
          progress: student.progress,
        });

      if (studentError) {
        console.error(`Error seeding student ${student.name}:`, studentError);
      } else {
        console.log(`Seeded student: ${student.name}`);
      }
    }

    console.log('Seeding messages...');
    for (const message of mockMessages) {
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          id: message.id,
          student_id: message.studentId,
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp,
          is_admin_note: message.isAdminNote || false,
        });

      if (messageError) {
        console.error(`Error seeding message ${message.id}:`, messageError);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
}
