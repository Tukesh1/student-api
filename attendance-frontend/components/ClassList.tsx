import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Class {
  id: number;
  name: string;
  grade: string;
  section: string;
  teacher_name: string;
}

export default function ClassList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: '',
    teacher_name: ''
  });

  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingClass 
        ? `http://localhost:8082/api/classes/${editingClass.id}`
        : 'http://localhost:8082/api/classes';
      
      const method = editingClass ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchClasses();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const response = await fetch(`http://localhost:8082/api/classes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClasses();
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      grade: classItem.grade,
      section: classItem.section,
      teacher_name: classItem.teacher_name
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', grade: '', section: '', teacher_name: '' });
    setEditingClass(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-sm text-slate-600">Loading classes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Class Management</h2>
          <p className="text-slate-600">Organize academic classes, assign teachers, and manage schedules</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Class'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</CardTitle>
            <CardDescription>
              {editingClass ? 'Update class information' : 'Enter the details of the new class'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics Advanced"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  required
                >
                  <option value="">Select Grade</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <select
                  id="section"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  required
                >
                  <option value="">Select Section</option>
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher_name">Teacher Name</Label>
                <Input
                  id="teacher_name"
                  value={formData.teacher_name}
                  onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                  placeholder="Teacher's full name"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">
                  {editingClass ? 'Update Class' : 'Add Class'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-slate-500">No classes found. Add your first class!</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          classes.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-slate-600 font-bold text-sm">
                        {classItem.grade}
                      </span>
                    </div>
                    <div>
                      <div className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
                        Section {classItem.section}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <CardDescription className="mt-1">
                    Teacher: {classItem.teacher_name}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Grade {classItem.grade} • Section {classItem.section}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(classItem)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(classItem.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
