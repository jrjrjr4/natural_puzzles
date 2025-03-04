# Backend Best Practices

## Code Style & Structure

- Follow PEP 8 guidelines for Python code
- Use 4 spaces for indentation
- Use explicit imports, avoid `import *` 
- Keep functions and methods small and focused

## FastAPI Patterns

- Use dependency injection for common dependencies
- Implement proper type annotations for all parameters and return values
- Use Pydantic models for request/response validation
- Organize API endpoints by domain in separate router modules
- Utilize Path, Query, and Body parameters appropriately

## Error Handling

- Use custom exception classes that inherit from HTTPException
- Return appropriate HTTP status codes
- Include descriptive error messages and error codes
- Implement global exception handlers

## Database Access

- Use asynchronous database access with connection pooling
- Separate database access logic from route handlers
- Implement transactions for operations that modify multiple records
- Use indices for frequently queried fields

## Authentication & Security

- Validate JWT tokens for protected endpoints
- Implement role-based access control
- Store sensitive information in environment variables
- Do not hardcode secrets in the codebase
- Validate all user input through Pydantic models

## Performance

- Use asynchronous endpoints with `async def`
- Implement caching for expensive operations
- Optimize database queries to minimize round trips
- Limit the size of responses through pagination
- Use proper JSON serialization/deserialization

## Logging

- Log all errors and exceptions
- Include request IDs in logs for traceability
- Use structured logging
- Configure different log levels for different environments

## Testing

- Write unit tests for all service functions
- Write integration tests for API endpoints
- Mock external dependencies in tests
- Use pytest fixtures for common test setup 