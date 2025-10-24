"""
Startup script for Railway deployment
Ensures database is set up before starting the server
"""
import os
import sys
import subprocess

def main():
    print("=" * 50)
    print("Starting SQL Runner Backend")
    print("=" * 50)
    
    # Check Python version
    print(f"Python version: {sys.version}")
    
    # Check current directory
    print(f"Current directory: {os.getcwd()}")
    print(f"Files in directory: {os.listdir('.')}")
    
    # Set up database
    print("\n" + "=" * 50)
    print("Setting up database...")
    print("=" * 50)
    
    try:
        import setup_database
        setup_database.setup_database()
        print("✓ Database setup completed successfully")
    except Exception as e:
        print(f"⚠ Database setup failed: {e}")
        print("⚠ Continuing anyway - database will be created on first query")
    
    # Check if database exists
    if os.path.exists('sql_runner.db'):
        size = os.path.getsize('sql_runner.db')
        print(f"✓ Database file exists: sql_runner.db ({size} bytes)")
    else:
        print("⚠ Database file not found (will be created on first query)")
    
    # Get port from environment
    port = os.getenv('PORT', '8000')
    print(f"\n" + "=" * 50)
    print(f"Starting server on port {port}")
    print("=" * 50)
    
    # Start uvicorn
    subprocess.run([
        'uvicorn',
        'app.main:app',
        '--host', '0.0.0.0',
        '--port', port
    ])

if __name__ == '__main__':
    main()
