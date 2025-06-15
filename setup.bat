@echo off
REM TellYouSomeday Local Development Setup Script for Windows

echo 🚀 Setting up TellYouSomeday for local development...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not installed locally.
    echo    You can either:
    echo    1. Install MongoDB locally, or
    echo    2. Use MongoDB Atlas (cloud) - see DEPLOYMENT_GUIDE.md
    echo.
)

REM Create environment files
echo 📝 Creating environment files...

if not exist .env (
    copy .env.example .env
    echo ✅ Created frontend .env file
)

if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo ✅ Created backend .env file
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 🔧 To start development:
echo    1. Start MongoDB (if using locally): mongod
echo    2. Start backend: cd backend && npm run dev
echo    3. Start frontend: npm run dev
echo.
echo 🌐 Your app will be available at:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.
echo 📚 For production deployment, see DEPLOYMENT_GUIDE.md
echo.
pause
