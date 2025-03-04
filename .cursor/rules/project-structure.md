# Project Structure Rules

## Directory Organization

- **Monorepo Structure**: Maintain clear separation between frontend and backend code.
  - `/frontend` - React application code
  - `/backend` - FastAPI server code
  - Root directory should only contain config files and documentation

## File Naming Conventions

- Use `kebab-case` for directories and files in the frontend
- Use `snake_case` for directories and files in the backend Python code
- Keep filenames descriptive but concise
- Component files should be named with PascalCase (e.g., `ChessBoard.tsx`)

## Module Organization

- Group related functionality in modules
- Backend modules should follow domain-driven design:
  - `/auth` - Authentication related code
  - `/puzzles` - Chess puzzle related code
  - `/user_progress` - User progress tracking
  - `/core` - Core application code
  - `/utils` - Utility functions

## Configuration Files

- Configuration files should be at the root of their respective project directories
- Environment variables should be documented in a `.env.example` file
- Do not commit `.env` files to the repository

## Asset Organization

- Frontend assets should be organized by type:
  - `/public` - Static files
  - `/src/assets` - Images, icons, and other assets
  - `/src/styles` - Global styles and themes

## Documentation

- Each major directory should have a README.md explaining its purpose
- API endpoints should be documented with OpenAPI 