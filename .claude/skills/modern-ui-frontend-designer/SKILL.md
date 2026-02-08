---
name: "modern-ui-frontend-designer"
description: "Design and generate a modern, minimal, professional frontend UI for full-stack applications with strong accessibility, contrast, and responsive layout using Tailwind CSS or CSS modules."
version: "1.0.0"
---

# Modern UI Frontend Design Skill

## When to Use This Skill

- User wants to design or generate a **modern frontend UI** for a web application
- Application requires **professional, clean, minimal UI**
- Project uses **Tailwind CSS, CSS Modules, or utility-first styling**
- Needs **light & dark mode**, accessibility, and strong color contrast
- User wants **glassmorphism effects** applied selectively

---

## Design Goals

- Modern, minimal, professional UI (startup / SaaS quality)
- Clean spacing, strong typography hierarchy
- Light gradient-based theme (not flashy)
- High readability and accessibility
- Consistent component styling across the app
- Responsive layout (mobile-first)

---

## Visual Style & Theme Guidelines

### 1. Theme & Color System

- Provide **both Light Mode and Dark Mode**
- Use a **professional light gradient background** (e.g. soft blue, violet, or neutral gray gradients)
- Avoid harsh colors or neon tones

**Light Mode**
- Background: very light gradient or off-white (`#f8fafc`, `#f1f5f9`)
- Text: dark and highly readable (`#0f172a`, `#1e293b`)
- Headings: slightly darker than body text
- Buttons: solid primary color with good contrast
- Borders: subtle (`rgba(0,0,0,0.08)`)

**Dark Mode**
- Background: dark neutral or gradient (`#020617`, `#020617 → #0f172a`)
- Text: light and readable (`#e5e7eb`, `#f8fafc`)
- Headings: bright but not pure white
- Buttons: slightly muted but still high contrast
- Borders: subtle light opacity (`rgba(255,255,255,0.1)`)

⚠️ Ensure **WCAG-compliant contrast** across:
- Headings
- Paragraph text
- Buttons
- Links
- Form labels & placeholders

---

### 2. Typography

- Use modern, professional fonts (e.g. `Inter`, `Poppins`, `Roboto`)
- Clear hierarchy:
  - H1: bold, prominent
  - H2/H3: structured, readable
  - Body: comfortable line-height (1.6–1.75)
- Avoid decorative fonts

---

### 3. Layout & Structure

- Clean layout with generous whitespace
- Card-based UI for todo items
- Consistent padding and spacing
- Grid/Flex-based responsive design
- Sticky or minimal header if needed
- Sidebar optional (collapsed on mobile)

---

### 4. Forms & Inputs (Very Important)

- Use **Tailwind CSS** or **CSS Modules**
- Inputs should be:
  - Rounded corners
  - Clear focus states
  - Soft shadows or border highlights
- Labels always visible (not only placeholders)
- Error and success states clearly visible
- Buttons with hover, focus, and disabled states

Example:
- Add Todo form
- Edit Todo modal
- Search / filter input

---

### 5. Glassmorphism (Use Selectively)

Apply glassmorphism ONLY where it adds value:
- Modals
- Cards
- Floating panels
- Header or navbar

Glassmorphism rules:
- `backdrop-blur-md` or `backdrop-blur-lg`
- Semi-transparent background (`rgba(255,255,255,0.6)` in light mode)
- Dark mode equivalent with subtle opacity
- Soft border and shadow
- Avoid overuse (keep UI clean)

---

### 6. Components to Design

Design the following components consistently:

- Navbar / Header
- Todo List
- Todo Card
- Add Todo Form
- Edit Todo Modal
- Delete Confirmation
- Buttons (Primary, Secondary, Danger)
- Empty State
- Loading State
- Error State
- Footer (minimal)

---

## Tech & Styling Requirements

- Use **Tailwind CSS** OR **CSS Modules**
- Utility-first approach preferred
- Support theme switching (light / dark)
- Clean class naming and structure
- Avoid inline styles unless necessary
- Ensure responsiveness across devices

---

## Output Requirements

When generating the UI:

- Provide:
  - Component structure
  - Styling approach
  - Theme tokens (colors, spacing, typography)
- Follow modern frontend best practices
- Ensure readability and accessibility
- Maintain professional SaaS-level polish

---

## Quality Checklist

A frontend UI is complete when:

- Text is readable in both light and dark modes
- Color contrast is consistent and accessible
- UI feels modern, minimal, and professional
- Glassmorphism is subtle and tasteful
- Forms are user-friendly and visually clear
- Layout adapts well to mobile, tablet, and desktop
- No visual clutter or unnecessary decoration
