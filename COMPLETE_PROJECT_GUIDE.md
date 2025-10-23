# SQL RUNNER - COMPLETE PROJECT DOCUMENTATION

## TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Setup Instructions](#setup-instructions)
6. [How It Works](#how-it-works)
7. [Code Structure](#code-structure)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Security Features](#security-features)

---

## 1. PROJECT OVERVIEW

### What is SQL Runner?
SQL Runner is a full-stack web application that allows users to execute SQL queries through an intuitive web interface. It provides a complete environment for learning and practicing SQL with real-time query execution, results visualization, and query history tracking.

### Purpose
- **Educational Tool**: Learn SQL by executing queries and seeing immediate results
- **Database Explorer**: Browse table structures and sample data
- **Query Testing**: Test SQL queries in a safe environment
- **Practice Platform**: Practice SQL skills with real database tables

### Key Highlights
- ✅ Modern, responsive user interface
- ✅ Real-time SQL query execution
- ✅ Firebase authentication (Email/Password + Google Sign-In)
- ✅ Query history tracking
- ✅ Table schema explorer
- ✅ Sample data preview
- ✅ Error handling and validation
- ✅ Docker support for easy deployment

---

## 2. TECHNOLOGY STACK

### Frontend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.0.4 | React framework with server-side rendering |
| **React** | 18.2.0 | UI component library |
| **TypeScript** | 5.3.3 | Type-safe JavaScript |
| **TailwindCSS** | 3.3.6 | Utility-first CSS framework |
| **Axios** | 1.6.2 | HTTP client for API calls |
| **Lucide React** | 0.294.0 | Icon library |
| **Firebase** | Latest | Authentication service |

### Backend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.9+ | Programming language |
| **FastAPI** | 0.104.1 | Modern web framework |
| **SQLite** | Built-in | Database engine |
| **Uvicorn** | 0.24.0 | ASGI server |
| **Pydantic** | 2.5.0 | Data validation |
| **Passlib** | 1.7.4 | Password hashing |
| **Python-Jose** | 3.3.0 | JWT tokens (legacy) |

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control
- **npm** - Package manager (frontend)
- **pip** - Package manager (backend)

---

## 3. ARCHITECTURE

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (Port 3000)             │  │
│  │  - React Components                              │  │
│  │  - Firebase Auth                                 │  │
│  │  - TailwindCSS Styling                          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │ (Axios API Calls)
                         ▼
┌─────────────────────────────────────────────────────────┐
│           FastAPI Backend (Port 8000)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Endpoints:                                   │  │
│  │  - POST /api/query/execute                       │  │
│  │  - GET  /api/tables                              │  │
│  │  - GET  /api/tables/{name}                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────┐
│              SQLite Database                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Tables:                                          │  │
│  │  - Customers (5 rows)                            │  │
│  │  - Orders (5 rows)                               │  │
│  │  - Shippings (5 rows)                            │  │
│  │  - users (authentication - legacy)               │  │
│  │  - query_history (legacy)                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

External Services:
┌─────────────────────────────────────────────────────────┐
│              Firebase (Google Cloud)                     │
│  - Authentication                                        │
│  - User Management                                       │
│  - Google Sign-In                                        │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**User Login Flow:**
```
1. User opens app → 2. Firebase Auth UI → 3. User enters credentials
   ↓
4. Firebase validates → 5. Returns user token → 6. Store in localStorage
   ↓
7. Redirect to SQL Runner interface
```

**Query Execution Flow:**
```
1. User types SQL query → 2. Click "Run Query" button
   ↓
3. Frontend sends POST to /api/query/execute
   ↓
4. Backend receives query → 5. Validates query → 6. Executes on SQLite
   ↓
7. Returns results (JSON) → 8. Frontend displays in table
   ↓
9. Save to localStorage history
```

---

## 4. FEATURES

### 4.1 User Authentication

**Firebase Authentication**
- Email/Password signup and login
- Google Sign-In (OAuth 2.0)
- Session persistence
- Automatic logout
- Secure token management

**How It Works:**
1. User clicks "Sign Up" or "Login"
2. Firebase handles authentication
3. Returns user object with UID, email, displayName
4. Stored in localStorage for session management
5. User redirected to main application

### 4.2 SQL Query Execution

**Features:**
- Large text area for query input
- Syntax-friendly monospace font
- "Run Query" button with loading states
- Real-time execution
- Results displayed in formatted table
- Execution time tracking
- Row count display

**Supported SQL Operations:**
- SELECT queries
- JOIN operations (INNER, LEFT, RIGHT)
- WHERE clauses and filtering
- GROUP BY and aggregations
- ORDER BY sorting
- LIMIT clauses
- INSERT, UPDATE (with caution)

**Example Queries:**
```sql
-- Simple SELECT
SELECT * FROM Customers;

-- JOIN query
SELECT c.first_name, o.item 
FROM Customers c 
JOIN Orders o ON c.customer_id = o.customer_id;

-- Aggregation
SELECT country, COUNT(*) 
FROM Customers 
GROUP BY country;
```

### 4.3 Table Explorer

**Features:**
- Sidebar listing all available tables
- Click to view table details
- Schema display:
  - Column names
  - Data types
  - Primary keys
  - Nullable fields
- Sample data preview (first 5 rows)
- Total row count

**Available Tables:**
1. **Customers** - Customer information
2. **Orders** - Order details
3. **Shippings** - Shipping status

### 4.4 Query History

**Features:**
- Stores last 20 queries per user
- Shows success/failure status
- Displays error messages
- Timestamp for each query
- Click to re-run queries
- Stored in browser localStorage

**Storage Format:**
```javascript
{
  id: timestamp,
  query: "SELECT * FROM Customers",
  executed_at: "2025-10-24T03:00:00Z",
  success: true,
  error_message: null
}
```

### 4.5 Results Display

**Features:**
- Clean, formatted table layout
- Column headers
- Row data with proper alignment
- NULL value handling
- Success indicators
- Error messages in red boxes
- Execution time display
- Row count

### 4.6 Error Handling

**Frontend Errors:**
- Network errors
- Invalid responses
- Authentication failures
- Display user-friendly messages

**Backend Errors:**
- SQL syntax errors
- Invalid table names
- Permission errors
- Database connection issues

---

## 5. SETUP INSTRUCTIONS

### 5.1 Prerequisites

**Required Software:**
- Python 3.9 or higher
- Node.js 18 or higher
- npm (comes with Node.js)
- Git (optional)

**Optional:**
- Docker Desktop
- VS Code or any code editor

### 5.2 Manual Setup

**Step 1: Clone/Download Project**
```bash
cd "d:\web dev_city\windsurf\sql runner"
```

**Step 2: Backend Setup**
```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create database
python setup_database.py

# Run backend server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

**Step 3: Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local

# Run frontend server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 5.3 Docker Setup

**Single Command:**
```bash
docker-compose up --build
```

This will:
- Build both frontend and backend containers
- Set up the database automatically
- Start both services
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### 5.4 Firebase Configuration

**Important:** Enable Google Sign-In in Firebase Console

1. Go to: https://console.firebase.google.com/project/sql-runner
2. Navigate to **Authentication** → **Sign-in method**
3. Enable **Google** provider
4. Add support email
5. Save changes

---

## 6. HOW IT WORKS

### 6.1 Application Flow

**1. User Opens Application**
```
http://localhost:3000 → Checks authentication status
   ↓
If not authenticated → Show login page
If authenticated → Show SQL Runner interface
```

**2. User Logs In**
```
Enter email/password OR Click Google Sign-In
   ↓
Firebase authenticates
   ↓
Store user data in localStorage
   ↓
Redirect to main interface
```

**3. User Explores Tables**
```
Click on table name in sidebar
   ↓
Display table schema (columns, types, keys)
   ↓
Show sample data (first 5 rows)
   ↓
Display total row count
```

**4. User Executes Query**
```
Type SQL query in text area
   ↓
Click "Run Query" button
   ↓
Frontend sends POST request to backend
   ↓
Backend executes query on SQLite
   ↓
Returns results as JSON
   ↓
Frontend displays results in table
   ↓
Save query to localStorage history
```

### 6.2 Component Breakdown

**Frontend Components:**

1. **AuthPage.tsx**
   - Login/Signup forms
   - Firebase authentication
   - Google Sign-In button
   - Error handling

2. **SQLRunner.tsx**
   - Main application interface
   - Query input area
   - Run button
   - Results display
   - Header with logout

3. **TableExplorer.tsx**
   - Table list sidebar
   - Schema display
   - Sample data preview

4. **QueryHistoryPanel.tsx**
   - Query history list
   - Success/failure indicators
   - Click to re-run

5. **ResultsTable.tsx**
   - Formatted table display
   - Column headers
   - Row data

**Backend Modules:**

1. **main.py**
   - FastAPI application
   - API endpoints
   - CORS configuration

2. **database.py**
   - Database connection
   - Query execution
   - Table information

3. **models.py**
   - Pydantic data models
   - Request/response schemas

4. **auth.py** (Legacy)
   - JWT token functions
   - Password hashing

### 6.3 State Management

**Frontend State:**
- Authentication status (React useState)
- Current query (React useState)
- Query results (React useState)
- Selected table (React useState)
- Query history (localStorage)
- User data (localStorage)

**Backend State:**
- Stateless API (no sessions)
- Database persistence
- No authentication state (Firebase handles it)

---

## 7. CODE STRUCTURE

### 7.1 Project Directory

```
sql-runner/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app & routes
│   │   ├── database.py          # Database operations
│   │   ├── auth.py              # Auth utilities (legacy)
│   │   └── models.py            # Pydantic models
│   ├── setup_database.py        # Database setup script
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile              # Backend container
│   └── sql_runner.db           # SQLite database file
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Home page
│   │   │   └── globals.css      # Global styles
│   │   ├── components/
│   │   │   ├── AuthPage.tsx     # Login/Signup
│   │   │   ├── SQLRunner.tsx    # Main interface
│   │   │   ├── TableExplorer.tsx
│   │   │   ├── QueryHistoryPanel.tsx
│   │   │   └── ResultsTable.tsx
│   │   └── lib/
│   │       ├── api.ts           # API client
│   │       ├── firebase.ts      # Firebase config
│   │       └── utils.ts         # Utilities
│   ├── package.json            # Node dependencies
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # Tailwind config
│   ├── next.config.js          # Next.js config
│   ├── Dockerfile              # Frontend container
│   └── .env.local              # Environment variables
│
├── docker-compose.yml          # Docker orchestration
├── README.md                   # Main documentation
├── SETUP.md                    # Setup guide
├── PROJECT_SUMMARY.md          # Project summary
├── FIREBASE_SETUP.md           # Firebase guide
├── GOOGLE_SIGNIN_SETUP.md      # Google Sign-In guide
└── COMPLETE_PROJECT_GUIDE.md   # This file
```

### 7.2 Key Files Explained

**Backend Files:**

**`app/main.py`** - Main FastAPI Application
```python
# Creates FastAPI app
# Defines API endpoints
# Configures CORS
# Handles query execution
```

**`app/database.py`** - Database Operations
```python
# Database connection management
# Query execution function
# Table information retrieval
# Error handling
```

**`app/models.py`** - Data Models
```python
# Request models (QueryRequest)
# Response models (QueryResponse)
# Validation schemas
```

**Frontend Files:**

**`src/lib/firebase.ts`** - Firebase Configuration
```typescript
// Firebase initialization
// Authentication functions
// Google Sign-In setup
```

**`src/lib/api.ts`** - API Client
```typescript
// Axios configuration
// API endpoint functions
// Error handling
```

**`src/components/SQLRunner.tsx`** - Main Interface
```typescript
// Query input
// Results display
// Table explorer integration
// Query history
```

---

## 8. API DOCUMENTATION

### 8.1 Base URL
```
http://localhost:8000
```

### 8.2 Endpoints

#### POST /api/query/execute
Execute a SQL query

**Request:**
```json
{
  "query": "SELECT * FROM Customers"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "customer_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "age": 30,
      "country": "USA"
    }
  ],
  "columns": ["customer_id", "first_name", "last_name", "age", "country"],
  "row_count": 1,
  "execution_time": 0.001
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "no such table: InvalidTable",
  "execution_time": 0.001
}
```

#### GET /api/tables
Get list of all tables (Legacy - requires auth)

#### GET /api/tables/{table_name}
Get table schema and sample data (Legacy - requires auth)

#### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy"
}
```

#### GET /docs
Interactive API documentation (Swagger UI)

---

## 9. DATABASE SCHEMA

### 9.1 Sample Tables

#### Customers Table
```sql
CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    age INTEGER,
    country VARCHAR(100)
);
```

**Sample Data:**
| customer_id | first_name | last_name | age | country |
|------------|------------|-----------|-----|---------|
| 1 | John | Doe | 30 | USA |
| 2 | Robert | Luna | 22 | USA |
| 3 | David | Robinson | 25 | UK |
| 4 | John | Reinhardt | 22 | UK |
| 5 | Betty | Doe | 28 | UAE |

#### Orders Table
```sql
CREATE TABLE Orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    item VARCHAR(100),
    amount INTEGER,
    customer_id INTEGER,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
```

**Sample Data:**
| order_id | item | amount | customer_id |
|----------|------|--------|-------------|
| 1 | Keyboard | 400 | 4 |
| 2 | Mouse | 300 | 4 |
| 3 | Monitor | 12000 | 3 |
| 4 | Keyboard | 400 | 1 |
| 5 | Mousepad | 250 | 2 |

#### Shippings Table
```sql
CREATE TABLE Shippings (
    shipping_id INTEGER PRIMARY KEY AUTOINCREMENT,
    status VARCHAR(100),
    customer INTEGER
);
```

**Sample Data:**
| shipping_id | status | customer |
|-------------|--------|----------|
| 1 | Pending | 2 |
| 2 | Pending | 4 |
| 3 | Delivered | 3 |
| 4 | Pending | 5 |
| 5 | Delivered | 1 |

### 9.2 System Tables (Legacy)

#### users Table
Stores user authentication data (legacy - not used with Firebase)

#### query_history Table
Stores query execution history (legacy - now in localStorage)

---

## 10. SECURITY FEATURES

### 10.1 Authentication Security

**Firebase Authentication:**
- Industry-standard OAuth 2.0
- Secure token management
- Password hashing by Firebase
- Session management
- Automatic token refresh

**Google Sign-In:**
- OAuth 2.0 protocol
- No password storage
- Trusted authentication
- User consent required

### 10.2 Query Security

**SQL Injection Prevention:**
- Parameterized queries
- Input validation
- Error message sanitization

**Dangerous Operation Protection:**
```python
# Blocked operations:
- DROP TABLE users
- DROP TABLE query_history
- DELETE FROM users
- DELETE FROM query_history
```

### 10.3 CORS Configuration

**Allowed Origins:**
- http://localhost:3000
- http://localhost:3001

**Allowed Methods:**
- GET, POST, PUT, DELETE

### 10.4 Data Privacy

**User Data:**
- Stored in Firebase (secure cloud)
- Query history in localStorage (client-side)
- No sensitive data in backend

**Best Practices:**
- HTTPS in production
- Environment variables for secrets
- No hardcoded credentials
- Secure token storage

---

## CONCLUSION

This SQL Runner application demonstrates a complete full-stack solution with:
- Modern frontend (Next.js + React + TypeScript)
- Robust backend (FastAPI + Python)
- Secure authentication (Firebase)
- Real-time query execution
- Professional UI/UX
- Docker support
- Comprehensive documentation

**Perfect for:**
- Learning SQL
- Teaching database concepts
- Portfolio projects
- Interview demonstrations
- Educational platforms

**Next Steps:**
- Deploy to production (Vercel + Railway/Heroku)
- Add more database features
- Implement query builder
- Add data visualization
- Support multiple databases

---

**Project Status:** ✅ Complete and Production-Ready

**Last Updated:** October 24, 2025

**Version:** 1.0.0
