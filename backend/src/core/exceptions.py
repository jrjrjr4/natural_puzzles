from fastapi import HTTPException, status
from typing import Any, Dict, Optional


class ChessPuzzleException(HTTPException):
    """Base exception for Chess Puzzle API."""
    
    def __init__(
        self,
        status_code: int,
        detail: Any = None,
        headers: Optional[Dict[str, Any]] = None,
        error_code: str = "CHESS_PUZZLE_ERROR"
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code


class NotFoundException(ChessPuzzleException):
    """Exception raised when a resource is not found."""
    
    def __init__(
        self,
        detail: str = "Resource not found",
        headers: Optional[Dict[str, Any]] = None,
        error_code: str = "NOT_FOUND"
    ):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            headers=headers,
            error_code=error_code
        )


class UnauthorizedException(ChessPuzzleException):
    """Exception raised when a user is not authorized."""
    
    def __init__(
        self,
        detail: str = "Not authorized",
        headers: Optional[Dict[str, Any]] = None,
        error_code: str = "UNAUTHORIZED"
    ):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers=headers or {"WWW-Authenticate": "Bearer"},
            error_code=error_code
        )


class ForbiddenException(ChessPuzzleException):
    """Exception raised when a user is forbidden from accessing a resource."""
    
    def __init__(
        self,
        detail: str = "Forbidden",
        headers: Optional[Dict[str, Any]] = None,
        error_code: str = "FORBIDDEN"
    ):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            headers=headers,
            error_code=error_code
        )


class BadRequestException(ChessPuzzleException):
    """Exception raised when a request is invalid."""
    
    def __init__(
        self,
        detail: str = "Bad request",
        headers: Optional[Dict[str, Any]] = None,
        error_code: str = "BAD_REQUEST"
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            headers=headers,
            error_code=error_code
        )


class ValidationException(BadRequestException):
    """Exception raised when validation fails."""
    
    def __init__(
        self,
        detail: str = "Validation error",
        headers: Optional[Dict[str, Any]] = None,
        error_code: str = "VALIDATION_ERROR"
    ):
        super().__init__(
            detail=detail,
            headers=headers,
            error_code=error_code
        )


class DatabaseException(ChessPuzzleException):
    """Exception raised when a database operation fails."""
    
    def __init__(
        self,
        detail: str = "Database error",
        headers: Optional[Dict[str, Any]] = None,
        error_code: str = "DATABASE_ERROR"
    ):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            headers=headers,
            error_code=error_code
        )


class ExternalServiceException(ChessPuzzleException):
    """Exception raised when an external service fails."""
    
    def __init__(
        self,
        detail: str = "External service error",
        headers: Optional[Dict[str, Any]] = None,
        error_code: str = "EXTERNAL_SERVICE_ERROR"
    ):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail,
            headers=headers,
            error_code=error_code
        ) 