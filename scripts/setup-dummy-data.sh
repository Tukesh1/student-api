#!/bin/bash

echo "🚀 School Management Platform - Dummy Data Setup"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if server is running
echo -e "${BLUE}📡 Checking if backend server is running...${NC}"
if curl -s http://localhost:8082/health > /dev/null; then
    echo -e "${GREEN}✅ Backend server is running!${NC}"
else
    echo -e "${RED}❌ Backend server is not running!${NC}"
    echo -e "${YELLOW}💡 Please start the backend server first:${NC}"
    echo "   go run cmd/student-api/main.go -Config config/local.yaml"
    exit 1
fi

echo ""
echo -e "${BLUE}📝 Populating database with dummy data...${NC}"
echo ""

# Run the dummy data script
cd scripts
go run populate-dummy-data.go

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Successfully populated database with dummy data!${NC}"
    echo ""
    echo -e "${BLUE}📊 What was created:${NC}"
    echo -e "   • ${GREEN}3 Classes:${NC}"
    echo "     - Grade 10A: Mathematics Advanced (Dr. Sarah Johnson)"
    echo "     - Grade 11B: Computer Science Fundamentals (Prof. Michael Chen)" 
    echo "     - Grade 12C: Physics Laboratory (Dr. Emily Rodriguez)"
    echo ""
    echo -e "   • ${GREEN}30 Students:${NC}"
    echo "     - 10 students in Grade 10A (ages 15-16)"
    echo "     - 10 students in Grade 11B (ages 16-17)"
    echo "     - 10 students in Grade 12C (ages 17-18)"
    echo ""
    echo -e "${BLUE}🌐 Access your application:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8082"
    echo ""
    echo -e "${YELLOW}💡 Tip: You can now test attendance tracking with realistic data!${NC}"
else
    echo ""
    echo -e "${RED}❌ Failed to populate dummy data${NC}"
    echo -e "${YELLOW}💡 Make sure the backend server is running and accessible${NC}"
    exit 1
fi
