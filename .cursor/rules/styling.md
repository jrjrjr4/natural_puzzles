# CSS & Styling Rules

## Tailwind CSS Usage

- Use Tailwind CSS utility classes for styling components
- Follow a consistent order for utility classes:
  1. Layout (display, position, width, height, etc.)
  2. Typography (text color, font size, font weight, etc.)
  3. Spacing (margin, padding)
  4. Visual (background, border, shadow, etc.)
  5. Interactive (hover, focus, etc.)

Example:
```html
<!-- Good: Organized by category -->
<div class="flex items-center justify-between p-4 text-sm font-medium text-gray-800 bg-white rounded-md shadow-sm hover:bg-gray-50">
  <!-- Content -->
</div>
```

## Custom Utility Classes

- Define reusable utility classes in index.css using `@layer components`
- Use descriptive class names that indicate purpose
- Document class variants and parameters

Example:
```css
@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }
}
```

## Dark Mode

- Support dark mode using Tailwind's `dark:` variant
- Provide dark mode alternatives for all color-based styles
- Test all components in both light and dark mode

Example:
```html
<div class="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
  <!-- Content -->
</div>
```

## Color Usage

- Use Tailwind's color palette for consistency
- Define custom colors in the tailwind.config.js file
- Use semantic color naming in the theme configuration
- Use color variants consistently (e.g., primary-500 for main color, primary-600 for hover)

Example:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ...other shades
          600: '#0284c7',
          700: '#0369a1',
        },
      },
    },
  },
}
```

## Responsive Design

- Design for mobile-first, then add styles for larger screens
- Use Tailwind's responsive variants (sm:, md:, lg:, xl:) for breakpoint-specific styles
- Test all components at various screen sizes

Example:
```html
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/2">
    <!-- Content -->
  </div>
  <div class="w-full md:w-1/2">
    <!-- Content -->
  </div>
</div>
```

## Animation and Transitions

- Use Tailwind's transition utilities for simple animations
- Define custom animations in the tailwind.config.js file for more complex cases
- Ensure animations are subtle and enhance the user experience
- Respect user preferences for reduced motion

Example:
```html
<button class="transition-colors duration-200 ease-in-out hover:bg-gray-100">
  Click me
</button>
```

## Layout and Spacing

- Use a consistent spacing scale based on Tailwind's defaults
- Prefer flexbox and grid for layout
- Use semantic layout elements (header, main, footer, etc.)
- Maintain proper content hierarchy

## CSS Custom Properties

- Use CSS custom properties for values that need to be shared across components
- Define global custom properties in the `:root` selector
- Use descriptive names with appropriate namespacing

Example:
```css
:root {
  --chess-light-square: #f0d9b5;
  --chess-dark-square: #b58863;
}

.chess-board {
  --square-size: 2.5rem;
}
```

## CSS Organization

- Use CSS modules or Tailwind for component-specific styles
- Avoid global styles except for base styles and typography
- Organize CSS files to mirror the component structure

## Best Practices

- Avoid using `!important` except in rare cases
- Minimize the use of absolute positioning
- Use logical properties (e.g., `margin-inline-start` instead of `margin-left`) when appropriate
- Test styles across different browsers 