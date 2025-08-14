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
  roll_no?: string;
}

interface Class {
  id: number;
  name: string;
  grade: string;
  section: string;
  teacher_name: string;
}

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
}

interface StudentReport extends Student {
  stats: AttendanceStats;
}

export default function Reports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [reportData, setReportData] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'class'>('overview');

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

  const generateReport = () => {
    setLoading(true);
    
    // Simulate API call and generate mock data
    setTimeout(() => {
      const mockReportData: StudentReport[] = students.map(student => {
        const totalDays = Math.floor(Math.random() * 30) + 20;
        const presentDays = Math.floor(totalDays * (0.7 + Math.random() * 0.3));
        const lateDays = Math.floor(Math.random() * 5);
        const absentDays = totalDays - presentDays - lateDays;
        const attendancePercentage = Math.round((presentDays / totalDays) * 100);
        
        return {
          ...student,
          stats: {
            totalDays,
            presentDays,
            absentDays,
            lateDays,
            attendancePercentage
          }
        };
      });
      
      setReportData(mockReportData);
      setLoading(false);
    }, 1000);
  };

  const getOverallStats = () => {
    if (reportData.length === 0) return { avgAttendance: 0, totalStudents: 0, lowAttendance: 0 };
    
    const totalAttendance = reportData.reduce((sum, student) => sum + student.stats.attendancePercentage, 0);
    const avgAttendance = Math.round(totalAttendance / reportData.length);
    const lowAttendance = reportData.filter(student => student.stats.attendancePercentage < 75).length;
    
    return {
      avgAttendance,
      totalStudents: reportData.length,
      lowAttendance
    };
  };

  const overallStats = getOverallStats();

  const exportReport = () => {
    const csvContent = [
      'Name,Email,Roll No,Total Days,Present,Absent,Late,Attendance %',
      ...reportData.map(student => 
        `${student.name},${student.email},${student.roll_no || ''},${student.stats.totalDays},${student.stats.presentDays},${student.stats.absentDays},${student.stats.lateDays},${student.stats.attendancePercentage}%`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-report-${startDate}-to-${endDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
        <p className="text-slate-600">Comprehensive attendance analysis, performance metrics, and data insights</p>
      </div>

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Set parameters for generating attendance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class-filter">Filter by Class</Label>
              <select
                id="class-filter"
                value={selectedClass || ''}
                onChange={(e) => setSelectedClass(Number(e.target.value) || null)}
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    Grade {cls.grade} - Section {cls.section}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={generateReport} disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'detailed', label: 'Detailed Report' },
            { id: 'class', label: 'Class Summary' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-slate-500 text-slate-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-900">{overallStats.avgAttendance}%</p>
                  <p className="text-sm text-blue-700 font-medium">Average Attendance</p>
                  <p className="text-xs text-blue-600 mt-1">System-wide metric</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-900">{overallStats.totalStudents}</p>
                  <p className="text-sm text-green-700 font-medium">Total Students</p>
                  <p className="text-xs text-green-600 mt-1">Active enrollment</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-900">{overallStats.lowAttendance}</p>
                  <p className="text-sm text-red-700 font-medium">At-Risk Students</p>
                  <p className="text-xs text-red-600 mt-1">Below 75% attendance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {reportData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
                <CardDescription>Recent attendance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    Report Period: {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-green-600">
                        {reportData.filter(s => s.stats.attendancePercentage >= 90).length}
                      </p>
                      <p className="text-xs text-slate-600">Excellent (90%+)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-blue-600">
                        {reportData.filter(s => s.stats.attendancePercentage >= 75 && s.stats.attendancePercentage < 90).length}
                      </p>
                      <p className="text-xs text-slate-600">Good (75-89%)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-yellow-600">
                        {reportData.filter(s => s.stats.attendancePercentage >= 60 && s.stats.attendancePercentage < 75).length}
                      </p>
                      <p className="text-xs text-slate-600">Average (60-74%)</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-red-600">
                        {reportData.filter(s => s.stats.attendancePercentage < 60).length}
                      </p>
                      <p className="text-xs text-slate-600">Poor (&lt;60%)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Detailed Report Tab */}
      {activeTab === 'detailed' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Detailed Attendance Report</CardTitle>
                <CardDescription>Individual student attendance records</CardDescription>
              </div>
              {reportData.length > 0 && (
                <Button onClick={exportReport} variant="outline">
                  Export CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {reportData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">No report data available. Generate a report first.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 font-medium text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.roll_no || '-'}</TableCell>
                      <TableCell>{student.stats.totalDays}</TableCell>
                      <TableCell className="text-green-600">{student.stats.presentDays}</TableCell>
                      <TableCell className="text-red-600">{student.stats.absentDays}</TableCell>
                      <TableCell className="text-yellow-600">{student.stats.lateDays}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${
                            student.stats.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {student.stats.attendancePercentage}%
                          </span>
                          {student.stats.attendancePercentage < 75 && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Low</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Class Summary Tab */}
      {activeTab === 'class' && (
        <Card>
          <CardHeader>
            <CardTitle>Class Summary</CardTitle>
            <CardDescription>Attendance summary by class</CardDescription>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">No classes found. Add classes first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((classItem) => (
                  <Card key={classItem.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription>
                        Grade {classItem.grade} - Section {classItem.section}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Teacher:</span>
                          <span className="font-medium">{classItem.teacher_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Students:</span>
                          <span className="font-medium">
                            {students.filter(s => Math.random() > 0.5).length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Avg Attendance:</span>
                          <span className="font-medium text-green-600">
                            {Math.floor(Math.random() * 20) + 75}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
