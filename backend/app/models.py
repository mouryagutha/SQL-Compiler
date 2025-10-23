"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


class UserSignup(BaseModel):
    """User signup request model"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """User login request model"""
    username: str
    password: str


class Token(BaseModel):
    """JWT token response model"""
    access_token: str
    token_type: str = "bearer"
    username: str


class User(BaseModel):
    """User response model"""
    id: int
    username: str
    email: str
    created_at: datetime


class QueryRequest(BaseModel):
    """SQL query execution request"""
    query: str = Field(..., min_length=1)


class QueryResponse(BaseModel):
    """SQL query execution response"""
    success: bool
    data: Optional[List[Dict[str, Any]]] = None
    columns: Optional[List[str]] = None
    row_count: Optional[int] = None
    error: Optional[str] = None
    execution_time: Optional[float] = None


class TableInfo(BaseModel):
    """Table information response"""
    table_name: str
    columns: List[Dict[str, str]]
    sample_data: List[Dict[str, Any]]
    row_count: int


class TableList(BaseModel):
    """List of available tables"""
    tables: List[str]


class QueryHistory(BaseModel):
    """Query history item"""
    id: int
    query: str
    executed_at: datetime
    success: bool
    error_message: Optional[str] = None


class QueryHistoryResponse(BaseModel):
    """Query history response"""
    queries: List[QueryHistory]
