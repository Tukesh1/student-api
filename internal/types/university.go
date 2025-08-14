package types

import "time"

// Student represents a student in the university system
type Student struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name" validate:"required"`
	Email       string    `json:"email" validate:"required,email"`
	Age         int       `json:"age" validate:"required,min=16,max=100"`
	StudentID   string    `json:"student_id" validate:"required"`
	Major       string    `json:"major" validate:"required"`
	Year        int       `json:"year" validate:"required,min=1,max=4"`
	GPA         float64   `json:"gpa" validate:"min=0,max=4"`
	Status      string    `json:"status" validate:"required,oneof=active inactive graduated"`
	EnrollDate  time.Time `json:"enroll_date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Professor represents a professor in the university system
type Professor struct {
	Id           int64     `json:"id"`
	Name         string    `json:"name" validate:"required"`
	Email        string    `json:"email" validate:"required,email"`
	Department   string    `json:"department" validate:"required"`
	Title        string    `json:"title" validate:"required"`
	OfficeNumber string    `json:"office_number"`
	Phone        string    `json:"phone"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Course represents a course in the university system
type Course struct {
	Id           int64     `json:"id"`
	CourseCode   string    `json:"course_code" validate:"required"`
	Title        string    `json:"title" validate:"required"`
	Description  string    `json:"description"`
	Credits      int       `json:"credits" validate:"required,min=1,max=6"`
	Department   string    `json:"department" validate:"required"`
	ProfessorID  int64     `json:"professor_id"`
	Capacity     int       `json:"capacity" validate:"required,min=1"`
	Enrolled     int       `json:"enrolled"`
	Schedule     string    `json:"schedule"`
	Room         string    `json:"room"`
	Semester     string    `json:"semester" validate:"required"`
	Year         int       `json:"year" validate:"required"`
	Status       string    `json:"status" validate:"required,oneof=active inactive completed"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Enrollment represents a student's enrollment in a course
type Enrollment struct {
	Id         int64     `json:"id"`
	StudentID  int64     `json:"student_id" validate:"required"`
	CourseID   int64     `json:"course_id" validate:"required"`
	Grade      string    `json:"grade"`
	Status     string    `json:"status" validate:"required,oneof=enrolled dropped completed"`
	EnrollDate time.Time `json:"enroll_date"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// Department represents a university department
type Department struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name" validate:"required"`
	Code        string    `json:"code" validate:"required"`
	HeadID      int64     `json:"head_id"`
	Budget      float64   `json:"budget"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Assignment represents an assignment for a course
type Assignment struct {
	Id          int64     `json:"id"`
	CourseID    int64     `json:"course_id" validate:"required"`
	Title       string    `json:"title" validate:"required"`
	Description string    `json:"description"`
	DueDate     time.Time `json:"due_date" validate:"required"`
	MaxPoints   int       `json:"max_points" validate:"required,min=1"`
	Status      string    `json:"status" validate:"required,oneof=active inactive completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Grade represents a student's grade for an assignment
type Grade struct {
	Id           int64     `json:"id"`
	StudentID    int64     `json:"student_id" validate:"required"`
	AssignmentID int64     `json:"assignment_id" validate:"required"`
	Points       int       `json:"points" validate:"min=0"`
	Feedback     string    `json:"feedback"`
	SubmittedAt  time.Time `json:"submitted_at"`
	GradedAt     time.Time `json:"graded_at"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
