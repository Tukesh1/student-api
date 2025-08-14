package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type Student struct {
	Name   string `json:"name"`
	Email  string `json:"email"`
	Age    int    `json:"age"`
	RollNo string `json:"roll_no"`
}

type Class struct {
	Name        string `json:"name"`
	Grade       string `json:"grade"`
	Section     string `json:"section"`
	TeacherName string `json:"teacher_name"`
}

func main() {
	baseURL := "http://localhost:8082"

	// Wait for server to be ready
	fmt.Println("Waiting for server to be ready...")
	time.Sleep(2 * time.Second)

	// Create classes
	classes := []Class{
		{
			Name:        "Mathematics Advanced",
			Grade:       "10",
			Section:     "A",
			TeacherName: "Dr. Sarah Johnson",
		},
		{
			Name:        "Computer Science Fundamentals",
			Grade:       "11",
			Section:     "B",
			TeacherName: "Prof. Michael Chen",
		},
		{
			Name:        "Physics Laboratory",
			Grade:       "12",
			Section:     "C",
			TeacherName: "Dr. Emily Rodriguez",
		},
	}

	fmt.Println("Creating classes...")
	for i, class := range classes {
		if err := createClass(baseURL, class); err != nil {
			log.Printf("Error creating class %d: %v", i+1, err)
		} else {
			fmt.Printf("✅ Created class: %s\n", class.Name)
		}
	}

	// Create 30 students (10 per class)
	students := []Student{
		// Grade 10A Students
		{Name: "Alexander Thompson", Email: "alex.thompson@school.edu", Age: 15, RollNo: "10A001"},
		{Name: "Emma Wilson", Email: "emma.wilson@school.edu", Age: 16, RollNo: "10A002"},
		{Name: "Benjamin Davis", Email: "ben.davis@school.edu", Age: 15, RollNo: "10A003"},
		{Name: "Sophia Martinez", Email: "sophia.martinez@school.edu", Age: 16, RollNo: "10A004"},
		{Name: "Lucas Anderson", Email: "lucas.anderson@school.edu", Age: 15, RollNo: "10A005"},
		{Name: "Isabella Garcia", Email: "isabella.garcia@school.edu", Age: 16, RollNo: "10A006"},
		{Name: "Oliver Brown", Email: "oliver.brown@school.edu", Age: 15, RollNo: "10A007"},
		{Name: "Charlotte Miller", Email: "charlotte.miller@school.edu", Age: 16, RollNo: "10A008"},
		{Name: "William Jones", Email: "william.jones@school.edu", Age: 15, RollNo: "10A009"},
		{Name: "Amelia Taylor", Email: "amelia.taylor@school.edu", Age: 16, RollNo: "10A010"},

		// Grade 11B Students
		{Name: "James Rodriguez", Email: "james.rodriguez@school.edu", Age: 16, RollNo: "11B001"},
		{Name: "Ava White", Email: "ava.white@school.edu", Age: 17, RollNo: "11B002"},
		{Name: "Ethan Lewis", Email: "ethan.lewis@school.edu", Age: 16, RollNo: "11B003"},
		{Name: "Mia Walker", Email: "mia.walker@school.edu", Age: 17, RollNo: "11B004"},
		{Name: "Noah Hall", Email: "noah.hall@school.edu", Age: 16, RollNo: "11B005"},
		{Name: "Harper Allen", Email: "harper.allen@school.edu", Age: 17, RollNo: "11B006"},
		{Name: "Mason Young", Email: "mason.young@school.edu", Age: 16, RollNo: "11B007"},
		{Name: "Evelyn King", Email: "evelyn.king@school.edu", Age: 17, RollNo: "11B008"},
		{Name: "Logan Wright", Email: "logan.wright@school.edu", Age: 16, RollNo: "11B009"},
		{Name: "Abigail Lopez", Email: "abigail.lopez@school.edu", Age: 17, RollNo: "11B010"},

		// Grade 12C Students
		{Name: "Jackson Hill", Email: "jackson.hill@school.edu", Age: 17, RollNo: "12C001"},
		{Name: "Emily Scott", Email: "emily.scott@school.edu", Age: 18, RollNo: "12C002"},
		{Name: "Aiden Green", Email: "aiden.green@school.edu", Age: 17, RollNo: "12C003"},
		{Name: "Madison Adams", Email: "madison.adams@school.edu", Age: 18, RollNo: "12C004"},
		{Name: "Sebastian Baker", Email: "sebastian.baker@school.edu", Age: 17, RollNo: "12C005"},
		{Name: "Scarlett Nelson", Email: "scarlett.nelson@school.edu", Age: 18, RollNo: "12C006"},
		{Name: "Carter Carter", Email: "carter.carter@school.edu", Age: 17, RollNo: "12C007"},
		{Name: "Victoria Mitchell", Email: "victoria.mitchell@school.edu", Age: 18, RollNo: "12C008"},
		{Name: "Grayson Perez", Email: "grayson.perez@school.edu", Age: 17, RollNo: "12C009"},
		{Name: "Grace Roberts", Email: "grace.roberts@school.edu", Age: 18, RollNo: "12C010"},
	}

	fmt.Println("\nCreating students...")
	for i, student := range students {
		if err := createStudent(baseURL, student); err != nil {
			log.Printf("Error creating student %d: %v", i+1, err)
		} else {
			fmt.Printf("✅ Created student: %s (%s)\n", student.Name, student.RollNo)
		}
		// Small delay to avoid overwhelming the server
		time.Sleep(50 * time.Millisecond)
	}

	fmt.Printf("\n🎉 Successfully created %d classes and %d students!\n", len(classes), len(students))
	fmt.Println("\n📊 Summary:")
	fmt.Println("- 3 Classes across different grades")
	fmt.Println("- 30 Students with realistic names and roll numbers")
	fmt.Println("- Professional email addresses")
	fmt.Println("- Age-appropriate grade assignments")
}

func createClass(baseURL string, class Class) error {
	jsonData, err := json.Marshal(class)
	if err != nil {
		return err
	}

	resp, err := http.Post(baseURL+"/api/classes", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("server returned status: %d", resp.StatusCode)
	}

	return nil
}

func createStudent(baseURL string, student Student) error {
	jsonData, err := json.Marshal(student)
	if err != nil {
		return err
	}

	resp, err := http.Post(baseURL+"/api/students", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("server returned status: %d", resp.StatusCode)
	}

	return nil
}
