#!/bin/bash

echo "🎓 School Attendance System Setup"
echo "================================="
echo ""

# Check if we're in the correct directory
if [ ! -f "go.mod" ]; then
    echo "❌ Please run this script from the student-api root directory"
    exit 1
fi

echo "📦 Setting up backend dependencies..."
go mod tidy

echo ""
echo "📦 Setting up frontend dependencies..."
cd attendance-frontend

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the system:"
echo "1. Start the backend (from root directory):"
echo "   go run cmd/student-api/main.go -Config config/local.yaml"
echo ""
echo "2. Start the frontend (from attendance-frontend directory):"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 Backend API: http://localhost:8082"
echo "🌐 Frontend: http://localhost:3000"
