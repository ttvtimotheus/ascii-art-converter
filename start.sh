#!/bin/bash

# ASCII Art Converter Start Script

echo "🚀 Starting ASCII Art Converter..."

# Start backend server in the background
echo "🔧 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start frontend development server
echo "🌐 Starting frontend development server..."
cd ../frontend
npm run dev

# When frontend is stopped, also stop the backend
kill $BACKEND_PID
