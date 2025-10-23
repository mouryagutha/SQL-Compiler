#!/bin/bash

# Create database if it doesn't exist
python setup_database.py

# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
