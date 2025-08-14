package types

import "time"

//struct of student making
type Student struct {
	Id      int64  `json:"id"`
	Name    string `json:"name" validate:"required"`
	Email   string `json:"email" validate:"required"`
	Age     int    `json:"age" validate:"required"`
	ClassID int64  `json:"class_id"`
	RollNo  string `json:"roll_no"`
}

type Class struct {
	Id          int64  `json:"id"`
	Name        string `json:"name" validate:"required"`
	Grade       string `json:"grade" validate:"required"`
	Section     string `json:"section" validate:"required"`
	TeacherName string `json:"teacher_name" validate:"required"`
}

type AttendanceRecord struct {
	Id        int64     `json:"id"`
	StudentID int64     `json:"student_id" validate:"required"`
	ClassID   int64     `json:"class_id" validate:"required"`
	Date      time.Time `json:"date" validate:"required"`
	Status    string    `json:"status" validate:"required"` // Present, Absent, Late
	Remarks   string    `json:"remarks"`
}

type AttendanceReport struct {
	StudentID      int64   `json:"student_id"`
	StudentName    string  `json:"student_name"`
	ClassName      string  `json:"class_name"`
	TotalDays      int     `json:"total_days"`
	PresentDays    int     `json:"present_days"`
	AbsentDays     int     `json:"absent_days"`
	LateDays       int     `json:"late_days"`
	AttendanceRate float64 `json:"attendance_rate"`
}
