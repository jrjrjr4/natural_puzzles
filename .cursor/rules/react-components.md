# React Component Rules

## Component Structure

- Use functional components with hooks
- Each component should be in its own file
- Export components as named exports, not default exports
- Group related components in feature-based directories

## Component Naming

- Use PascalCase for component names (e.g., `ChessBoard.tsx`)
- Use descriptive names that indicate the component's purpose
- Prefix custom hooks with "use" (e.g., `useChessGame.ts`)

## Props

- Define prop types using TypeScript interfaces
- Use explicit prop destructuring in function parameters
- Provide default values for optional props
- Document props with JSDoc comments

Example:
```tsx
interface ButtonProps {
  /** The text to display on the button */
  label: string;
  /** Called when the button is clicked */
  onClick: () => void;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** The variant of the button */
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({
  label,
  onClick,
  isLoading = false,
  variant = 'primary',
}: ButtonProps) {
  // Component implementation
}
```

## State Management

- Keep state as close as possible to where it's used
- Use the appropriate hooks based on the type of state:
  - `useState` for simple state
  - `useReducer` for complex state logic
  - `useContext` for global state

## Event Handlers

- Prefix event handler functions with "handle" (e.g., `handleClick`)
- Use `useCallback` for event handlers passed to child components
- Define event handlers above the return statement

## Component Organization

Order component internals as follows:
1. Import statements
2. Interface/type definitions
3. Component function
4. State declarations
5. Effect hooks
6. Event handlers and other functions
7. JSX return statement
8. Export statement

## JSX Style

- Use self-closing tags for elements without children (`<img />`)
- Use fragment shorthand (`<>...</>`) when possible
- Break JSX onto multiple lines for readability when it gets complex
- Add a space before self-closing brackets (`<Component />`)

## Conditional Rendering

- Use ternary operators for simple conditions
- Extract complex conditional logic into variables or functions
- Use the logical AND operator (`&&`) for simple "if" conditions

## CSS/Styling

- Use Tailwind CSS utility classes for styling
- Group related Tailwind classes together
- Extract common class combinations into custom utility classes in index.css
- Use a consistent order for Tailwind classes (layout, typography, visual, interactive)

## Testing

- Each component should have associated tests
- Test component rendering and interactions
- Use React Testing Library for component tests 