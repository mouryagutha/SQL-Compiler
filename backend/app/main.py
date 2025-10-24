"""
FastAPI main application
SQL Runner backend with authentication and query execution
"""
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
import time
from typing import List

from app.models import (
    UserSignup, UserLogin, Token, QueryRequest, QueryResponse,
    TableInfo, TableList, QueryHistoryResponse, QueryHistory
)
from app.database import (
    execute_query, get_table_names, get_table_info,
    create_user, get_user_by_username, save_query_history,
    get_user_query_history
)
from app.auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create FastAPI application
app = FastAPI(
    title="SQL Runner API",
    description="Backend API for SQL query execution and table exploration",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",  # Vite dev server
        "https://sql-compiler-y7zn.vercel.app",  # Your actual Vercel frontend
        "https://sql-compiler-frontend.vercel.app",  # Alternative frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SQL Runner API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/api/auth/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup):
    """
    Create a new user account
    """
    # Check if user already exists
    existing_user = get_user_by_username(user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user_id = create_user(user_data.username, user_data.email, hashed_password)
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id, "username": user_data.username},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user_data.username
    }


@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """
    Login with username and password
    """
    # Get user from database
    user = get_user_by_username(user_data.username)
    
    if not user or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"], "username": user["username"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user["username"]
    }


# ============================================================================
# Query Execution Endpoints
# ============================================================================

@app.post("/api/query/execute", response_model=QueryResponse)
async def execute_sql_query(
    query_request: QueryRequest
):
    """
    Execute a SQL query and return results
    No authentication required (using Firebase on frontend)
    """
    try:
        query = query_request.query.strip()
        
        # Prevent dangerous operations on system tables
        dangerous_keywords = ["DROP TABLE users", "DROP TABLE query_history", "DELETE FROM users", "DELETE FROM query_history"]
        query_upper = query.upper()
        for keyword in dangerous_keywords:
            if keyword in query_upper:
                error_msg = "Operation not allowed on system tables"
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=error_msg
                )
        
        # Execute query and measure time
        start_time = time.time()
        success, data, error, columns = execute_query(query)
        execution_time = time.time() - start_time
        
        # Note: Query history is now stored on frontend with Firebase
        
        if success:
            return {
                "success": True,
                "data": data,
                "columns": columns,
                "row_count": len(data) if data else 0,
                "execution_time": round(execution_time, 3)
            }
        else:
            return {
                "success": False,
                "error": error,
                "execution_time": round(execution_time, 3)
            }
    except Exception as e:
        # Catch any unexpected errors to prevent crashes
        return {
            "success": False,
            "error": f"Server error: {str(e)}",
            "execution_time": 0
        }


@app.get("/api/query/history", response_model=QueryHistoryResponse)
async def get_query_history(
    limit: int = 20,
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's query execution history
    Requires authentication
    """
    history = get_user_query_history(current_user["id"], limit)
    
    queries = [
        QueryHistory(
            id=item["id"],
            query=item["query"],
            executed_at=item["executed_at"],
            success=item["success"],
            error_message=item["error_message"]
        )
        for item in history
    ]
    
    return {"queries": queries}


# ============================================================================
# Table Information Endpoints
# ============================================================================

@app.get("/api/tables", response_model=TableList)
async def list_tables(current_user: dict = Depends(get_current_user)):
    """
    Get list of all available database tables
    Requires authentication
    """
    tables = get_table_names()
    return {"tables": tables}


@app.get("/api/tables/{table_name}", response_model=TableInfo)
async def get_table_details(
    table_name: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get table schema and sample data
    Requires authentication
    """
    table_info = get_table_info(table_name)
    
    if table_info is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Table '{table_name}' not found"
        )
    
    return table_info


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
