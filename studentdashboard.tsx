import { useState } from "react";
import { StudentList } from "./StudentList";
import { ChatInterface } from "./ChatInterface";
import { StudentDetails } from "./StudentDetails";
import { Student } from "../types/student";
import { mockStudents } from "../data/mockData";

export const StudentDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student>(mockStudents[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted/50">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Student Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Monitor student progress, chat messages, and course details</p>
        </header>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          <div className="col-span-3">
            <StudentList
              students={filteredStudents}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          <div className="col-span-6">
            <ChatInterface student={selectedStudent} />
          </div>
          
          <div className="col-span-3">
            <StudentDetails student={selectedStudent} />
          </div>
        </div>
      </div>
    </div>
  );
};