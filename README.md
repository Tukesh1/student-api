# Student API

## Overview
The Student API is a RESTful service built with Go that allows you to manage student records. It provides endpoints to create, retrieve, update, and delete student data, and uses SQLite as the database.

## Features
- Create new student records
- Retrieve a list of all students
- Get details of a specific student by ID
- Update student information
- Delete student records

## Project Structure
```
student-api/
├── cmd/
│   └── student-api/
│       └── main.go       # Entry point of the application
├── config/
│   └── local.yaml        # Configuration file
├── internal/
│   ├── config/           # Configuration loading logic
│   ├── http/             # HTTP handlers
│   │   └── handlers/
│   │       └── student/  # Student-specific handlers
│   ├── storage/          # Database logic
│   │   └── sqlite/       # SQLite implementation
│   ├── types/            # Data models
│   └── utils/            # Utility functions
├── storage/
│   └── storage.db        # SQLite database file
├── go.mod                # Go module file
├── go.sum                # Dependency lock file
└── README.md             # Project documentation
```

## Prerequisites
- Go 1.20 or later
- SQLite 3

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Tukesh1/student-api.git
   cd student-api
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Run the application:
   ```bash
   go run cmd/student-api/main.go -Config config/local.yaml
   ```

## API Endpoints
### Create a Student
- **POST** `/api/students`
- **Request Body**:
  ```json
  {
    "name": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "age": 20
  }
  ```

### Get All Students
- **GET** `/api/students`

### Get a Student by ID
- **GET** `/api/students/{id}`

### Update a Student
- **PUT** `/api/students/{id}`
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated.email@example.com",
    "age": 21
  }
  ```

### Delete a Student
- **DELETE** `/api/students/{id}`
