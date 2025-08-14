import { useState } from 'react';
import Layout from '../components/Layout';
import StudentList from '../components/StudentList';
import ClassList from '../components/ClassList';
import AttendanceTracker from '../components/AttendanceTracker';
import Reports from '../components/Reports';
import { Button } from '../components/ui/button';

type Tab = 'students' | 'classes' | 'attendance' | 'reports';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('students');

  const tabs = [
    { id: 'students' as Tab, label: 'Students', description: 'Manage student records' },
    { id: 'classes' as Tab, label: 'Classes', description: 'Organize classes' },
    { id: 'attendance' as Tab, label: 'Attendance', description: 'Track daily attendance' },
    { id: 'reports' as Tab, label: 'Reports', description: 'View analytics' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            School Management Platform
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive attendance tracking, student record management, and data analytics 
            for educational institutions. Streamline administrative processes with modern technology.
          </p>
        </div>

        {/* Navigation */}
        <div className="border-b border-slate-200 mb-12">
          <div className="flex justify-center">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className={`px-6 py-3 rounded-none border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-slate-900 bg-transparent text-slate-900 hover:bg-slate-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-75 mt-1">{tab.description}</div>
                  </div>
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'students' && <StudentList />}
          {activeTab === 'classes' && <ClassList />}
          {activeTab === 'attendance' && <AttendanceTracker />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </div>
    </Layout>
  );
}
