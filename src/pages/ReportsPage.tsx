import { Layout } from '@/components/Layout';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Award,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ReportsPage() {
  const { students } = useStudents();
  const { getStudentSummaries } = useAttendance();
  
  const summaries = getStudentSummaries(students);
  const avgAttendance = summaries.length > 0 
    ? Math.round(summaries.reduce((acc, s) => acc + s.percentage, 0) / summaries.length)
    : 0;

  const sortedSummaries = [...summaries].sort((a, b) => b.percentage - a.percentage);
  const topPerformers = sortedSummaries.filter((s) => s.percentage >= 80 && s.totalDays > 0);
  const needsAttention = sortedSummaries.filter((s) => s.percentage < 75 && s.totalDays > 0);

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Reports</h1>
          <p className="text-muted-foreground">View detailed attendance statistics</p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{students.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Attendance</p>
                  <p className={cn("text-3xl font-bold", getPercentageColor(avgAttendance))}>
                    {avgAttendance}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Performers</p>
                  <p className="text-3xl font-bold text-success">{topPerformers.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                  <p className="text-3xl font-bold text-destructive">{needsAttention.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Report Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Student Attendance Summary
            </CardTitle>
            <CardDescription>
              Individual attendance records with percentage calculation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No data available</h3>
                <p className="text-sm text-muted-foreground">
                  Add students and mark attendance to see reports
                </p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Student</TableHead>
                      <TableHead className="font-semibold hidden sm:table-cell">Roll No</TableHead>
                      <TableHead className="font-semibold text-center">Present</TableHead>
                      <TableHead className="font-semibold text-center">Absent</TableHead>
                      <TableHead className="font-semibold text-center">Total</TableHead>
                      <TableHead className="font-semibold">Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSummaries.map((summary) => (
                      <TableRow key={summary.student.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                              summary.percentage >= 80 ? "bg-success/20 text-success" :
                              summary.percentage >= 60 ? "bg-warning/20 text-warning" :
                              summary.totalDays === 0 ? "bg-muted text-muted-foreground" :
                              "bg-destructive/20 text-destructive"
                            )}>
                              {summary.student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{summary.student.name}</p>
                              <p className="text-xs text-muted-foreground sm:hidden">
                                {summary.student.rollNo}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-sm text-muted-foreground">
                          {summary.student.rollNo}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 text-success">
                            <TrendingUp className="h-3 w-3" />
                            {summary.presentDays}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 text-destructive">
                            <TrendingDown className="h-3 w-3" />
                            {summary.absentDays}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {summary.totalDays}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[120px]">
                            <div className="flex-1">
                              <Progress 
                                value={summary.percentage} 
                                className="h-2"
                                style={{
                                  ['--progress-background' as string]: summary.percentage >= 80 
                                    ? 'hsl(var(--success))' 
                                    : summary.percentage >= 60 
                                    ? 'hsl(var(--warning))' 
                                    : 'hsl(var(--destructive))'
                                }}
                              />
                            </div>
                            <span className={cn(
                              "text-sm font-bold min-w-[40px] text-right",
                              getPercentageColor(summary.percentage)
                            )}>
                              {summary.percentage}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {students.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Performers */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-success" />
                  Top Performers
                </CardTitle>
                <CardDescription>Students with 80%+ attendance</CardDescription>
              </CardHeader>
              <CardContent>
                {topPerformers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No students have achieved 80%+ attendance yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {topPerformers.slice(0, 5).map((summary, index) => (
                      <div 
                        key={summary.student.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-success">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{summary.student.name}</p>
                            <p className="text-xs text-muted-foreground">{summary.student.rollNo}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-success">{summary.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Needs Attention */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Needs Attention
                </CardTitle>
                <CardDescription>Students with less than 75% attendance</CardDescription>
              </CardHeader>
              <CardContent>
                {needsAttention.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All students are maintaining good attendance! 🎉
                  </p>
                ) : (
                  <div className="space-y-3">
                    {needsAttention.slice(0, 5).map((summary) => (
                      <div 
                        key={summary.student.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                      >
                        <div>
                          <p className="font-medium">{summary.student.name}</p>
                          <p className="text-xs text-muted-foreground">{summary.student.rollNo}</p>
                        </div>
                        <span className="text-lg font-bold text-destructive">{summary.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
