package student

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tukesh1/student-api/internal/types"
)

// MockStorage implements the Storage interface for testing
type MockStorage struct {
	students map[int64]types.Student
	nextID   int64
}

func NewMockStorage() *MockStorage {
	return &MockStorage{
		students: make(map[int64]types.Student),
		nextID:   1,
	}
}

func (m *MockStorage) CreateStudent(name, email string, age int) (int64, error) {
	student := types.Student{
		Id:    m.nextID,
		Name:  name,
		Email: email,
		Age:   age,
	}
	m.students[m.nextID] = student
	m.nextID++
	return student.Id, nil
}

func (m *MockStorage) GetStudentById(id int64) (types.Student, error) {
	if student, exists := m.students[id]; exists {
		return student, nil
	}
	return types.Student{}, nil
}

func (m *MockStorage) GetStudents() ([]types.Student, error) {
	var result []types.Student
	for _, student := range m.students {
		result = append(result, student)
	}
	return result, nil
}

func (m *MockStorage) UpdateStudent(id int64, name, email string, age int) error {
	if _, exists := m.students[id]; exists {
		m.students[id] = types.Student{
			Id:    id,
			Name:  name,
			Email: email,
			Age:   age,
		}
	}
	return nil
}

func (m *MockStorage) DeleteStudent(id int64) error {
	delete(m.students, id)
	return nil
}

func TestCreateStudent(t *testing.T) {
	storage := NewMockStorage()
	handler := New(storage)

	student := types.Student{
		Name:  "John Doe",
		Email: "john@example.com",
		Age:   25,
	}

	jsonData, _ := json.Marshal(student)
	req := httptest.NewRequest("POST", "/api/students", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusCreated {
		t.Errorf("Expected status code %d, got %d", http.StatusCreated, rr.Code)
	}

	var response map[string]int64
	json.Unmarshal(rr.Body.Bytes(), &response)

	if response["id"] != 1 {
		t.Errorf("Expected student ID 1, got %d", response["id"])
	}
}

func TestGetStudents(t *testing.T) {
	storage := NewMockStorage()
	storage.CreateStudent("John Doe", "john@example.com", 25)
	storage.CreateStudent("Jane Smith", "jane@example.com", 22)

	handler := GetList(storage)
	req := httptest.NewRequest("GET", "/api/students", nil)
	rr := httptest.NewRecorder()

	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, rr.Code)
	}

	var students []types.Student
	json.Unmarshal(rr.Body.Bytes(), &students)

	if len(students) != 2 {
		t.Errorf("Expected 2 students, got %d", len(students))
	}
}

func TestCreateStudentInvalidData(t *testing.T) {
	storage := NewMockStorage()
	handler := New(storage)

	// Test with invalid JSON
	req := httptest.NewRequest("POST", "/api/students", bytes.NewBuffer([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, rr.Code)
	}
}

func TestCreateStudentEmptyBody(t *testing.T) {
	storage := NewMockStorage()
	handler := New(storage)

	req := httptest.NewRequest("POST", "/api/students", bytes.NewBuffer([]byte("")))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, rr.Code)
	}
}
