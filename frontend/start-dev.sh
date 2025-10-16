#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Print welcome message
echo "🚀 Starting Why Development Environment..."
echo "📂 Project location: $(pwd)"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Starting development server..."
npm run dev

# If the server fails to start, provide help
if [ $? -ne 0 ]; then
    echo "❌ Failed to start server. Common fixes:"
    echo "1. Make sure port 4000 is not in use"
    echo "2. Check if .env file exists with API keys"
    echo "3. Try 'npm install' manually"
fi
