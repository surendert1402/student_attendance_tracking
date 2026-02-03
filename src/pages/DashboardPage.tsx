import { useAuthContext } from '@/contexts/AuthContext';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, CalendarDays, TrendingUp, Clock } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuthContext();
  const { students } = useStudents();
  const { getTodayStats, getStudentSummaries } = useAttendance();
  
  const stats = getTodayStats(students);
  const summaries = getStudentSummaries(students);
  const avgAttendance = summaries.length > 0 
    ? Math.round(summaries.reduce((acc, s) => acc + s.percentage, 0) / summaries.length)
    : 0;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="rounded-2xl gradient-hero p-6 sm:p-8 text-primary-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {greeting()}, {user?.username}! 👋
              </h1>
              <p className="mt-1 text-primary-foreground/80">
                Welcome to your attendance dashboard
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <CalendarDays className="h-5 w-5" />
              <span className="text-sm">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Present Today
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.presentToday}</div>
              <p className="text-xs text-muted-foreground mt-1">Marked present</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Absent Today
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <UserX className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.absentToday}</div>
              <p className="text-xs text-muted-foreground mt-1">Marked absent</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Attendance
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{avgAttendance}%</div>
              <p className="text-xs text-muted-foreground mt-1">Overall rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <a 
                href="/attendance" 
                className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-accent transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CalendarDays className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Mark Attendance</h3>
                  <p className="text-sm text-muted-foreground">Record today's attendance</p>
                </div>
              </a>
              <a 
                href="/students" 
                className="flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-accent transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl gradient-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Manage Students</h3>
                  <p className="text-sm text-muted-foreground">Add or view students</p>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
              <CardDescription>Current system information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Data Storage</span>
                </div>
                <span className="text-sm font-medium text-success">Local Storage Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">User Role</span>
                </div>
                <span className="text-sm font-medium capitalize">{user?.role}</span>
              </div>
              {students.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-primary/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No students added yet.{' '}
                    <a href="/students" className="text-primary font-medium hover:underline">
                      Add your first student
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
