#!/bin/bash

# First Time Setup Script
# Run this once to install prerequisites and dependencies

set -e

echo "🚀 GenerationAI - First Time Setup"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version 20+ required (current: $(node -v))${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
echo ""

# Install pnpm if not installed
echo "Checking pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm || {
        echo ""
        echo -e "${YELLOW}⚠️  Global install failed. Trying alternative method...${NC}"
        corepack enable || {
            echo -e "${RED}❌ Could not install pnpm${NC}"
            echo ""
            echo "Please install pnpm manually:"
            echo "  curl -fsSL https://get.pnpm.io/install.sh | sh -"
            echo ""
            echo "Then run this script again."
            exit 1
        }
    }
    
    # Refresh PATH
    export PATH="$HOME/.local/share/pnpm:$PATH"
    
    if ! command -v pnpm &> /dev/null; then
        echo -e "${YELLOW}⚠️  pnpm installed but not in PATH yet${NC}"
        echo ""
        echo "Please:"
        echo "  1. Close and reopen your terminal"
        echo "  2. Run this script again: ./FIRST_TIME_SETUP.sh"
        exit 0
    fi
fi
echo -e "${GREEN}✓ pnpm $(pnpm -v)${NC}"
echo ""

# Install Azure Functions Core Tools
echo "Checking Azure Functions Core Tools..."
if ! command -v func &> /dev/null; then
    echo "📦 Installing Azure Functions Core Tools..."
    npm install -g azure-functions-core-tools@4 --unsafe-perm true || {
        echo -e "${RED}❌ Could not install Azure Functions Core Tools${NC}"
        echo ""
        echo "Please install manually:"
        echo "  npm install -g azure-functions-core-tools@4 --unsafe-perm true"
        echo ""
        echo "Or on macOS with Homebrew:"
        echo "  brew tap azure/functions"
        echo "  brew install azure-functions-core-tools@4"
        exit 1
    }
fi
echo -e "${GREEN}✓ Azure Functions Core Tools${NC}"
echo ""

# Install dependencies
echo "📦 Installing project dependencies..."
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Build shared packages
echo "🔨 Building shared packages..."
pnpm build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "To start development:"
echo "  ./dev-start.sh"
echo ""
echo "Or manually start services:"
echo "  Terminal 1: pnpm dev:pdf"
echo "  Terminal 2: pnpm dev:business-readiness"
echo "  Terminal 3: cd tools/business-readiness-assessment/frontend && python3 -m http.server 3000"
echo ""

