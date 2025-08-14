package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/tukesh1/student-api/internal/config"
	"github.com/tukesh1/student-api/internal/http/handlers/class"
	"github.com/tukesh1/student-api/internal/http/handlers/health"
	"github.com/tukesh1/student-api/internal/http/handlers/student"
	"github.com/tukesh1/student-api/internal/middleware"
	"github.com/tukesh1/student-api/internal/storage/sqlite"
)

// CORS middleware to handle cross-origin requests
func corsHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {
	// log config
	cfg := config.MustLoad()

	// database setup
	storage, err := sqlite.New(cfg)
	if err != nil {
		log.Fatal(err)
	}
	slog.Info("Storage initilised", slog.String("env", cfg.Env))
	// setup router
	router := http.NewServeMux()

	// Handle OPTIONS requests for CORS preflight
	router.HandleFunc("OPTIONS /api/students", corsHandler(func(w http.ResponseWriter, r *http.Request) {}))
	router.HandleFunc("OPTIONS /api/students/{id}", corsHandler(func(w http.ResponseWriter, r *http.Request) {}))
	router.HandleFunc("OPTIONS /api/classes", corsHandler(func(w http.ResponseWriter, r *http.Request) {}))
	router.HandleFunc("OPTIONS /api/classes/{id}", corsHandler(func(w http.ResponseWriter, r *http.Request) {}))

	// Health check endpoint
	router.HandleFunc("GET /health", health.HealthCheck(storage))

	// Student API routes with CORS
	router.HandleFunc("POST /api/students", corsHandler(student.New(storage)))
	router.HandleFunc("GET /api/students/{id}", corsHandler(student.GetById(storage)))
	router.HandleFunc("GET /api/students", corsHandler(student.GetList(storage)))
	router.HandleFunc("PUT /api/students/{id}", corsHandler(student.UpdateById(storage)))
	router.HandleFunc("DELETE /api/students/{id}", corsHandler(student.DeleteById(storage)))

	// Class API routes with CORS
	router.HandleFunc("POST /api/classes", corsHandler(class.New(storage)))
	router.HandleFunc("GET /api/classes/{id}", corsHandler(class.GetById(storage)))
	router.HandleFunc("GET /api/classes", corsHandler(class.GetList(storage)))
	router.HandleFunc("PUT /api/classes/{id}", corsHandler(class.UpdateById(storage)))
	router.HandleFunc("DELETE /api/classes/{id}", corsHandler(class.DeleteById(storage)))

	// Serve static files
	router.Handle("/", http.FileServer(http.Dir("web/")))

	// Apply logging middleware
	handler := middleware.LoggingMiddleware(router)
	//setup server
	server := http.Server{
		Addr:    cfg.Addr,
		Handler: handler,
	}
	slog.Info("server started", slog.String("address", cfg.Addr))
	// create a channel to store signal values
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	/*
			os.Interrupt and syscall.SIGINT are both triggered by Ctrl+C in the terminal.
		syscall.SIGTERM is a termination signal sent by the OS (e.g., when stopping a process).
	*/
	go func() {
		err := server.ListenAndServe()
		if err != nil {
			log.Fatal("failed to start server")
		}
	}()

	<-done // till when there is no signal in done channel the server will run
	slog.Info("sutting done the server")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		slog.Error("failed to shutdodn server", slog.String("error", err.Error()))
	}
	slog.Info("server shutdown successfully")
}
