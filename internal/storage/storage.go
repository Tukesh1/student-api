package storage

import (
	"github.com/tukesh1/student-api/internal/types"

)

// make interface
type Storage interface {
	CreateStudent(name string, email string, age int) (int64, error)
	GetStudentById(id int64) (types.Student, error)
	GetStudents()([]types.Student, error)
}
