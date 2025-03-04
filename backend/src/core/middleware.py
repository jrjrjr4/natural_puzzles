from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import logging
import time
from uuid import uuid4
from typing import Callable, Dict, Any, Optional
from src.core.exceptions import ChessPuzzleException

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging requests and responses."""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        # Generate request ID
        request_id = str(uuid4())
        
        # Add request ID to request state
        request.state.request_id = request_id
        
        # Log request
        logger.info(
            f"Request {request_id}: {request.method} {request.url.path}"
        )
        
        # Record start time
        start_time = time.time()
        
        try:
            # Process request
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Add custom headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            # Log response
            logger.info(
                f"Response {request_id}: {response.status_code} (took {process_time:.4f}s)"
            )
            
            return response
        except Exception as e:
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log error
            logger.error(
                f"Error {request_id}: {str(e)} (took {process_time:.4f}s)"
            )
            
            # Re-raise exception
            raise


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Middleware for handling exceptions and returning appropriate responses."""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        try:
            return await call_next(request)
        except ChessPuzzleException as e:
            # Handle custom exceptions
            return self._create_error_response(
                status_code=e.status_code,
                error_code=e.error_code,
                detail=e.detail,
                headers=e.headers,
                request_id=getattr(request.state, "request_id", None)
            )
        except Exception as e:
            # Handle unexpected exceptions
            logger.exception(f"Unexpected error: {str(e)}")
            
            return self._create_error_response(
                status_code=500,
                error_code="INTERNAL_SERVER_ERROR",
                detail="An unexpected error occurred",
                request_id=getattr(request.state, "request_id", None)
            )
    
    def _create_error_response(
        self,
        status_code: int,
        error_code: str,
        detail: Any,
        headers: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None
    ) -> JSONResponse:
        """Create a JSON response for an error."""
        content = {
            "error": {
                "code": error_code,
                "detail": detail
            }
        }
        
        if request_id:
            content["error"]["request_id"] = request_id
        
        response = JSONResponse(
            status_code=status_code,
            content=content
        )
        
        if headers:
            for key, value in headers.items():
                response.headers[key] = value
        
        return response 