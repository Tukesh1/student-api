package storage
// make interface 
type Storage interface {
  CreateStudent(name string, email string, age int) (int64, error)
}