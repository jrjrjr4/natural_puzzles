# Testing Rules

## General Guidelines

- Write tests for all new features
- Aim for high test coverage (>80%)
- Tests should be independent and idempotent
- Keep tests fast and focused
- Follow the AAA pattern: Arrange, Act, Assert

## Frontend Testing

### Unit Tests

- Use Jest and React Testing Library
- Test components in isolation
- Mock external dependencies and API calls
- Focus on behavior, not implementation details
- Write descriptive test names that explain the expected behavior

Example:
```typescript
describe('PuzzleComponent', () => {
  test('displays loading state when puzzle is being fetched', () => {
    // Arrange
    const { getByTestId } = render(<PuzzleComponent isLoading={true} />);
    
    // Act
    const loadingElement = getByTestId('loading-spinner');
    
    // Assert
    expect(loadingElement).toBeInTheDocument();
  });
});
```

### Integration Tests

- Test interactions between components
- Test form submissions and user flows
- Use `userEvent` for simulating user interactions

Example:
```typescript
test('submits form with user input when Sign In button is clicked', async () => {
  // Arrange
  const handleSubmit = jest.fn();
  const { getByLabelText, getByRole } = render(<LoginForm onSubmit={handleSubmit} />);
  
  // Act
  await userEvent.type(getByLabelText(/email/i), 'user@example.com');
  await userEvent.type(getByLabelText(/password/i), 'password123');
  await userEvent.click(getByRole('button', { name: /sign in/i }));
  
  // Assert
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'user@example.com',
    password: 'password123'
  });
});
```

## Backend Testing

### Unit Tests

- Use pytest for Python code
- Test service functions in isolation
- Mock database and external dependencies
- Test edge cases and error handling

Example:
```python
def test_calculate_next_review():
    # Arrange
    current_ease_factor = 2.5
    current_interval = 1
    solved = True
    
    # Act
    next_date, new_ease_factor, new_interval = calculate_next_review(
        current_ease_factor, current_interval, solved
    )
    
    # Assert
    assert new_ease_factor > current_ease_factor
    assert new_interval > current_interval
    assert next_date > datetime.now().date()
```

### API Tests

- Test API endpoints using FastAPI's TestClient
- Verify status codes, response body, and headers
- Test authentication and authorization
- Cover both successful and error scenarios

Example:
```python
def test_create_puzzle_returns_201():
    # Arrange
    client = TestClient(app)
    test_puzzle = {
        "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "solution_moves": "e2e4",
        "difficulty": 1200,
        "themes": ["opening"]
    }
    
    # Act
    response = client.post("/puzzles/", json=test_puzzle)
    
    # Assert
    assert response.status_code == 201
    assert "id" in response.json()
```

## Test Organization

- Group tests by feature or module
- Name test files with a `_test` or `.test` suffix
- Use descriptive test function names
- Organize tests in a structure that mirrors the application code

## Test Data

- Use fixtures for common test data
- Avoid hardcoding test data when possible
- Create helper functions for generating test data

## Mock Guidelines

- Only mock external dependencies
- Don't mock the system under test
- Use explicit mock returns instead of wildcard matchers
- Reset mocks between tests 