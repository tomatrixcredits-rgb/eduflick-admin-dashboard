import { useState } from "react";
import { Calendar, Award, CreditCard, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Student } from "../types/student";
import { updateStudent } from "../services/studentService";

interface StudentDetailsProps {
  student: Student;
  onUpdate?: () => void;
}

export const StudentDetails = ({ student, onUpdate }: StudentDetailsProps) => {
  const [updating, setUpdating] = useState(false);

  const handleToggleMentor = async () => {
    try {
      setUpdating(true);
      await updateStudent(student.id, { needsMentor: !student.needsMentor });
      onUpdate?.();
    } catch (err) {
      console.error('Error updating mentor status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePaymentStatus = async (status: 'paid' | 'pending' | 'overdue') => {
    try {
      setUpdating(true);
      await updateStudent(student.id, { paymentStatus: status });
      onUpdate?.();
    } catch (err) {
      console.error('Error updating payment status:', err);
    } finally {
      setUpdating(false);
    }
  };
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl border shadow-soft h-full overflow-y-auto">
      <div className="p-4 border-b bg-gradient-to-r from-accent/5 to-primary/5">
        <h2 className="font-semibold text-lg">Student Details</h2>
        <p className="text-sm text-muted-foreground">Course progress and information</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Course Progress */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{student.courseName}</span>
              <Badge variant="outline" className="bg-background/50">
                {student.progress}%
              </Badge>
            </div>
            <Progress value={student.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Day {student.currentDay}</span>
              <span>of {student.totalDays} days</span>
            </div>
          </CardContent>
        </Card>

        {/* Latest Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4" />
              Latest Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getScoreColor(student.latestScore)}>
                {student.latestScore}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on recent assignments
            </p>
          </CardContent>
        </Card>

        {/* Mentor Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Support Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge
              variant="outline"
              className={student.needsMentor
                ? 'bg-warning/10 text-warning border-warning/20'
                : 'bg-success/10 text-success border-success/20'
              }
            >
              {student.needsMentor ? 'Needs Mentor Support' : 'On Track'}
            </Badge>
            <p className="text-xs text-muted-foreground">
              {student.needsMentor
                ? 'Student may benefit from additional guidance'
                : 'Student is progressing well independently'
              }
            </p>
            <Button
              onClick={handleToggleMentor}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Toggle Mentor Status'}
            </Button>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Payment Status</span>
              <Badge
                variant="outline"
                className={getPaymentStatusColor(student.paymentStatus)}
              >
                {student.paymentStatus.charAt(0).toUpperCase() + student.paymentStatus.slice(1)}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Enrolled</span>
              <span>{new Date(student.enrollmentDate).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleUpdatePaymentStatus('paid')}
                variant={student.paymentStatus === 'paid' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                disabled={updating}
              >
                Paid
              </Button>
              <Button
                onClick={() => handleUpdatePaymentStatus('pending')}
                variant={student.paymentStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                disabled={updating}
              >
                Pending
              </Button>
              <Button
                onClick={() => handleUpdatePaymentStatus('overdue')}
                variant={student.paymentStatus === 'overdue' ? 'destructive' : 'outline'}
                size="sm"
                className="flex-1"
                disabled={updating}
              >
                Overdue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last seen</span>
              <span className="text-sm text-muted-foreground">{student.lastActivity}</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm">Unread messages</span>
              <Badge variant={student.unreadCount > 0 ? "destructive" : "secondary"}>
                {student.unreadCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};