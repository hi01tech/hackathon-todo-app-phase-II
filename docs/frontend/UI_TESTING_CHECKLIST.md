# TaskFlow UI Testing Checklist

## Pre-Testing Setup

- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Backend API is running and accessible
- [ ] Environment variables configured (.env.local)

---

## Visual Testing

### Landing Page (`/`)
- [ ] Gradient background displays correctly
- [ ] Logo icon renders with gradient
- [ ] "TaskFlow" heading has gradient text
- [ ] Background blur elements are visible
- [ ] Feature badges display properly
- [ ] Both CTA buttons render correctly
- [ ] "Free to use" text is visible
- [ ] Layout is centered and responsive

### Login Page (`/login`)
- [ ] Glassmorphism card displays with blur effect
- [ ] Background decorative elements visible
- [ ] "Back to home" link works
- [ ] Lock icon header displays with gradient
- [ ] Email input has @ icon prefix
- [ ] Password input has lock icon prefix
- [ ] Form labels are clearly visible
- [ ] Submit button shows gradient
- [ ] "Sign up" link is visible and styled
- [ ] Security badge displays at bottom

### Signup Page (`/signup`)
- [ ] Glassmorphism card displays correctly
- [ ] User icon header has gradient background
- [ ] Form inputs have icon prefixes
- [ ] Password hint text is visible
- [ ] Terms notice displays clearly
- [ ] Benefits section shows three items with emojis
- [ ] "Sign in instead" link is visible
- [ ] All colors have proper contrast

### Dashboard Page (`/dashboard`)
- [ ] Navbar displays with glassmorphism
- [ ] TaskFlow logo and brand name visible
- [ ] User profile indicator shows
- [ ] Logout button displays correctly
- [ ] Page heading has gradient text
- [ ] Task statistics display (X of Y completed)
- [ ] Progress bar shows when tasks exist
- [ ] Progress bar fills correctly based on completion
- [ ] "Add New Task" button is prominent
- [ ] Task cards display in a clean list
- [ ] Empty state shows when no tasks exist

---

## Component Testing

### Navbar
- [ ] Logo icon has gradient background
- [ ] TaskFlow text is styled correctly
- [ ] "Stay organized" subtext visible on desktop
- [ ] User avatar displays with gradient
- [ ] User name shows on desktop, hidden on mobile
- [ ] Logout button has red theme
- [ ] Logout icon displays
- [ ] Navbar is sticky on scroll
- [ ] All hover effects work smoothly

### TaskCard
- [ ] Card background is white/slate-800
- [ ] Left border shows (blue for active, green for completed)
- [ ] Checkbox is rounded and styled
- [ ] Checkbox shows checkmark when completed
- [ ] Task title has proper typography
- [ ] Description displays when present
- [ ] Timestamp shows with clock icon
- [ ] Edit button has hover effect
- [ ] Delete button has hover effect
- [ ] Completed tasks show "Done" badge
- [ ] Completed tasks have opacity reduced
- [ ] Text strikethrough works on completed tasks
- [ ] Hover effect scales card slightly

### TaskForm
- [ ] Glassmorphism card displays
- [ ] Icon header shows with gradient (+ for new, pencil for edit)
- [ ] Form title is correct (Create/Edit)
- [ ] Subtitle provides context
- [ ] Title input field styled correctly
- [ ] Description textarea resizes properly
- [ ] Helper text displays below description
- [ ] Cancel button has secondary style
- [ ] Submit button has primary style
- [ ] Button icons display correctly
- [ ] Form validation works
- [ ] Border separator above buttons

### AuthForm
- [ ] Email input has @ icon
- [ ] Password input has lock icon
- [ ] Icons are properly aligned
- [ ] Error messages display with icon
- [ ] Error card has slide-down animation
- [ ] Password hint shows on signup
- [ ] Loading state shows spinner and text
- [ ] Submit button disabled during loading
- [ ] Arrow icon shows on submit button
- [ ] Focus states are visible

### LoadingSpinner
- [ ] Outer ring displays
- [ ] Gradient spinning ring animates
- [ ] Center dot pulses
- [ ] Animation is smooth
- [ ] Size is appropriate

### ErrorMessage
- [ ] Card layout displays correctly
- [ ] Left red border is visible
- [ ] Icon background has red tint
- [ ] Error icon displays
- [ ] Title "Something went wrong" is bold
- [ ] Error message text is clear
- [ ] Retry button shows when enabled
- [ ] Retry button has icon
- [ ] Card has slide-down animation

### EmptyState
- [ ] Large icon container displays
- [ ] Background has gradient
- [ ] Icon is centered and sized correctly
- [ ] Title is bold and prominent
- [ ] Description text is visible
- [ ] Action button displays (if provided)
- [ ] Layout is centered
- [ ] Fade-in animation plays

---

## Interaction Testing

### Navigation
- [ ] Landing page → Login works
- [ ] Landing page → Signup works
- [ ] Login → Signup link works
- [ ] Signup → Login link works
- [ ] Login/Signup → Back to home works
- [ ] Dashboard → Logout redirects to login
- [ ] Protected routes redirect to login when not authenticated

### Task Operations
- [ ] Click "Add New Task" opens form
- [ ] Task form cancel closes form
- [ ] Create task adds to list
- [ ] Task appears with animation
- [ ] Edit button opens edit form
- [ ] Update task saves changes
- [ ] Delete button shows confirmation
- [ ] Delete removes task from list
- [ ] Toggle completion checkbox works
- [ ] Completed task shows green border
- [ ] Progress bar updates on completion
- [ ] Statistics update correctly

### Form Validation
- [ ] Email validation works
- [ ] Password minimum length enforced (6 chars)
- [ ] Empty task title shows validation
- [ ] Form submission disabled during loading
- [ ] Error states display properly
- [ ] Success redirects work

### Hover Effects
- [ ] All buttons show hover state
- [ ] Task cards scale on hover
- [ ] Icon buttons highlight on hover
- [ ] Links underline/change color on hover
- [ ] Navbar logout button highlights
- [ ] Back button arrow moves on hover

### Focus States
- [ ] All inputs show focus ring
- [ ] Buttons show focus ring on keyboard navigation
- [ ] Focus rings have proper color (primary-500)
- [ ] Focus rings are visible in both light and dark mode
- [ ] Tab order is logical

---

## Responsive Testing

### Mobile (320px - 640px)
- [ ] Landing page text is readable
- [ ] CTA buttons stack vertically
- [ ] Auth cards fit screen width
- [ ] Form inputs are full width
- [ ] Navbar collapses properly
- [ ] User name hidden on mobile
- [ ] Task cards display well
- [ ] Task form fits screen
- [ ] Touch targets are 44x44px minimum
- [ ] No horizontal scrolling

### Tablet (640px - 1024px)
- [ ] Layout uses available space
- [ ] Navbar shows more information
- [ ] Task cards have appropriate width
- [ ] Forms are centered with max-width
- [ ] Buttons display side-by-side where appropriate
- [ ] Text sizes are comfortable

### Desktop (1024px+)
- [ ] Content max-width is enforced (1152px)
- [ ] Plenty of whitespace
- [ ] Navbar fully expanded
- [ ] Hover effects are smooth
- [ ] Layout is balanced
- [ ] No elements too stretched

---

## Dark Mode Testing

### Color Scheme
- [ ] Background gradient changes to dark
- [ ] Card backgrounds are slate-800/900
- [ ] Text is light colored (slate-100/300)
- [ ] Borders are visible but subtle
- [ ] Glassmorphism works in dark mode
- [ ] Gradients are visible and vibrant
- [ ] Shadows are appropriate for dark backgrounds

### Contrast
- [ ] All text is readable (4.5:1 minimum)
- [ ] Interactive elements stand out (3:1 minimum)
- [ ] Focus states are visible
- [ ] Hover states are noticeable
- [ ] Error/success colors work in dark mode
- [ ] Badges and pills are readable

### Consistency
- [ ] All pages support dark mode
- [ ] All components support dark mode
- [ ] No flashing/flickering on load
- [ ] Colors are consistent across pages
- [ ] Icons maintain visibility

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab key moves focus logically
- [ ] Enter key activates buttons/links
- [ ] Escape key closes forms
- [ ] Shift+Tab moves backward
- [ ] Focus is trapped in modals (if any)
- [ ] Skip links work (if implemented)

### Screen Reader Testing
- [ ] Page titles are announced
- [ ] Headings are properly nested (h1 → h2 → h3)
- [ ] Form labels are associated with inputs
- [ ] Button purposes are clear
- [ ] Error messages are announced
- [ ] Status updates are announced (if using aria-live)
- [ ] Images have alt text (if any)

### ARIA
- [ ] aria-label on icon-only buttons
- [ ] aria-describedby for helper text
- [ ] aria-invalid on error fields
- [ ] role attributes where needed
- [ ] aria-live for dynamic content

### Color Contrast
- [ ] Run WAVE or axe DevTools
- [ ] Check primary text (should be 4.5:1+)
- [ ] Check secondary text (should be 4.5:1+)
- [ ] Check button text (should be 4.5:1+)
- [ ] Check link text (should be 4.5:1+)
- [ ] Check placeholders (can be 3:1)
- [ ] Check disabled states (exempted)

---

## Animation Testing

### Smooth Transitions
- [ ] Fade-in animation is smooth (300ms)
- [ ] Slide-up animation works on forms
- [ ] Slide-down animation works on errors
- [ ] Hover scale effects are subtle
- [ ] Button press effects work
- [ ] Progress bar fills smoothly

### Staggered Animations
- [ ] Task cards animate in sequence
- [ ] Delay is appropriate (50ms each)
- [ ] No layout shift during animation

### Reduced Motion
- [ ] Test with `prefers-reduced-motion` enabled
- [ ] Animations should be minimal/instant

---

## Performance Testing

### Load Times
- [ ] Initial page load is fast (<3s)
- [ ] No cumulative layout shift (CLS)
- [ ] Fonts load without FOUT
- [ ] Images lazy load (if any)

### Runtime Performance
- [ ] Smooth scrolling
- [ ] No jank during animations
- [ ] Task list renders quickly
- [ ] Form inputs are responsive

### Network
- [ ] Test on slow 3G
- [ ] Check API call efficiency
- [ ] No unnecessary re-renders

---

## Cross-Browser Testing

### Chrome/Edge (Chromium)
- [ ] All features work
- [ ] Glassmorphism displays correctly
- [ ] Animations are smooth
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Backdrop-blur supported (Firefox 103+)
- [ ] Colors display correctly
- [ ] No console errors

### Safari (Desktop)
- [ ] All features work
- [ ] Backdrop-blur works
- [ ] Gradients render correctly
- [ ] Smooth scrolling works

### Safari (iOS)
- [ ] Touch interactions work
- [ ] Viewport sizing correct
- [ ] No input zoom issues
- [ ] Smooth scrolling

---

## Edge Cases

### Empty States
- [ ] No tasks shows empty state
- [ ] Loading state displays properly
- [ ] Error state shows correctly

### Long Content
- [ ] Long task titles wrap properly
- [ ] Long descriptions display well
- [ ] Forms handle long input

### Errors
- [ ] Network errors display
- [ ] Validation errors clear
- [ ] Failed operations show feedback

### Authentication
- [ ] Login with wrong credentials shows error
- [ ] Signup with existing email shows error
- [ ] Session expiration redirects to login
- [ ] Logout clears state

---

## Final Checks

- [ ] No console errors in browser
- [ ] No console warnings about accessibility
- [ ] No missing images or broken icons
- [ ] All links work
- [ ] All buttons work
- [ ] Forms submit correctly
- [ ] Data persists correctly
- [ ] Back/forward navigation works
- [ ] Page refresh doesn't break state
- [ ] TypeScript compiles without errors
- [ ] Build succeeds (`npm run build`)

---

## Sign-Off

**Tested by**: _________________
**Date**: _________________
**Browser(s)**: _________________
**Device(s)**: _________________
**Notes**:

---

## Issues Found

| Issue | Priority | Page/Component | Status |
|-------|----------|----------------|--------|
|       |          |                |        |
|       |          |                |        |
|       |          |                |        |

---

## Next Steps After Testing

1. Fix any critical issues found
2. Document any design improvements needed
3. Consider adding additional features:
   - Dark mode toggle switch
   - Keyboard shortcuts
   - Task filtering/sorting
   - Task search
   - Task categories/tags
4. Optimize performance if needed
5. Deploy to staging/production
