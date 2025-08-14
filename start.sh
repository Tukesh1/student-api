#!/bin/bash

# Student API Launcher Script
echo "🎓 Starting Student Management System..."
echo "📍 API will be available at: http://localhost:8082/api"
echo "🌐 Web Interface will be available at: http://localhost:8082"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================="

go run cmd/student-api/main.go -Config config/local.yaml
