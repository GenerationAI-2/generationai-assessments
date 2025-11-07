#!/bin/bash

# Development Startup Script for Business AI Readiness Assessment
# This script starts all required services for local development

set -e

echo "🚀 Starting GenerationAI Business Readiness Assessment - Local Development"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo "Install it with: npm install -g pnpm"
    exit 1
fi

# Check if Azure Functions Core Tools is installed
if ! command -v func &> /dev/null; then
    echo -e "${RED}❌ Azure Functions Core Tools is not installed${NC}"
    echo "Install it with: npm install -g azure-functions-core-tools@4 --unsafe-perm true"
    exit 1
fi

# Check if Node.js version is sufficient
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version 20+ required (current: $(node -v))${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
fi

# Build shared packages
echo "🔨 Building shared packages..."
pnpm build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Check if local.settings.json files exist
if [ ! -f "tools/business-readiness-assessment/api/local.settings.json" ]; then
    echo -e "${RED}❌ Missing local.settings.json for Business Readiness API${NC}"
    exit 1
fi

if [ ! -f "services/pdf-generator/local.settings.json" ]; then
    echo -e "${RED}❌ Missing local.settings.json for PDF Generator${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Configuration files found${NC}"
echo ""

echo "🎯 Starting services..."
echo ""
echo -e "${YELLOW}This will open 3 terminal windows/tabs:${NC}"
echo "  1. PDF Generator (port 7072)"
echo "  2. Business Readiness API (port 7071)"
echo "  3. Frontend Server (port 3000)"
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        read -p "Kill the process and continue? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            lsof -ti:$1 | xargs kill -9 2>/dev/null || true
            echo -e "${GREEN}✓ Port $1 freed${NC}"
        else
            echo -e "${RED}❌ Cannot start on port $1${NC}"
            exit 1
        fi
    fi
}

# Check ports
check_port 7071
check_port 7072
check_port 3000

echo ""
echo -e "${GREEN}Starting services in separate terminals...${NC}"
echo ""

# Detect OS and open terminals accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🍎 Detected macOS - Opening Terminal tabs..."
    
    # Start PDF Generator
    osascript -e 'tell application "Terminal" to do script "cd '$(pwd)' && echo \"📄 Starting PDF Generator (port 7072)...\" && echo \"\" && pnpm dev:pdf"'
    
    # Wait a bit for PDF service to start
    sleep 3
    
    # Start Business Readiness API
    osascript -e 'tell application "Terminal" to do script "cd '$(pwd)' && echo \"⚙️  Starting Business Readiness API (port 7071)...\" && echo \"\" && pnpm dev:business-readiness"'
    
    # Wait a bit for API to start
    sleep 3
    
    # Start Frontend Server
    osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/tools/business-readiness-assessment/frontend && echo \"🌐 Starting Frontend Server (port 3000)...\" && echo \"\" && python3 -m http.server 3000 || npx http-server -p 3000 --cors"'
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - try gnome-terminal, then xterm
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="PDF Generator" -- bash -c "cd $(pwd) && echo '📄 Starting PDF Generator...' && pnpm dev:pdf; exec bash"
        sleep 3
        gnome-terminal --tab --title="Business Readiness API" -- bash -c "cd $(pwd) && echo '⚙️  Starting API...' && pnpm dev:business-readiness; exec bash"
        sleep 3
        gnome-terminal --tab --title="Frontend Server" -- bash -c "cd $(pwd)/tools/business-readiness-assessment/frontend && echo '🌐 Starting Frontend...' && python3 -m http.server 3000; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd $(pwd) && pnpm dev:pdf" &
        sleep 3
        xterm -e "cd $(pwd) && pnpm dev:business-readiness" &
        sleep 3
        xterm -e "cd $(pwd)/tools/business-readiness-assessment/frontend && python3 -m http.server 3000" &
    else
        echo -e "${RED}❌ No supported terminal emulator found${NC}"
        echo "Please run these commands in separate terminals:"
        echo "  1. pnpm dev:pdf"
        echo "  2. pnpm dev:business-readiness"
        echo "  3. cd tools/business-readiness-assessment/frontend && python3 -m http.server 3000"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Unsupported OS detected${NC}"
    echo "Please run these commands in separate terminals:"
    echo "  1. pnpm dev:pdf"
    echo "  2. pnpm dev:business-readiness"
    echo "  3. cd tools/business-readiness-assessment/frontend && python3 -m http.server 3000"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All services are starting!${NC}"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:              http://localhost:3000"
echo "   Business Readiness API: http://localhost:7071/api/processAssessment"
echo "   PDF Generator:         http://localhost:7072/api/generatePDF"
echo ""
echo "🧪 Test the setup:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Fill out the assessment form"
echo "   3. Check that you're redirected to /results.html"
echo ""
echo "📝 For detailed testing instructions, see: TESTING_VALIDATION.md"
echo ""
echo -e "${YELLOW}Note: Wait ~10-20 seconds for all services to fully start${NC}"
echo ""
echo "To stop all services: Press Ctrl+C in each terminal window"
echo ""

