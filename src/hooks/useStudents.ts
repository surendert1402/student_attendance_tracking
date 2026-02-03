import { useState, useEffect, useCallback } from 'react';
import { Student } from '@/types/attendance';

const STUDENTS_KEY = 'attendance_students';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STUDENTS_KEY);
    if (stored) {
      try {
        setStudents(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STUDENTS_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const saveStudents = useCallback((newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(newStudents));
  }, []);

  const addStudent = useCallback((name: string, rollNo: string, department: string): { success: boolean; error?: string } => {
    const trimmedName = name.trim();
    const trimmedRollNo = rollNo.trim();
    const trimmedDept = department.trim();

    if (!trimmedName) return { success: false, error: 'Name is required' };
    if (trimmedName.length < 2) return { success: false, error: 'Name must be at least 2 characters' };
    if (trimmedName.length > 100) return { success: false, error: 'Name must be less than 100 characters' };
    if (!trimmedRollNo) return { success: false, error: 'Roll number is required' };
    if (trimmedRollNo.length > 20) return { success: false, error: 'Roll number must be less than 20 characters' };
    if (!trimmedDept) return { success: false, error: 'Department is required' };
    if (trimmedDept.length > 50) return { success: false, error: 'Department must be less than 50 characters' };

    const existingRollNo = students.find((s) => s.rollNo.toLowerCase() === trimmedRollNo.toLowerCase());
    if (existingRollNo) {
      return { success: false, error: 'A student with this roll number already exists' };
    }

    const newStudent: Student = {
      id: generateId(),
      name: trimmedName,
      rollNo: trimmedRollNo,
      department: trimmedDept,
      createdAt: new Date().toISOString(),
    };

    saveStudents([...students, newStudent]);
    return { success: true };
  }, [students, saveStudents]);

  const deleteStudent = useCallback((id: string) => {
    saveStudents(students.filter((s) => s.id !== id));
  }, [students, saveStudents]);

  return { students, isLoading, addStudent, deleteStudent };
}
