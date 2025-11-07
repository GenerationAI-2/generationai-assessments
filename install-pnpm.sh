#!/bin/bash

# Install pnpm without requiring sudo
# This installs pnpm to your home directory

echo "📦 Installing pnpm (no sudo required)..."
echo ""

# Use the official pnpm installer
curl -fsSL https://get.pnpm.io/install.sh | sh -

echo ""
echo "✅ pnpm installed!"
echo ""
echo "⚠️  IMPORTANT: You need to restart your terminal for pnpm to be available"
echo ""
echo "After restarting your terminal, run:"
echo "  cd /Users/caleblucas/Documents/Projects/generationai-assessments-4"
echo "  ./FIRST_TIME_SETUP.sh"
echo ""

