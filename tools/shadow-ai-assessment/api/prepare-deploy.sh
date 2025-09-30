#!/bin/bash

# Prepare workspace dependencies for Azure deployment
# pnpm uses symlinks which don't work with Azure Functions deployment

echo "Preparing workspace dependencies for deployment..."

# Build shared packages first
cd ../../../shared/types && npm run build
cd ../utils && npm run build

# Go back to API directory
cd ../../tools/shadow-ai-assessment/api

# Remove existing symlinks
rm -rf node_modules/@generation-ai

# Create directories
mkdir -p node_modules/@generation-ai/types
mkdir -p node_modules/@generation-ai/utils

# Copy built files and package.json
cp -R ../../../shared/types/dist node_modules/@generation-ai/types/
cp ../../../shared/types/package.json node_modules/@generation-ai/types/

cp -R ../../../shared/utils/dist node_modules/@generation-ai/utils/
cp ../../../shared/utils/package.json node_modules/@generation-ai/utils/

echo "✅ Workspace dependencies prepared"
ls -la node_modules/@generation-ai/

echo "Building API..."
npm run build

echo "✅ Ready for deployment"
