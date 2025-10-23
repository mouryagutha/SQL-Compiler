# Quick Setup Guide

## Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

## Quick Start

### 1. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create database
python setup_database.py

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local

# Run frontend
npm run dev
```

Frontend will be available at: http://localhost:3000

### 3. Using Docker (Easiest)

```bash
# From root directory
docker-compose up --build
```

This will start both frontend and backend automatically.

## Default Test Account

You can create a new account or use these test credentials once you create them:
- Username: demo
- Password: demo123

## Troubleshooting

### Frontend Issues
If you see TypeScript errors, run:
```bash
cd frontend
npm install
```

### Backend Issues
If database doesn't exist:
```bash
cd backend
python setup_database.py
```

### Port Conflicts
- Backend uses port 8000
- Frontend uses port 3000
- Change ports in respective configuration files if needed
