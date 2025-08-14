import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Student {
  id: number;
  name: string;
  email: string;
  roll_no?: string;
}

interface Class {
  id: number;
  name: string;
  grade: string;
  section: string;
}

interface AttendanceRecord {
  student_id: number;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export default function AttendanceTracker() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useState<Record<number, AttendanceRecord>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes] = await Promise.all([
          fetch('http://localhost:8082/api/students'),
          fetch('http://localhost:8082/api/classes')
        ]);

        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData || []);
        }

        if (classesRes.ok) {
          const classesData = await classesRes.json();
          setClasses(classesData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      const initialAttendance: Record<number, AttendanceRecord> = {};
      students.forEach(student => {
        initialAttendance[student.id] = {
          student_id: student.id,
          status: 'Present',
          remarks: ''
        };
      });
      setAttendance(initialAttendance);
    }
  }, [students]);

  const updateAttendanceStatus = (studentId: number, status: AttendanceRecord['status']) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const updateRemarks = (studentId: number, remarks: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const saveAttendance = async () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    setSaving(true);
    
    try {
      // In a real application, this would save to the backend
      const attendanceData = Object.values(attendance).map(record => ({
        ...record,
        class_id: selectedClass,
        date: selectedDate
      }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Attendance saved for ${selectedDate}!`);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error saving attendance');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceSummary = () => {
    const total = students.length;
    const present = Object.values(attendance).filter(record => record.status === 'Present').length;
    const absent = Object.values(attendance).filter(record => record.status === 'Absent').length;
    const late = Object.values(attendance).filter(record => record.status === 'Late').length;
    
    return { total, present, absent, late };
  };

  const summary = getAttendanceSummary();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
        <p className="text-slate-600">Track daily attendance, monitor patterns, and generate insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Settings</CardTitle>
          <CardDescription>Select class and date for attendance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class-select">Select Class</Label>
              <select
                id="class-select"
                value={selectedClass || ''}
                onChange={(e) => setSelectedClass(Number(e.target.value) || null)}
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    Grade {cls.grade} - Section {cls.section} ({cls.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-select">Date</Label>
              <Input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={saveAttendance}
                disabled={saving || !selectedClass}
                className="w-full"
              >
                {saving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{summary.total}</p>
              <p className="text-sm text-slate-600">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.present}</p>
              <p className="text-sm text-slate-600">Present</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
              <p className="text-sm text-slate-600">Absent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{summary.late}</p>
              <p className="text-sm text-slate-600">Late</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            {selectedClass 
              ? `Taking attendance for ${classes.find(c => c.id === selectedClass)?.name}`
              : 'Select a class to begin taking attendance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No students found. Add students first.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 rounded-lg space-y-3 sm:space-y-0 sm:space-x-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-slate-600 font-medium text-sm">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{student.name}</p>
                      <p className="text-sm text-slate-500">
                        {student.roll_no ? `Roll: ${student.roll_no}` : student.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="flex gap-2">
                      {(['Present', 'Absent', 'Late'] as const).map((status) => (
                        <Button
                          key={status}
                          variant={attendance[student.id]?.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateAttendanceStatus(student.id, status)}
                          className={
                            attendance[student.id]?.status === status
                              ? status === 'Present'
                                ? 'bg-green-600 hover:bg-green-700'
                                : status === 'Absent'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-yellow-600 hover:bg-yellow-700'
                              : ''
                          }
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                    <Input
                      placeholder="Remarks (optional)"
                      value={attendance[student.id]?.remarks || ''}
                      onChange={(e) => updateRemarks(student.id, e.target.value)}
                      className="w-full sm:w-32"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {students.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              students.forEach(student => {
                updateAttendanceStatus(student.id, 'Present');
              });
            }}
          >
            Mark All Present
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              students.forEach(student => {
                updateAttendanceStatus(student.id, 'Absent');
              });
            }}
          >
            Mark All Absent
          </Button>
        </div>
      )}
    </div>
  );
}
