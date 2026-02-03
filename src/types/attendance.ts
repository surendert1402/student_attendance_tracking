export interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  createdAt: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface User {
  username: string;
  role: 'teacher' | 'admin';
}

export interface AttendanceStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
}

export interface StudentAttendanceSummary {
  student: Student;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
}
