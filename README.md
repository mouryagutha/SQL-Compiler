# 🚀 SQL Runner - Interactive SQL Query Execution Platform

A modern, full-stack web application that allows users to write, execute, and visualize SQL queries in real-time with Firebase authentication, animated UI, query history, and comprehensive database management features.

![SQL Runner](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

**Live Demo:** [https://sql-compiler-y7zn.vercel.app](https://sql-compiler-y7zn.vercel.app)

## Features

### Core Features
- **Query Input Area**: Write and execute SQL queries with syntax highlighting
- **Results Display**: View query results in a clean, formatted table
- **Available Tables Panel**: Browse database tables with schema preview and sample data
- **Error Handling**: Comprehensive error messages for invalid queries

### Bonus Features ✨
- **Firebase Authentication**: Secure login/signup with Email/Password and Google Sign-In
- **Password Confirmation**: Double password entry for signup verification
- **Animated Login Page**: Beautiful gradient background with floating SQL snippets
- **Recent Queries History**: Track and re-run your recent SQL queries (stored locally)
- **Resizable Query Box**: Drag to adjust query editor height
- **Database Reset**: One-click restore of sample data
- **Username Display**: Personalized greeting with user's name
- **Modern UI**: Gradients, glassmorphism, and smooth animations
- **Cloud Deployment**: Deployed on Vercel (frontend) and Render (backend)

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **FastAPI** (Python)
- **SQLite** database
- **Pydantic** for data validation
- **CORS** middleware

### Authentication
- **Firebase** for user authentication
- **Google Sign-In** OAuth 2.0
- **Email/Password** authentication

## Project Structure

```
sql-runner/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── database.py       # Database connection
│   │   ├── auth.py           # Authentication logic
│   │   └── models.py         # Pydantic models
│   ├── sql_runner.db         # SQLite database
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile              # Railway deployment
│   └── railway.json          # Railway config
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities & Firebase
│   ├── package.json
│   └── tailwind.config.js
├── DEPLOYMENT_GUIDE.md       # Hosting instructions
└── README.md
```

## 📋 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** ([Download](https://git-scm.com/downloads))
- **Firebase Account** (free tier) - [Create Account](https://console.firebase.google.com/)

### 🚀 Quick Start (5 Minutes)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/mouryagutha/SQL-Compiler.git
cd SQL-Compiler
```

#### Step 2: Database Setup

The database will be automatically initialized on first run, but you can manually set it up:

```bash
cd backend
python setup_database.py
```

**What this does:**
- Creates `sql_runner.db` SQLite database
- Creates 5 tables: `Customers`, `Orders`, `Shippings`, `users`, `query_history`
- Populates with sample data (5 customers, 5 orders, 5 shipments)

**Sample Data Preview:**
```
Customers: John Doe, Robert Luna, David Robinson, John Reinhardt, Betty Doe
Orders: Keyboard, Mouse, Monitor, Mousepad, Keycaps
Shippings: Pending/Delivered statuses
```

#### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
venv\Scripts\Activate.ps1
# Windows (CMD):
venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
Database initialization check complete
```

**Backend URLs:**
- API Server: `http://localhost:8000`
- API Documentation (Swagger): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

#### Step 4: Frontend Setup

Open a **new terminal** (keep backend running):

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
✓ Ready in 3.4s
```

**Frontend URL:**
- Application: `http://localhost:3000`

#### Step 5: Firebase Configuration

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "SQL Runner")
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Enable Authentication:**
   - In Firebase Console, go to **Authentication** → **Get Started**
   - Click **Sign-in method** tab
   - Enable **Email/Password**
   - Enable **Google** (add support email)

3. **Get Firebase Config:**
   - Go to **Project Settings** (gear icon)
   - Scroll to "Your apps" → Click **Web** icon (`</>`)
   - Register app with nickname (e.g., "SQL Runner Web")
   - Copy the `firebaseConfig` object

4. **Add Config to Frontend:**
   
   Create `frontend/src/lib/firebase.ts` (if not exists) and add your config:

   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

5. **Add Authorized Domains:**
   - In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
   - Add `localhost` (should be there by default)
   - Add your production domain when deploying

#### Step 6: Environment Variables (Optional)

**Backend** - Create `backend/.env`:
```env
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sql_runner.db
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### ✅ Verify Installation

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```
   Expected: `{"status":"healthy","database":"connected"}`

2. **Frontend Access:**
   - Open browser: `http://localhost:3000`
   - You should see the animated login page

3. **Create Test Account:**
   - Click "Sign Up"
   - Enter email and password (min 6 characters)
   - Confirm password
   - Click "Sign Up" or use "Sign in with Google"

4. **Run Test Query:**
   ```sql
   SELECT * FROM Customers;
   ```
   Expected: 5 rows of customer data

## Usage

### 1. Create an Account
- Navigate to `http://localhost:3000`
- Click "Sign Up" and create a new account
- Login with your credentials

### 2. Explore Tables
- View available tables in the left sidebar
- Click on any table to see its schema and sample data

### 3. Run SQL Queries
- Type your SQL query in the editor
- Click "Run Query" to execute
- View results in the table below

### 4. View Query History
- Access your recent queries from the history panel
- Click any query to re-run it

## 📡 API Endpoints

### Health Check
- `GET /health` - Check API and database status

### Query Execution
- `POST /api/query/execute` - Execute SQL query
  ```json
  Request: { "query": "SELECT * FROM Customers;" }
  Response: {
    "success": true,
    "data": [...],
    "columns": ["customer_id", "first_name", ...],
    "row_count": 5,
    "execution_time": 0.003
  }
  ```

### Database Management
- `POST /api/database/reset` - Reset Customers, Orders, Shippings tables to original state

### Table Information
- `GET /api/tables` - List all available tables
- `GET /api/tables/{table_name}` - Get table schema, sample data, and row count

### Query History
- `GET /api/query/history?limit=20` - Get user's query history (requires auth)

**Interactive API Documentation:** Visit `http://localhost:8000/docs` for Swagger UI

## Sample Queries

Try these queries to get started:

```sql
-- Get all customers
SELECT * FROM Customers;

-- Get customers from USA
SELECT * FROM Customers WHERE country = 'USA';

-- Join customers with orders
SELECT c.first_name, c.last_name, o.item, o.amount
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id;

-- Get order statistics by country
SELECT c.country, COUNT(o.order_id) as total_orders, SUM(o.amount) as total_amount
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.country;
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API endpoints
- SQL injection prevention through parameterized queries
- CORS configuration

## Development

### Backend Development

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API documentation available at: `http://localhost:8000/docs`

### Frontend Development

```bash
cd frontend
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sql_runner.db
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Not Found
**Error:** `no such table: Customers`

**Solution:**
```bash
cd backend
python setup_database.py
```

#### 2. Port Already in Use
**Error:** `Address already in use: 8000` or `Port 3000 is already in use`

**Solution:**
```bash
# Find and kill process on Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Find and kill process on macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Or use different ports:
# Backend:
uvicorn app.main:app --reload --port 8001
# Frontend:
npm run dev -- -p 3001
```

#### 3. Firebase Authentication Errors
**Error:** `Firebase: Error (auth/invalid-api-key)`

**Solution:**
- Verify Firebase config in `frontend/src/lib/firebase.ts`
- Ensure all Firebase credentials are correct
- Check Firebase Console → Project Settings → General → Your apps

#### 4. CORS Errors
**Error:** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS`

**Solution:**
- Check `backend/app/main.py` CORS settings
- Ensure frontend URL is in `allow_origins` list
- Restart backend server after changes

#### 5. Module Not Found Errors

**Backend Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend Error:** `Module not found: Can't resolve 'lucide-react'`

**Solution:**
```bash
cd frontend
npm install
```

#### 6. Python Virtual Environment Issues

**Error:** `'python' is not recognized` or `'pip' is not recognized`

**Solution:**
- Ensure Python is added to PATH
- Use `python3` and `pip3` on macOS/Linux
- Activate virtual environment before running commands

#### 7. Database Reset Not Working

**Error:** Reset button doesn't restore data

**Solution:**
```bash
cd backend
python setup_database.py
# Restart backend server
```

#### 8. Build Errors on Vercel

**Error:** `Failed to compile` with ESLint errors

**Solution:**
- Check for unescaped characters (use `&apos;` for apostrophes)
- Run `npm run build` locally to test
- Fix all TypeScript and ESLint errors before pushing

### Getting Help

If you encounter issues not listed here:

1. **Check Logs:**
   - Backend: Terminal where uvicorn is running
   - Frontend: Browser console (F12)
   - Vercel: Deployment logs in Vercel dashboard

2. **Verify Setup:**
   - Run health check: `curl http://localhost:8000/health`
   - Check API docs: `http://localhost:8000/docs`
   - Test frontend: `http://localhost:3000`

3. **Common Commands:**
   ```bash
   # Restart backend
   cd backend
   python -m uvicorn app.main:app --reload
   
   # Restart frontend
   cd frontend
   npm run dev
   
   # Reset database
   cd backend
   python setup_database.py
   
   # Clear npm cache
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🌐 Deployment

### Production Deployment

The application is deployed and live at:
- **Frontend:** [https://sql-compiler-y7zn.vercel.app](https://sql-compiler-y7zn.vercel.app) (Vercel)
- **Backend:** [https://sql-compiler-1.onrender.com](https://sql-compiler-1.onrender.com) (Render)

### Deploy Your Own

#### Frontend (Vercel)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
6. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = Your backend URL
7. Deploy!

#### Backend (Render)

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** sql-runner-backend
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `bash start_server.sh`
6. Add environment variables (optional):
   - `SECRET_KEY` = Your secret key
7. Deploy!

**Note:** Render free tier may spin down after inactivity. First request may take 30-60 seconds.

## 📊 Project Statistics

- **Total Lines of Code:** ~2,500+
- **Components:** 5 React components
- **API Endpoints:** 7 routes
- **Database Tables:** 5 tables
- **Dependencies:** 25+ npm packages, 15+ Python packages
- **Development Time:** 40-60 hours

## 🎯 Key Features Implemented

- ✅ SQL Query Execution with real-time results
- ✅ Firebase Authentication (Email/Password + Google)
- ✅ Password confirmation on signup
- ✅ Animated login page with floating elements
- ✅ Database schema explorer
- ✅ Query history (localStorage)
- ✅ Resizable query editor
- ✅ Database reset functionality
- ✅ Responsive design with Tailwind CSS
- ✅ Error handling and validation
- ✅ Cloud deployment (Vercel + Render)

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

**Mourya Gutha**
- GitHub: [@mouryagutha](https://github.com/mouryagutha)
- Project: [SQL-Compiler](https://github.com/mouryagutha/SQL-Compiler)

Built as a full-stack development project demonstrating modern web development practices with Next.js, FastAPI, Firebase, and cloud deployment.

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
