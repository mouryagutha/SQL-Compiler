"""
Database connection and query execution utilities
"""
import sqlite3
from typing import List, Dict, Any, Optional, Tuple
from contextlib import contextmanager
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'sql_runner.db')


def ensure_database_exists():
    """Ensure database file exists and is initialized with tables"""
    needs_setup = False
    
    # Check if database file exists
    if not os.path.exists(DATABASE_URL):
        needs_setup = True
        print(f"Database file not found, will create at {DATABASE_URL}")
    else:
        # Check if tables exist
        conn = sqlite3.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Customers'")
        if not cursor.fetchone():
            needs_setup = True
            print("Database exists but Customers table not found, will reinitialize")
        conn.close()
    
    # Run setup if needed
    if needs_setup:
        print("Running database setup...")
        import setup_database
        setup_database.setup_database()
        print("Database setup completed")


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    ensure_database_exists()
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row  # Access columns by name
    try:
        yield conn
    finally:
        conn.close()


def execute_query(query: str) -> Tuple[bool, Optional[List[Dict[str, Any]]], Optional[str], Optional[List[str]]]:
    """
    Execute a SQL query and return results
    
    Returns:
        Tuple of (success, data, error_message, columns)
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute(query)
            
            # Check if query returns data (SELECT)
            if cursor.description:
                columns = [desc[0] for desc in cursor.description]
                results = cursor.fetchall()
                data = [dict(row) for row in results]
                conn.commit()
                return True, data, None, columns
            else:
                # For INSERT, UPDATE, DELETE
                conn.commit()
                affected_rows = cursor.rowcount
                return True, [{"affected_rows": affected_rows}], None, ["affected_rows"]
                
        except sqlite3.Error as e:
            return False, None, str(e), None


def get_table_names() -> List[str]:
    """Get list of all tables in the database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' 
            AND name NOT LIKE 'sqlite_%'
            AND name NOT IN ('users', 'query_history')
            ORDER BY name
        """)
        tables = [row[0] for row in cursor.fetchall()]
        return tables


def get_table_info(table_name: str) -> Optional[Dict[str, Any]]:
    """
    Get table schema and sample data
    
    Returns:
        Dictionary with columns, sample_data, and row_count
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            # Get column information
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = [
                {
                    "name": row[1],
                    "type": row[2],
                    "nullable": not row[3],
                    "primary_key": bool(row[5])
                }
                for row in cursor.fetchall()
            ]
            
            # Get sample data (first 5 rows)
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
            sample_data = [dict(row) for row in cursor.fetchall()]
            
            # Get total row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            row_count = cursor.fetchone()[0]
            
            return {
                "table_name": table_name,
                "columns": columns,
                "sample_data": sample_data,
                "row_count": row_count
            }
        except sqlite3.Error as e:
            return None


def save_query_history(user_id: int, query: str, success: bool, error_message: Optional[str] = None):
    """Save query execution to history"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO query_history (user_id, query, success, error_message)
            VALUES (?, ?, ?, ?)
        """, (user_id, query, success, error_message))
        conn.commit()


def get_user_query_history(user_id: int, limit: int = 20) -> List[Dict[str, Any]]:
    """Get user's query history"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, query, executed_at, success, error_message
            FROM query_history
            WHERE user_id = ?
            ORDER BY executed_at DESC
            LIMIT ?
        """, (user_id, limit))
        
        history = []
        for row in cursor.fetchall():
            history.append({
                "id": row[0],
                "query": row[1],
                "executed_at": row[2],
                "success": bool(row[3]),
                "error_message": row[4]
            })
        return history


def create_user(username: str, email: str, hashed_password: str) -> Optional[int]:
    """Create a new user"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO users (username, email, hashed_password)
                VALUES (?, ?, ?)
            """, (username, email, hashed_password))
            conn.commit()
            return cursor.lastrowid
        except sqlite3.IntegrityError:
            return None


def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    """Get user by username"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, username, email, hashed_password, created_at
            FROM users
            WHERE username = ?
        """, (username,))
        row = cursor.fetchone()
        if row:
            return {
                "id": row[0],
                "username": row[1],
                "email": row[2],
                "hashed_password": row[3],
                "created_at": row[4]
            }
        return None


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, username, email, created_at
            FROM users
            WHERE id = ?
        """, (user_id,))
        row = cursor.fetchone()
        if row:
            return {
                "id": row[0],
                "username": row[1],
                "email": row[2],
                "created_at": row[3]
            }
        return None
