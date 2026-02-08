---
name: frontend-skill
description: Build frontend pages, reusable components, layouts, and styling for modern web applications using Next.js.
---

# Frontend Skill

## Instructions

### 1. Page structure
- Build application pages using Next.js App Router
- Define route-based pages (e.g., login, signup, tasks)
- Separate public and authenticated pages
- Use layout files to share common UI structure

### 2. Layout and composition
- Create shared layouts (header, footer, navigation)
- Organize content using responsive containers
- Ensure consistent spacing and alignment
- Support mobile, tablet, and desktop screen sizes
- Maintain consistent spacing, colors, and typography

### 3. Component design
- Build reusable UI components (navbar, cards, footer, buttons, inputs, modals, etc.)
- Keep components small and focused on a single responsibility
- Pass data via props and manage local state where needed
- Separate presentational components from logic-heavy components

### 4. Styling
- Style components using CSS Modules, Tailwind CSS, or styled components
- Maintain consistent color, typography, and spacing systems
- Follow a defined design system
- Use utility classes or design tokens where applicable
- Ensure accessibility-friendly contrast and font sizes

### 5. Client-side behavior
- Handle user interactions (clicks, forms, navigation)
- Manage loading, error, and empty states
- Connect components to backend APIs via fetch or client utilities
- Reflect backend state changes accurately in the UI

## Best Practices
- Follow mobile-first and responsive design principles
- Keep UI logic simple and predictable
- Avoid duplicating styles and components
- Use semantic HTML elements where possible
- Ensure accessibility (labels, keyboard navigation, ARIA where needed)

## Example Structure
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>App Header</header>
        <main>{children}</main>
      </body>
    </html>
  );
}
