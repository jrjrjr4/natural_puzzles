# FastAPI Endpoint Rules

## Endpoint Structure

- Group related endpoints in a single router module
- Use descriptive function names for endpoint handlers
- Make endpoint handlers asynchronous with `async def`
- Keep route handlers thin, delegating business logic to service functions

## Route Definitions

- Use consistent URL patterns:
  - Collection routes should be plural nouns (e.g., `/puzzles`)
  - Instance routes should include an ID (e.g., `/puzzles/{puzzle_id}`)
  - Actions should use verbs (e.g., `/puzzles/{puzzle_id}/solve`)
- Use appropriate HTTP methods:
  - GET for retrieving data
  - POST for creating new resources
  - PUT for full updates
  - PATCH for partial updates
  - DELETE for removing resources

## Path Parameters

- Use Path() with validation:
```python
@router.get("/{puzzle_id}")
async def get_puzzle(
    puzzle_id: int = Path(..., ge=1, description="The puzzle ID")
):
    # Handler implementation
```

## Query Parameters

- Use Query() with validation:
```python
@router.get("/")
async def list_puzzles(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    difficulty: Optional[int] = Query(None, description="Filter by difficulty")
):
    # Handler implementation
```

## Request Bodies

- Use Pydantic models for request bodies:
```python
@router.post("/")
async def create_puzzle(
    puzzle: PuzzleCreate,
    current_user: dict = Depends(get_current_user)
):
    # Handler implementation
```

## Response Models

- Define response models with Pydantic:
```python
@router.get("/", response_model=PuzzleList)
async def list_puzzles():
    # Handler implementation
```

- Use appropriate status codes:
```python
@router.post("/", response_model=Puzzle, status_code=status.HTTP_201_CREATED)
async def create_puzzle(puzzle: PuzzleCreate):
    # Handler implementation
```

## Dependency Injection

- Use FastAPI's dependency injection for common dependencies:
```python
@router.get("/{puzzle_id}")
async def get_puzzle(
    puzzle_id: int = Path(..., ge=1),
    current_user: dict = Depends(get_current_user)
):
    # Handler implementation
```

## Error Handling

- Raise HTTPException with appropriate status codes:
```python
if not puzzle:
    raise HTTPException(status_code=404, detail="Puzzle not found")
```

- Use custom exception classes for consistent error responses

## Documentation

- Include descriptions for all endpoints, parameters, and responses:
```python
@router.get("/", response_model=PuzzleList)
async def list_puzzles():
    """
    Get a list of chess puzzles.
    
    Returns paginated results that can be filtered by difficulty and themes.
    """
    # Handler implementation
```

## Authentication & Authorization

- Use dependency injection for authentication:
```python
@router.post("/")
async def create_puzzle(
    puzzle: PuzzleCreate,
    current_user: dict = Depends(get_current_user)
):
    # Verify user has permission to create puzzles
    if not is_admin_user(current_user["id"]):
        raise HTTPException(status_code=403, detail="Not allowed")
    
    # Handler implementation
```

## Testing

- Write tests for all endpoints
- Test happy paths and error cases
- Use FastAPI's TestClient for integration tests 