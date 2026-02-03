import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { 
  CalendarIcon, 
  Save, 
  CheckCircle,
  UserCheck,
  UserX,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AttendancePage() {
  const { students } = useStudents();
  const { getAttendanceForDate, bulkMarkAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const existingAttendance = getAttendanceForDate(dateString);
  
  // Initialize attendance state from existing records
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>(() => {
    const initial: Record<string, 'present' | 'absent'> = {};
    existingAttendance.forEach((record) => {
      initial[record.studentId] = record.status;
    });
    return initial;
  });

  // Update attendance state when date changes
  useMemo(() => {
    const updated: Record<string, 'present' | 'absent'> = {};
    existingAttendance.forEach((record) => {
      updated[record.studentId] = record.status;
    });
    setAttendance(updated);
  }, [dateString]);

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, 'present' | 'absent'> = {};
    students.forEach((student) => {
      updated[student.id] = 'present';
    });
    setAttendance(updated);
  };

  const markAllAbsent = () => {
    const updated: Record<string, 'present' | 'absent'> = {};
    students.forEach((student) => {
      updated[student.id] = 'absent';
    });
    setAttendance(updated);
  };

  const saveAttendance = () => {
    const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
    }));
    
    if (attendanceData.length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    bulkMarkAttendance(attendanceData, dateString);
    toast.success(`Attendance saved for ${format(selectedDate, 'MMMM d, yyyy')}`, {
      icon: <CheckCircle className="h-4 w-4 text-success" />,
    });
  };

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground">Mark daily attendance for students</p>
          </div>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal min-w-[240px]",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <UserX className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance List */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Mark Attendance</CardTitle>
                <CardDescription>
                  Toggle switch to mark present/absent
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllPresent}>
                  All Present
                </Button>
                <Button variant="outline" size="sm" onClick={markAllAbsent}>
                  All Absent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No students enrolled</h3>
                <p className="text-sm text-muted-foreground">
                  Add students first to mark attendance
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student, index) => (
                  <div
                    key={student.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      attendance[student.id] === 'present' 
                        ? "border-success/30 bg-success/5" 
                        : attendance[student.id] === 'absent'
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-border hover:bg-muted/30"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                        attendance[student.id] === 'present' 
                          ? "bg-success/20 text-success" 
                          : attendance[student.id] === 'absent'
                          ? "bg-destructive/20 text-destructive"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.rollNo} • {student.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-sm font-medium",
                        attendance[student.id] === 'present' ? "text-success" : 
                        attendance[student.id] === 'absent' ? "text-destructive" : 
                        "text-muted-foreground"
                      )}>
                        {attendance[student.id] === 'present' ? 'Present' : 
                         attendance[student.id] === 'absent' ? 'Absent' : 
                         'Not marked'}
                      </span>
                      <Switch
                        checked={attendance[student.id] === 'present'}
                        onCheckedChange={() => toggleAttendance(student.id)}
                        className="data-[state=checked]:bg-success"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {students.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={saveAttendance} 
                  className="gradient-primary hover:opacity-90 gap-2"
                  disabled={Object.keys(attendance).length === 0}
                >
                  <Save className="h-4 w-4" />
                  Save Attendance
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
