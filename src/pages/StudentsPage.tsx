import { useState, FormEvent } from 'react';
import { Layout } from '@/components/Layout';
import { useStudents } from '@/hooks/useStudents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  UserPlus, 
  Trash2, 
  Users, 
  Search,
  AlertCircle,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentsPage() {
  const { students, addStudent, deleteStudent } = useStudents();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [formError, setFormError] = useState('');

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const result = addStudent(name, rollNo, department);
    
    if (result.success) {
      toast.success('Student added successfully!', {
        icon: <CheckCircle className="h-4 w-4 text-success" />,
      });
      setName('');
      setRollNo('');
      setDepartment('');
      setIsAddOpen(false);
    } else {
      setFormError(result.error || 'Failed to add student');
    }
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    setDeleteConfirmId(null);
    toast.success('Student removed successfully');
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground">Manage your student list</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary hover:opacity-90 gap-2">
                <UserPlus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's information below
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4">
                {formError && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter student name"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll Number</Label>
                  <Input
                    id="rollNo"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g., CS2024001"
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Computer Science"
                    maxLength={50}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-primary hover:opacity-90">
                    Add Student
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll number, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                maxLength={100}
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Student List
                </CardTitle>
                <CardDescription>
                  {students.length} student{students.length !== 1 ? 's' : ''} enrolled
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">No students yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first student to get started
                </p>
                <Button onClick={() => setIsAddOpen(true)} className="gradient-primary hover:opacity-90 gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </Button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Roll No</TableHead>
                      <TableHead className="font-semibold hidden sm:table-cell">Department</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="font-mono text-sm">{student.rollNo}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {student.department}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog 
                            open={deleteConfirmId === student.id} 
                            onOpenChange={(open) => !open && setDeleteConfirmId(null)}
                          >
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteConfirmId(student.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Delete Student</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to remove <strong>{student.name}</strong>? 
                                  This action cannot be undone and will also delete their attendance records.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDelete(student.id)}
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
