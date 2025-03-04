# TypeScript Rules

## Type Definitions

- Use TypeScript interfaces and types for all data structures
- Prefer interfaces for object types that can be extended
- Use type aliases for union types, tuples, and primitive types
- Export types and interfaces to be reused across the application
- Use descriptive names for types and interfaces

Example:
```typescript
// Good
interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}

// Good
type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

// Avoid
type Obj = {
  a: string;
  b: number;
};
```

## Type Annotations

- Explicitly type function parameters and return types
- Use type inference for variables when the type is obvious
- Always specify types for arrays and complex objects
- Use generics for reusable components and functions

Example:
```typescript
// Good
function fetchPuzzles(difficulty: PuzzleDifficulty, count: number): Promise<Puzzle[]> {
  // ...
}

// Good
const puzzles: Puzzle[] = [];

// Good - type inference is clear here
const count = 0;
```

## Null and Undefined

- Use optional properties (?) instead of nullable types when possible
- Be explicit about handling null and undefined values
- Use nullish coalescing (??) and optional chaining (?.) operators

Example:
```typescript
// Good
interface User {
  id: string;
  email: string;
  displayName?: string;  // Optional property
}

// Good
const name = user.displayName ?? 'Anonymous';

// Good
const avatarUrl = user?.profile?.avatarUrl;
```

## Enums

- Use string enums for better readability and debugging
- Use const enums for values that are known at compile time

Example:
```typescript
// Good
enum PuzzleTheme {
  Tactic = 'tactic',
  Opening = 'opening',
  Endgame = 'endgame',
  Mate = 'mate',
}

// Good
const enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
```

## Type Assertions

- Avoid type assertions when possible
- If necessary, use the `as` syntax rather than angle brackets
- Never use `as any` except in rare cases where it's unavoidable

Example:
```typescript
// Good
const buttonElement = event.target as HTMLButtonElement;

// Avoid
const buttonElement = <HTMLButtonElement>event.target;

// Bad
const data = result as any;
```

## Function Types

- Use arrow function syntax for function types
- Specify parameter names for better readability

Example:
```typescript
// Good
type ClickHandler = (event: React.MouseEvent) => void;

// Good
interface PuzzleService {
  getPuzzle: (id: number) => Promise<Puzzle>;
  solvePuzzle: (id: number, moves: string[]) => Promise<boolean>;
}
```

## Generics

- Use generics to create reusable components and functions
- Use descriptive names for generic type parameters (e.g., T, U, V for simple cases, or more descriptive names for complex cases)
- Constrain generic types when needed

Example:
```typescript
// Good
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Good
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

## Imports and Exports

- Use named exports instead of default exports
- Group and organize imports by source
- Use absolute imports for modules from other directories
- Use relative imports for modules in the same directory

## Type Guards

- Use type guards to narrow types in conditional blocks
- Create custom type guards using type predicates when needed

Example:
```typescript
// Good
function isPuzzle(obj: any): obj is Puzzle {
  return obj && typeof obj.fen === 'string' && typeof obj.solution_moves === 'string';
}

// Usage
if (isPuzzle(data)) {
  // TypeScript knows data is Puzzle here
  console.log(data.fen);
}
```

## Utility Types

- Use TypeScript's built-in utility types:
  - `Partial<T>` for objects where all properties are optional
  - `Required<T>` for objects where all properties are required
  - `Pick<T, K>` to select specific properties from an interface
  - `Omit<T, K>` to create a type without specific properties
  - `Record<K, T>` for objects with a specific key type and value type

Example:
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
}

// Type for updating user profile
type UserProfileUpdate = Partial<Omit<User, 'id'>>;

// Type for user stats by category
type UserStatsByCategory = Record<string, number>;
``` 