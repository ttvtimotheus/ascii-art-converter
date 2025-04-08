#!/bin/bash

# ASCII Art Converter Setup Script

echo "🎨 Setting up ASCII Art Converter..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend server: cd backend && npm start"
echo "2. In a new terminal, start the frontend: cd frontend && npm run dev"
echo ""
echo "The application will be available at http://localhost:5173"
