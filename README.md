# SQL Runner - Full-Stack Web Application

A modern SQL query execution platform with a Next.js frontend and FastAPI backend, featuring user authentication, query history, and an intuitive table explorer.

## Features

### Core Features
- **Query Input Area**: Write and execute SQL queries with syntax highlighting
- **Results Display**: View query results in a clean, formatted table
- **Available Tables Panel**: Browse database tables with schema preview and sample data
- **Error Handling**: Comprehensive error messages for invalid queries

### Bonus Features ✨
- **User Authentication**: Secure login/signup system with JWT tokens
- **Recent Queries History**: Track and re-run your recent SQL queries
- **Docker Support**: Complete containerization with Docker Compose

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
- **JWT** authentication
- **Pydantic** for data validation
- **CORS** middleware

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
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn
- Docker & Docker Compose (optional)

### Option 1: Manual Setup

#### 1. Database Setup

Navigate to the backend directory and create the SQLite database:

```bash
cd backend
python setup_database.py
```

This will create `sql_runner.db` with sample tables (Customers, Orders, Shippings).

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Option 2: Docker Setup (Recommended)

Simply run from the root directory:

```bash
docker-compose up --build
```

This will:
- Build and start both frontend and backend containers
- Set up the database automatically
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

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

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token

### Query Execution
- `POST /api/query/execute` - Execute SQL query
- `GET /api/query/history` - Get user's query history

### Table Information
- `GET /api/tables` - List all available tables
- `GET /api/tables/{table_name}` - Get table schema and sample data

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

## Troubleshooting

### Database Issues
- Ensure `sql_runner.db` exists in the backend directory
- Run `python setup_database.py` to recreate the database

### Port Conflicts
- Backend default port: 8000
- Frontend default port: 3000
- Modify ports in `docker-compose.yml` or startup commands if needed

### CORS Errors
- Ensure backend CORS settings include your frontend URL
- Check that `NEXT_PUBLIC_API_URL` points to the correct backend URL

## License

MIT License - feel free to use this project for learning and development.

## Author

Built as a full-stack development assignment demonstrating modern web development practices.
