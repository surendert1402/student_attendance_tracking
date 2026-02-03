import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/attendance';

const DUMMY_CREDENTIALS = [
  { username: 'admin', password: 'admin123', role: 'admin' as const },
  { username: 'teacher', password: 'teacher123', role: 'teacher' as const },
];

const AUTH_KEY = 'attendance_auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      return { success: false, error: 'Username is required' };
    }
    if (!trimmedPassword) {
      return { success: false, error: 'Password is required' };
    }

    const found = DUMMY_CREDENTIALS.find(
      (cred) => cred.username === trimmedUsername && cred.password === trimmedPassword
    );

    if (found) {
      const userData: User = { username: found.username, role: found.role };
      setUser(userData);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Invalid username or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return { user, isLoading, login, logout, isAuthenticated: !!user };
}
