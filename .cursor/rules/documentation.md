# Documentation Rules

## README Files

- Provide a clear and concise README.md at the root of the project
- Include the following sections in the main README:
  - Project description and purpose
  - Features and capabilities
  - Installation and setup instructions
  - Usage examples
  - Technology stack
  - Project structure
  - Contributing guidelines
  - License information

- Add README.md files to major directories explaining their purpose and organization

## Code Documentation

### TypeScript/JavaScript

- Use JSDoc comments for functions, classes, and interfaces
- Document parameters, return values, and thrown exceptions
- Include example usage for complex functions or components

Example:
```typescript
/**
 * Calculates the next review date using the spaced repetition algorithm.
 * 
 * @param easeFactor - The current ease factor
 * @param interval - The current interval in days
 * @param solved - Whether the puzzle was solved correctly
 * @returns A tuple containing the next review date, new ease factor, and new interval
 * 
 * @example
 * const [nextDate, newEaseFactor, newInterval] = calculateNextReview(2.5, 1, true);
 */
function calculateNextReview(
  easeFactor: number,
  interval: number,
  solved: boolean
): [Date, number, number] {
  // Implementation
}
```

### Python

- Use docstrings for modules, classes, and functions
- Follow the Google Python Style Guide for docstring format
- Document parameters, return values, and raised exceptions

Example:
```python
def calculate_next_review(ease_factor: float, interval: int, solved: bool) -> Tuple[date, float, int]:
    """
    Calculate the next review date using the spaced repetition algorithm.
    
    Args:
        ease_factor: The current ease factor
        interval: The current interval in days
        solved: Whether the puzzle was solved correctly
        
    Returns:
        A tuple containing:
        - next_review_date: The next date to review
        - new_ease_factor: The updated ease factor
        - new_interval: The updated interval in days
        
    Raises:
        ValueError: If ease_factor is less than 1.3 or interval is negative
    """
    # Implementation
```

## API Documentation

- Document all API endpoints with:
  - Description of the endpoint's purpose
  - HTTP method and URL pattern
  - Request parameters, body schema, and headers
  - Response schema and status codes
  - Authentication requirements
  - Example requests and responses

- Use OpenAPI/Swagger for automatic API documentation
- Keep API documentation in sync with implementation

## Component Documentation

- Document React components with:
  - Component purpose and usage
  - Props interface with descriptions
  - State management approach
  - Side effects and interactions
  - Example usage

Example:
```typescript
/**
 * ChessBoard component displays an interactive chess board for puzzle solving.
 * 
 * @component
 * @example
 * ```tsx
 * <ChessBoard
 *   fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
 *   onMove={(from, to) => console.log(`Move from ${from} to ${to}`)}
 *   orientation="white"
 * />
 * ```
 */
```

## Documentation Maintenance

- Update documentation when code changes
- Review documentation periodically for accuracy
- Remove outdated documentation

## Style Guidelines

- Use clear and concise language
- Use consistent terminology throughout the documentation
- Format code examples with appropriate syntax highlighting
- Include diagrams for complex processes or architecture
- Use numbered steps for sequential instructions
- Use bullet points for lists and options

## Markdown Best Practices

- Use proper heading hierarchy (# for main title, ## for sections, etc.)
- Use code blocks with language specifiers
- Use tables for structured data
- Use relative links for cross-references within the repository
- Include screenshots or diagrams when helpful 