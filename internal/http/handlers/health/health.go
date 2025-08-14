package health

import (
	"encoding/json"
	"net/http"
	"runtime"
	"time"
)

type HealthStatus struct {
	Status    string         `json:"status"`
	Timestamp time.Time      `json:"timestamp"`
	Version   string         `json:"version"`
	Uptime    string         `json:"uptime"`
	System    SystemInfo     `json:"system"`
	Database  DatabaseStatus `json:"database"`
}

type SystemInfo struct {
	GoVersion    string `json:"go_version"`
	NumGoroutine int    `json:"num_goroutine"`
	MemoryMB     uint64 `json:"memory_mb"`
}

type DatabaseStatus struct {
	Connected bool   `json:"connected"`
	Type      string `json:"type"`
}

var startTime = time.Now()

func HealthCheck(db interface{}) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var m runtime.MemStats
		runtime.ReadMemStats(&m)

		health := HealthStatus{
			Status:    "healthy",
			Timestamp: time.Now(),
			Version:   "1.0.0",
			Uptime:    time.Since(startTime).String(),
			System: SystemInfo{
				GoVersion:    runtime.Version(),
				NumGoroutine: runtime.NumGoroutine(),
				MemoryMB:     bToMb(m.Alloc),
			},
			Database: DatabaseStatus{
				Connected: true, // You can add actual DB ping check here
				Type:      "SQLite",
			},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(health)
	}
}

func bToMb(b uint64) uint64 {
	return b / 1024 / 1024
}
