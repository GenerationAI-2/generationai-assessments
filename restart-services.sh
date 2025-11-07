#!/bin/bash

echo "Stopping existing services..."
pkill -9 -f "func.*7072"
pkill -9 -f "func.*7073"
sleep 2

echo "Starting PDF Generator service on port 7073..."
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4/services/pdf-generator
export PNPM_HOME="/Users/caleblucas/Library/pnpm"
export PATH="/opt/homebrew/bin:$PNPM_HOME:$PATH"
nohup func start --port 7073 > /tmp/pdf-gen-$(date +%s).log 2>&1 &
PDF_PID=$!

sleep 5

echo "Starting Business Readiness API on port 7072..."
cd /Users/caleblucas/Documents/Projects/generationai-assessments-4/tools/business-readiness-assessment/api
export PNPM_HOME="/Users/caleblucas/Library/pnpm"
export PATH="/opt/homebrew/bin:$PNPM_HOME:$PATH"
nohup func start --port 7072 > /tmp/business-api-$(date +%s).log 2>&1 &
API_PID=$!

sleep 8

echo ""
echo "Checking service status..."
if lsof -i :7073 | grep -q LISTEN; then
    echo "✅ PDF Generator running on port 7073"
else
    echo "❌ PDF Generator failed to start"
    echo "Check logs: tail -f /tmp/pdf-gen-*.log"
fi

if lsof -i :7072 | grep -q LISTEN; then
    echo "✅ Business API running on port 7072"
else
    echo "❌ Business API failed to start"
    echo "Check logs: tail -f /tmp/business-api-*.log"
fi

echo ""
echo "Services restarted with updated code!"
echo "Frontend: http://localhost:3000"
echo ""

