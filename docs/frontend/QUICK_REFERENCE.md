# TaskFlow UI Quick Reference Guide

## Common Utility Classes

### Buttons
```jsx
// Primary action button
<button className="btn-primary">Submit</button>

// Secondary action button
<button className="btn-secondary">Cancel</button>

// Danger/destructive action
<button className="btn-danger">Delete</button>
```

### Cards
```jsx
// Standard card
<div className="card p-6">Content</div>

// Card with hover effect
<div className="card card-hover p-6">Content</div>

// Glassmorphism card
<div className="glass-card p-8 rounded-3xl">Content</div>
```

### Form Inputs
```jsx
// Text input
<input type="text" className="input-field" placeholder="Enter text" />

// Textarea
<textarea className="input-field resize-none" rows={4}></textarea>

// Label
<label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
  Label Text
</label>
```

## Color Reference

### Primary (Blue) - Use for primary actions and brand elements
- `bg-primary-500` - Base color
- `bg-primary-600` - Buttons, links
- `text-primary-600` - Text links
- `border-primary-500` - Focus states

### Accent (Purple) - Use for secondary accents and variety
- `bg-accent-500` - Accent elements
- `bg-accent-600` - Accent buttons
- `text-accent-600` - Accent text

### Gradients
```jsx
// Primary gradient
className="bg-gradient-to-r from-primary-600 to-accent-600"

// Background gradient (light mode)
className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"

// Background gradient (dark mode)
className="dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950"
```

### Text Colors
```jsx
// Primary text
className="text-slate-900 dark:text-white"

// Secondary text
className="text-slate-600 dark:text-slate-300"

// Tertiary text
className="text-slate-500 dark:text-slate-400"

// Muted text
className="text-slate-400 dark:text-slate-500"
```

### Success/Error Colors
```jsx
// Success (completed tasks)
className="text-emerald-700 dark:text-emerald-300"
className="bg-emerald-100 dark:bg-emerald-900/30"

// Error
className="text-red-700 dark:text-red-300"
className="bg-red-100 dark:bg-red-900/30"
```

## Common Patterns

### Icon Button
```jsx
<button className="p-2 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {/* Icon path */}
  </svg>
</button>
```

### Badge
```jsx
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
  Badge Text
</span>
```

### Input with Icon
```jsx
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* Icon path */}
    </svg>
  </div>
  <input className="input-field pl-12" type="text" placeholder="With icon" />
</div>
```

### Divider with Text
```jsx
<div className="relative my-8">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-4 bg-white/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400">
      Divider Text
    </span>
  </div>
</div>
```

## Animations

### Fade In
```jsx
<div className="animate-fade-in">Content</div>
```

### Slide Up
```jsx
<div className="animate-slide-up">Content</div>
```

### Slide Down
```jsx
<div className="animate-slide-down">Content</div>
```

### Staggered Animation
```jsx
{items.map((item, index) => (
  <div
    key={item.id}
    style={{ animationDelay: `${index * 50}ms` }}
    className="animate-fade-in"
  >
    {item.content}
  </div>
))}
```

## Responsive Utilities

### Hide/Show by Breakpoint
```jsx
// Hide on mobile, show on desktop
className="hidden md:block"

// Show on mobile, hide on desktop
className="block md:hidden"
```

### Responsive Sizing
```jsx
// Responsive text
className="text-base md:text-lg lg:text-xl"

// Responsive padding
className="p-4 md:p-6 lg:p-8"

// Responsive width
className="w-full md:w-auto"
```

### Responsive Layout
```jsx
// Stack on mobile, row on desktop
className="flex flex-col md:flex-row gap-4"

// Grid with responsive columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

## Dark Mode

### Toggle Dark Mode (if needed in future)
```jsx
// Add to a component
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

### Common Dark Mode Patterns
```jsx
// Background
className="bg-white dark:bg-slate-800"

// Text
className="text-slate-900 dark:text-white"

// Border
className="border-slate-200 dark:border-slate-700"

// Hover
className="hover:bg-slate-50 dark:hover:bg-slate-700"
```

## Accessibility

### Focus States (automatically applied to buttons and inputs)
```jsx
// Custom focus state
className="focus:outline-none focus:ring-4 focus:ring-primary-500/50"
```

### ARIA Labels
```jsx
// Button with aria-label
<button aria-label="Delete task">
  <svg>...</svg>
</button>

// Input with associated label
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Semantic HTML
```jsx
// Use semantic elements
<nav>Navigation</nav>
<main>Main content</main>
<article>Article</article>
<aside>Sidebar</aside>
```

## Common SVG Icons

### Checkmark
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
</svg>
```

### Plus (Add)
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
</svg>
```

### Pencil (Edit)
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
</svg>
```

### Trash (Delete)
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
</svg>
```

### Arrow Right
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
</svg>
```

## Layout Templates

### Page Layout (Dashboard)
```jsx
<div className="min-h-screen p-4 md:p-8">
  <div className="max-w-6xl mx-auto">
    <Navbar />
    <div className="mb-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-2">Page Title</h1>
      <p className="text-slate-600 dark:text-slate-400">Description</p>
    </div>
    {/* Content */}
  </div>
</div>
```

### Auth Page Layout
```jsx
<div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
  {/* Background blur elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 -left-20 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"></div>
  </div>

  <div className="w-full max-w-md relative z-10">
    <div className="glass-card p-8 md:p-10 rounded-3xl">
      {/* Content */}
    </div>
  </div>
</div>
```

## Tips

1. **Consistency**: Use predefined utility classes (btn-primary, card, etc.) for consistency
2. **Spacing**: Stick to 4px increments (p-4, p-6, p-8, etc.)
3. **Colors**: Use semantic colors (primary for actions, accent for variety, emerald for success)
4. **Dark Mode**: Always include dark mode variants (dark:bg-*, dark:text-*)
5. **Accessibility**: Include focus states, aria-labels, and semantic HTML
6. **Responsive**: Design mobile-first, then add md:, lg: breakpoints
7. **Animations**: Use sparingly for important interactions
8. **Gradients**: Apply to headers, buttons, and decorative elements only
