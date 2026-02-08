# Quickstart Guide: Frontend Application & Full-Stack Integration

**Feature**: Frontend Application & Full-Stack Integration
**Date**: 2026-02-01

## Getting Started

This guide will help you quickly set up and run the frontend application with full-stack integration.

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Access to the backend API with JWT authentication enabled
- Better Auth configured on the backend

### Installation

1. Clone or navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Copy the environment configuration:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your configuration:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

### Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open your browser to [http://localhost:3000](http://localhost:3000)

### Key Features

1. **Authentication Flow**:
   - Visit `/signup` to create a new account
   - Use `/login` to authenticate existing users
   - Protected routes automatically redirect unauthenticated users

2. **Task Management**:
   - Access the dashboard at `/dashboard` to view tasks
   - Create new tasks using the form
   - Update or delete existing tasks
   - Toggle task completion status

3. **Responsive Design**:
   - Application works on desktop, tablet, and mobile devices
   - Layout adjusts automatically based on screen size

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting checks

### API Integration

The frontend communicates with the backend through a centralized API client that:
- Automatically attaches JWT tokens to authenticated requests
- Handles loading and error states
- Provides consistent error handling

### Component Structure

Key components include:
- `ProtectedRoute` - Wrapper for authenticated routes
- `TaskForm` - Form for creating and updating tasks
- `TaskCard` - Display component for individual tasks
- `AuthForm` - Reusable component for login/signup forms

### Troubleshooting

1. **Authentication Issues**:
   - Ensure backend API is running and accessible
   - Verify JWT secret matches between frontend and backend
   - Check that authentication endpoints are properly configured

2. **API Connection Problems**:
   - Confirm API base URL is correctly set in environment variables
   - Verify that CORS is properly configured on the backend

3. **Build Errors**:
   - Check that all dependencies are installed
   - Ensure TypeScript compilation succeeds