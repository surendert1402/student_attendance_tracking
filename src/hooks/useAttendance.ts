import { useState, useEffect, useCallback } from 'react';
import { AttendanceRecord, Student, StudentAttendanceSummary } from '@/types/attendance';

const ATTENDANCE_KEY = 'attendance_records';

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(ATTENDANCE_KEY);
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch {
        localStorage.removeItem(ATTENDANCE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const saveRecords = useCallback((newRecords: AttendanceRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(newRecords));
  }, []);

  const markAttendance = useCallback((studentId: string, date: string, status: 'present' | 'absent') => {
    const existingIndex = records.findIndex(
      (r) => r.studentId === studentId && r.date === date
    );

    let newRecords: AttendanceRecord[];
    if (existingIndex >= 0) {
      newRecords = [...records];
      newRecords[existingIndex] = { studentId, date, status };
    } else {
      newRecords = [...records, { studentId, date, status }];
    }

    saveRecords(newRecords);
  }, [records, saveRecords]);

  const bulkMarkAttendance = useCallback((attendanceData: { studentId: string; status: 'present' | 'absent' }[], date: string) => {
    let newRecords = [...records];
    
    attendanceData.forEach(({ studentId, status }) => {
      const existingIndex = newRecords.findIndex(
        (r) => r.studentId === studentId && r.date === date
      );

      if (existingIndex >= 0) {
        newRecords[existingIndex] = { studentId, date, status };
      } else {
        newRecords.push({ studentId, date, status });
      }
    });

    saveRecords(newRecords);
  }, [records, saveRecords]);

  const getAttendanceForDate = useCallback((date: string) => {
    return records.filter((r) => r.date === date);
  }, [records]);

  const getStudentAttendance = useCallback((studentId: string) => {
    return records.filter((r) => r.studentId === studentId);
  }, [records]);

  const getTodayStats = useCallback((students: Student[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = getAttendanceForDate(today);
    
    return {
      totalStudents: students.length,
      presentToday: todayRecords.filter((r) => r.status === 'present').length,
      absentToday: todayRecords.filter((r) => r.status === 'absent').length,
    };
  }, [getAttendanceForDate]);

  const getStudentSummaries = useCallback((students: Student[]): StudentAttendanceSummary[] => {
    return students.map((student) => {
      const studentRecords = getStudentAttendance(student.id);
      const presentDays = studentRecords.filter((r) => r.status === 'present').length;
      const absentDays = studentRecords.filter((r) => r.status === 'absent').length;
      const totalDays = presentDays + absentDays;
      const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      return {
        student,
        totalDays,
        presentDays,
        absentDays,
        percentage,
      };
    });
  }, [getStudentAttendance]);

  return {
    records,
    isLoading,
    markAttendance,
    bulkMarkAttendance,
    getAttendanceForDate,
    getStudentAttendance,
    getTodayStats,
    getStudentSummaries,
  };
}
