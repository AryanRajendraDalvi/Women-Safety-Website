#!/bin/bash

echo "🚀 SafeSpace - Women Safety Platform Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create frontend environment file
echo "🔧 Creating frontend environment file..."
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
    echo "✅ Created .env.local"
else
    echo "⚠️  .env.local already exists"
fi

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create backend environment file
echo "🔧 Creating backend environment file..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env from template"
    echo "⚠️  Please edit .env with your MongoDB connection details"
else
    echo "⚠️  .env already exists"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

cd ..

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB connection"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: npm run dev"
echo ""
echo "Access the application:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo "- API Health: http://localhost:5000/api/health"
echo ""
echo "Happy coding! 🚀" 