package storage

import (
	"time"

	"github.com/tukesh1/student-api/internal/types"
)

// make interface
type Storage interface {
	// Student methods
	CreateStudent(name string, email string, age int) (int64, error)
	GetStudentById(id int64) (types.Student, error)
	GetStudents() ([]types.Student, error)
	UpdateStudent(id int64, name string, email string, age int) error
	DeleteStudent(id int64) error

	// Class methods
	CreateClass(name, grade, section, teacherName string) (int64, error)
	GetClassById(id int64) (types.Class, error)
	GetClasses() ([]types.Class, error)
	UpdateClass(id int64, name, grade, section, teacherName string) error
	DeleteClass(id int64) error

	// Attendance methods
	CreateAttendanceRecord(studentID, classID int64, date time.Time, status, remarks string) (int64, error)
	GetAttendanceByDate(classID int64, date time.Time) ([]types.AttendanceRecord, error)
	GetAttendanceByStudent(studentID int64, startDate, endDate time.Time) ([]types.AttendanceRecord, error)
	UpdateAttendanceRecord(id int64, status, remarks string) error
	DeleteAttendanceRecord(id int64) error
	GetAttendanceReport(studentID int64, startDate, endDate time.Time) (types.AttendanceReport, error)
}
