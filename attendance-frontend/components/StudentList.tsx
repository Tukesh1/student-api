import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  class_id?: number;
  roll_no?: string;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    roll_no: ''
  });

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const studentData = {
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      roll_no: formData.roll_no
    };

    try {
      const url = editingStudent 
        ? `http://localhost:8082/api/students/${editingStudent.id}`
        : 'http://localhost:8082/api/students';
      
      const method = editingStudent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        fetchStudents();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`http://localhost:8082/api/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      age: student.age.toString(),
      roll_no: student.roll_no || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', age: '', roll_no: '' });
    setEditingStudent(null);
    setShowForm(false);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-sm text-slate-600">Loading students...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
          <p className="text-slate-600">Manage student profiles, enrollment, and academic records</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Student'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</CardTitle>
            <CardDescription>
              {editingStudent ? 'Update student information' : 'Enter the details of the new student'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="5"
                  max="25"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roll_no">Roll Number (Optional)</Label>
                <Input
                  id="roll_no"
                  value={formData.roll_no}
                  onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Students ({filteredStudents.length})</CardTitle>
              <CardDescription>Manage and view student records</CardDescription>
            </div>
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">
                {students.length === 0 ? 'No students found. Add your first student!' : 'No students match your search.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                          <span className="text-slate-600 font-medium text-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.age} years</TableCell>
                    <TableCell>{student.roll_no || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
