#!/bin/bash

# TellYouSomeday Local Development Setup Script

echo "🚀 Setting up TellYouSomeday for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed locally."
    echo "   You can either:"
    echo "   1. Install MongoDB locally, or"
    echo "   2. Use MongoDB Atlas (cloud) - see DEPLOYMENT_GUIDE.md"
    echo ""
fi

# Create environment files
echo "📝 Creating environment files..."

# Frontend environment
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend .env file"
fi

# Backend environment  
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend .env file"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🔧 To start development:"
echo "   1. Start MongoDB (if using locally): mongod"
echo "   2. Start backend: cd backend && npm run dev"
echo "   3. Start frontend: npm run dev"
echo ""
echo "🌐 Your app will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 For production deployment, see DEPLOYMENT_GUIDE.md"
echo ""
