"""
Database setup script for SQL Runner
Creates SQLite database with sample tables and data
"""
import sqlite3
import os

DATABASE_URL = 'sql_runner.db'

def setup_database():
    """Create database and populate with sample data"""
    
    try:
        # Remove existing database if it exists
        if os.path.exists(DATABASE_URL):
            os.remove(DATABASE_URL)
            print(f"Removed existing database: {DATABASE_URL}")
        
        # Create new database connection
        conn = sqlite3.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print(f"Creating database: {DATABASE_URL}")
        print(f"Current directory: {os.getcwd()}")
        print(f"Database will be created at: {os.path.abspath(DATABASE_URL)}")
        
        # Create Customers table
        cursor.execute("""
            CREATE TABLE Customers (
                customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                age INTEGER,
                country VARCHAR(100)
            )
        """)
        print("✓ Created Customers table")
        
        # Insert sample data into Customers
        cursor.executemany("""
            INSERT INTO Customers (first_name, last_name, age, country)
            VALUES (?, ?, ?, ?)
        """, [
            ('John', 'Doe', 30, 'USA'),
            ('Robert', 'Luna', 22, 'USA'),
            ('David', 'Robinson', 25, 'UK'),
            ('John', 'Reinhardt', 22, 'UK'),
            ('Betty', 'Doe', 28, 'UAE')
        ])
        print("✓ Inserted sample data into Customers")
        
        # Create Orders table
        cursor.execute("""
            CREATE TABLE Orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                item VARCHAR(100),
                amount INTEGER,
                customer_id INTEGER,
                FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
            )
        """)
        print("✓ Created Orders table")
        
        # Insert sample data into Orders
        cursor.executemany("""
            INSERT INTO Orders (item, amount, customer_id)
            VALUES (?, ?, ?)
        """, [
            ('Keyboard', 400, 4),
            ('Mouse', 300, 4),
            ('Monitor', 12000, 3),
            ('Keyboard', 400, 1),
            ('Mousepad', 250, 2)
        ])
        print("✓ Inserted sample data into Orders")
        
        # Create Shippings table
        cursor.execute("""
            CREATE TABLE Shippings (
                shipping_id INTEGER PRIMARY KEY AUTOINCREMENT,
                status VARCHAR(100),
                customer INTEGER
            )
        """)
        print("✓ Created Shippings table")
        
        # Insert sample data into Shippings
        cursor.executemany("""
            INSERT INTO Shippings (status, customer)
            VALUES (?, ?)
        """, [
            ('Pending', 2),
            ('Pending', 4),
            ('Delivered', 3),
            ('Pending', 5),
            ('Delivered', 1)
        ])
        print("✓ Inserted sample data into Shippings")
        
        # Create users table for authentication
        cursor.execute("""
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✓ Created users table")
        
        # Create query_history table
        cursor.execute("""
            CREATE TABLE query_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                query TEXT NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                success BOOLEAN NOT NULL,
                error_message TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        print("✓ Created query_history table")
        
        # Commit changes and close connection
        conn.commit()
        conn.close()
        
        print(f"\n✅ Database setup complete!")
        print(f"Database file: {os.path.abspath(DATABASE_URL)}")
        print(f"\nAvailable tables:")
        print("  - Customers (5 rows)")
        print("  - Orders (5 rows)")
        print("  - Shippings (5 rows)")
        print("  - users (for authentication)")
        print("  - query_history (for tracking queries)")
        
    except Exception as e:
        print(f"\n❌ Database setup failed!")
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    setup_database()
