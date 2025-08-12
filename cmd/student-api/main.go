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
	"github.com/tukesh1/student-api/internal/http/handlers/student"
)

func main() {
	// log config
	cfg := config.MustLoad()

	// database setup



	// setup router
	router := http.NewServeMux()
	router.HandleFunc("POST /api/students", student.New())



	//setup server
	server := http.Server{
		Addr:    cfg.Addr,
		Handler: router,
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
	ctx, cancel :=context.WithTimeout(context.Background(),5* time.Second)
	defer cancel()
	
	if err:= server.Shutdown(ctx); err !=nil {
		slog.Error("failed to shutdodn server", slog.String("error", err.Error()))
	}
	slog.Info("server shutdown successfully")
}
