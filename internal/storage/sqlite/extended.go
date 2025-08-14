package sqlite

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/tukesh1/student-api/internal/types"
)

// Class methods
func (s *Sqlite) CreateClass(name, grade, section, teacherName string) (int64, error) {
	stmt, err := s.Db.Prepare("INSERT INTO classes (name, grade, section, teacher_name) VALUES (?,?,?,?)")
	if err != nil {
		return 0, err
	}
	defer stmt.Close()
	result, err := stmt.Exec(name, grade, section, teacherName)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (s *Sqlite) GetClassById(id int64) (types.Class, error) {
	stmt, err := s.Db.Prepare("select id, name, grade, section, teacher_name from classes where id = ? LIMIT 1")
	if err != nil {
		return types.Class{}, err
	}
	defer stmt.Close()
	var class types.Class
	err = stmt.QueryRow(id).Scan(&class.Id, &class.Name, &class.Grade, &class.Section, &class.TeacherName)
	if err != nil {
		if err == sql.ErrNoRows {
			return types.Class{}, fmt.Errorf("no class found with id %d", id)
		}
		return types.Class{}, fmt.Errorf("query error %w", err)
	}
	return class, nil
}

func (s *Sqlite) GetClasses() ([]types.Class, error) {
	rows, err := s.Db.Query("select id, name, grade, section, teacher_name from classes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var classes []types.Class

	for rows.Next() {
		var class types.Class
		err := rows.Scan(&class.Id, &class.Name, &class.Grade, &class.Section, &class.TeacherName)
		if err != nil {
			return nil, err
		}
		classes = append(classes, class)
	}
	return classes, nil
}

func (s *Sqlite) UpdateClass(id int64, name, grade, section, teacherName string) error {
	result, err := s.Db.Exec("UPDATE classes SET name = ?, grade = ?, section = ?, teacher_name = ? WHERE id = ?", name, grade, section, teacherName, id)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("no class found with id %d", id)
	}
	return nil
}

func (s *Sqlite) DeleteClass(id int64) error {
	result, err := s.Db.Exec("DELETE FROM classes WHERE id = ?", id)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return fmt.Errorf("no class found with id %d", id)
	}
	return nil
}

// Basic attendance methods (for demo purposes)
func (s *Sqlite) CreateAttendanceRecord(studentID, classID int64, date time.Time, status, remarks string) (int64, error) {
	result, err := s.Db.Exec("INSERT INTO attendance_records (student_id, class_id, date, status, remarks) VALUES (?,?,?,?,?)", studentID, classID, date.Format("2006-01-02"), status, remarks)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (s *Sqlite) GetAttendanceByDate(classID int64, date time.Time) ([]types.AttendanceRecord, error) {
	return []types.AttendanceRecord{}, nil
}

func (s *Sqlite) GetAttendanceByStudent(studentID int64, startDate, endDate time.Time) ([]types.AttendanceRecord, error) {
	return []types.AttendanceRecord{}, nil
}

func (s *Sqlite) UpdateAttendanceRecord(id int64, status, remarks string) error {
	return nil
}

func (s *Sqlite) DeleteAttendanceRecord(id int64) error {
	return nil
}

func (s *Sqlite) GetAttendanceReport(studentID int64, startDate, endDate time.Time) (types.AttendanceReport, error) {
	return types.AttendanceReport{}, nil
}
