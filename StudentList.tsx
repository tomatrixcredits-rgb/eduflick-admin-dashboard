import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Student } from "../types/student";

interface StudentListProps {
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (student: Student) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const StudentList = ({
  students,
  selectedStudent,
  onSelectStudent,
  searchQuery,
  onSearchChange,
}: StudentListProps) => {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl border shadow-soft h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {students.map((student) => (
          <div
            key={student.id}
            onClick={() => onSelectStudent(student)}
            className={`p-4 border-b border-border/50 cursor-pointer transition-all duration-200 hover:bg-muted/30 ${
              selectedStudent.id === student.id ? 'bg-primary/5 border-r-2 border-r-primary' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {student.unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {student.unreadCount}
                  </Badge>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm truncate">{student.name}</h3>
                  {student.needsMentor && (
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
                      Mentor
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {student.courseName}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    Day {student.currentDay}/{student.totalDays}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getPaymentStatusColor(student.paymentStatus)}`}
                  >
                    {student.paymentStatus}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    Score: {student.latestScore}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {student.lastActivity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};