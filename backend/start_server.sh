#!/bin/bash
set -e

echo "=========================================="
echo "Starting SQL Runner Backend"
echo "=========================================="

# Setup database
echo "Running database setup..."
python setup_database.py

# Check if database was created
if [ -f "sql_runner.db" ]; then
    echo "✓ Database file created successfully"
    ls -lh sql_runner.db
else
    echo "✗ ERROR: Database file not found!"
    exit 1
fi

# Start the server
echo "Starting uvicorn server..."
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
