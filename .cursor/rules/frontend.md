# Frontend Best Practices

## General Guidelines

- Use TypeScript for all new files
- Maintain strict typing - avoid using `any`
- Keep components small and focused on a single responsibility
- Implement responsive design for all UI components
- Support dark mode using Tailwind's dark mode utilities

## Code Organization

- Follow a feature-based approach to organizing code:
  - Group related components, hooks, and utilities together
  - Use barrel exports (index.ts files) for cleaner imports

## React Patterns

- Use functional components with hooks instead of class components
- Use custom hooks to abstract complex logic
- Use the context API for app-wide state that is accessed by many components
- Implement lazy loading for routes to improve initial load time
- Use React Router for navigation

## Performance

- Memoize expensive computations using `useMemo`
- Optimize render performance with `React.memo` when appropriate
- Use `useCallback` for event handlers passed to child components
- Implement virtualization for long lists (react-window, react-virtualized)

## State Management

- Use local state for component-specific state
- Use context API for simple global state
- Consider implementing a custom hook for access to Supabase

## Tailwind CSS Usage

- Use Tailwind's utility classes directly in components
- Create reusable component classes in index.css for common patterns
- Follow the Tailwind color palette for consistency
- Use the `@layer` directive to organize custom styles

## Accessibility

- All images must have alt text
- Use semantic HTML elements (e.g., `<button>`, `<a>`, `<nav>`)
- Ensure keyboard navigability for all interactions
- Maintain proper heading hierarchy
- Use ARIA attributes when necessary

## Error Handling

- Implement error boundaries to prevent the entire app from crashing
- Display user-friendly error messages
- Log errors to the console in development 