import { useState, useEffect } from "react";
import { StudentList } from "./StudentList";
import { ChatInterface } from "./ChatInterface";
import { StudentDetails } from "./StudentDetails";
import { Student } from "../types/student";
import { getAllStudents, searchStudents, subscribeToStudents } from "../services/studentService";
import { mockStudents } from "../data/mockData";

export const StudentDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
    const unsubscribe = subscribeToStudents((updatedStudents) => {
      setStudents(updatedStudents);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data.length > 0 ? data : mockStudents);
      if (data.length > 0 && !selectedStudent) {
        setSelectedStudent(data[0]);
      } else if (data.length === 0 && mockStudents.length > 0) {
        setSelectedStudent(mockStudents[0]);
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students. Using mock data.');
      setStudents(mockStudents);
      setSelectedStudent(mockStudents[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadStudents();
      return;
    }

    try {
      const results = await searchStudents(query);
      setStudents(results.length > 0 ? results : []);
    } catch (err) {
      console.error('Error searching students:', err);
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase()) ||
        student.courseName.toLowerCase().includes(query.toLowerCase())
      );
      setStudents(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No students found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Student Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Monitor student progress, chat messages, and course details</p>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg text-warning">
            {error}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          <div className="col-span-3">
            <StudentList
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
            />
          </div>

          <div className="col-span-6">
            <ChatInterface student={selectedStudent} />
          </div>

          <div className="col-span-3">
            <StudentDetails student={selectedStudent} onUpdate={loadStudents} />
          </div>
        </div>
      </div>
    </div>
  );
};