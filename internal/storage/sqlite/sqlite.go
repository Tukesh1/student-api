package sqlite

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
	"github.com/tukesh1/student-api/internal/config"
)

type Sqlite struct {
	Db *sql.DB
}

func New(cfg *config.Config) (*Sqlite, error) {
	db, err := sql.Open("sqlite3", cfg.StoragePath)
	if err != nil {
		return nil, err
	}
	// reate table

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    age INTEGER
)`)
	if err != nil {
		return nil, err
	}
	return  &Sqlite{
		Db: db,
	}, nil
}

func (s *Sqlite) CreateStudent (name string, email string, age int)( int64, error){
 return 0, nil
}
